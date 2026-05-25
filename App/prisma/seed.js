import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL,
});

const prisma = new PrismaClient({
  adapter,
  transactionOptions: {
    maxWait: 60000,
    timeout: 60000,
  },
});

async function main() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE 
      "LeadAssignment",
      "Lead",
      "AllocationState",
      "ProcessedWebhook",
      "Provider"
    RESTART IDENTITY CASCADE;
  `);

  await prisma.provider.createMany({
    data: [
      { id: 1, name: "Provider 1", monthlyQuota: 10, leadsReceived: 0 },
      { id: 2, name: "Provider 2", monthlyQuota: 10, leadsReceived: 0 },
      { id: 3, name: "Provider 3", monthlyQuota: 10, leadsReceived: 0 },
      { id: 4, name: "Provider 4", monthlyQuota: 10, leadsReceived: 0 },
      { id: 5, name: "Provider 5", monthlyQuota: 10, leadsReceived: 0 },
      { id: 6, name: "Provider 6", monthlyQuota: 10, leadsReceived: 0 },
      { id: 7, name: "Provider 7", monthlyQuota: 10, leadsReceived: 0 },
      { id: 8, name: "Provider 8", monthlyQuota: 10, leadsReceived: 0 },
    ],
  });

  await prisma.allocationState.createMany({
    data: [
      { serviceType: "SERVICE_1", currentIndex: 0 },
      { serviceType: "SERVICE_2", currentIndex: 0 },
      { serviceType: "SERVICE_3", currentIndex: 0 },
    ],
  });

  console.log("Database seeded successfully ✅");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });