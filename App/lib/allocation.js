import {
  MANDATORY_PROVIDERS,
  PROVIDER_POOLS,
  TOTAL_PROVIDERS_PER_LEAD,
} from "./constants.js";

export async function allocateProviders(tx, lead) {
  const serviceType = lead.serviceType;

  const mandatoryProviders = MANDATORY_PROVIDERS[serviceType] || [];
  const providerPool = PROVIDER_POOLS[serviceType] || [];

  const selectedProviders = [];

  // 1. Add mandatory providers first
  for (const providerId of mandatoryProviders) {
    const provider = await tx.provider.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      throw new Error(`Mandatory provider ${providerId} not found`);
    }

    if (provider.monthlyQuota <= 0) {
      throw new Error(`Mandatory provider ${providerId} has no quota left`);
    }

    selectedProviders.push(providerId);
  }

  // 2. Lock allocation state row for concurrency-safe round-robin
  await tx.$queryRaw`
    SELECT id FROM "AllocationState"
    WHERE "serviceType" = ${serviceType}::"ServiceType"
    FOR UPDATE
  `;

  const allocationState = await tx.allocationState.findUnique({
    where: { serviceType },
  });

  if (!allocationState) {
    throw new Error(`Allocation state missing for ${serviceType}`);
  }

  let currentIndex = allocationState.currentIndex;
  let attempts = 0;

  // 3. Fill remaining provider slots fairly
  while (
    selectedProviders.length < TOTAL_PROVIDERS_PER_LEAD &&
    attempts < providerPool.length
  ) {
    const providerId = providerPool[currentIndex % providerPool.length];

    currentIndex++;
    attempts++;

    if (selectedProviders.includes(providerId)) {
      continue;
    }

    const provider = await tx.provider.findUnique({
      where: { id: providerId },
    });

    if (!provider || provider.monthlyQuota <= 0) {
      continue;
    }

    selectedProviders.push(providerId);
  }

  // 4. If exactly 3 providers not found, reject safely
  if (selectedProviders.length !== TOTAL_PROVIDERS_PER_LEAD) {
    throw new Error("Not enough providers with available quota");
  }

  // 5. Save assignments and update quotas
  for (const providerId of selectedProviders) {
    await tx.leadAssignment.create({
      data: {
        leadId: lead.id,
        providerId,
      },
    });

    await tx.provider.update({
      where: { id: providerId },
      data: {
        monthlyQuota: {
          decrement: 1,
        },
        leadsReceived: {
          increment: 1,
        },
      },
    });
  }

  // 6. Persist round-robin state
  await tx.allocationState.update({
    where: { serviceType },
    data: {
      currentIndex: currentIndex % providerPool.length,
    },
  });

  return selectedProviders;
}