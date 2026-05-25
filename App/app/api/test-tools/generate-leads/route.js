import { prisma } from "@/lib/prisma";
import { allocateProviders } from "@/lib/allocation";
import { success, error } from "@/lib/apiResponse";

const services = ["SERVICE_1", "SERVICE_2", "SERVICE_3"];

function createTestLead(index) {
  return {
    name: `Test Customer ${Date.now()}-${index}`,
    phone: `9${Date.now().toString().slice(-8)}${index}`,
    city: "Mumbai",
    serviceType: services[index % services.length],
    description: "Auto-generated test lead for concurrency testing",
  };
}

async function createLeadWithAllocation(leadData) {
  return prisma.$transaction(
    async (tx) => {
      const lead = await tx.lead.create({
        data: leadData,
      });

      const assignedProviders = await allocateProviders(tx, lead);

      return {
        leadId: lead.id,
        phone: lead.phone,
        serviceType: lead.serviceType,
        assignedProviders,
      };
    },
    {
      maxWait: 60000,
      timeout: 60000,
    }
  );
}

export async function POST() {
  try {
    const leadInputs = Array.from({ length: 10 }, (_, index) =>
      createTestLead(index)
    );

    const results = await Promise.allSettled(
      leadInputs.map((leadData) => createLeadWithAllocation(leadData))
    );

    const created = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    const failed = results
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason.message || String(result.reason));

    return success(
      {
        totalRequested: 10,
        createdCount: created.length,
        failedCount: failed.length,
        created,
        failed,
      },
      "Test leads generated"
    );
  } catch (err) {
    console.error("Generate leads error:", err);
    return error("Failed to generate test leads", 500);
  }
}