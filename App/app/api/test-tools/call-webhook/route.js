export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";

export async function POST() {
  try {
    const eventId = "test-quota-reset-event-001";

    const result = await prisma.$transaction(async (tx) => {
      const alreadyProcessed = await tx.processedWebhook.findUnique({
        where: {
          id: eventId,
        },
      });

      if (alreadyProcessed) {
        return {
          alreadyProcessed: true,
          message: "Same webhook event called again. No duplicate reset.",
        };
      }

      await tx.provider.updateMany({
        data: {
          monthlyQuota: 10,
        },
      });

      await tx.processedWebhook.create({
        data: {
          id: eventId,
          type: "QUOTA_RESET_TEST",
        },
      });

      return {
        alreadyProcessed: false,
        message: "Test webhook processed and quotas reset.",
      };
    });

    return success(result, result.message);
  } catch (err) {
    console.error("Test webhook error:", err);
    return error("Failed to call test webhook", 500);
  }
}