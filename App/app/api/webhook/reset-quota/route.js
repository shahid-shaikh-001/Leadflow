export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";

export async function POST(req) {
  try {
    const body = await req.json();

    const { eventId } = body;

    if (!eventId) {
      return error("Webhook eventId is required", 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      const alreadyProcessed = await tx.processedWebhook.findUnique({
        where: {
          id: eventId,
        },
      });

      if (alreadyProcessed) {
        return {
          alreadyProcessed: true,
          message: "Webhook already processed. No duplicate reset applied.",
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
          type: "QUOTA_RESET",
        },
      });

      return {
        alreadyProcessed: false,
        message: "Provider quotas reset successfully.",
      };
    });

    return success(result, result.message);
  } catch (err) {
    console.error("Webhook error:", err);
    return error("Failed to process webhook", 500);
  }
}