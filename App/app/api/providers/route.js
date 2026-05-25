import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";

export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return success(providers, "Providers fetched successfully");
  } catch (err) {
    console.error("Providers fetch error:", err);
    return error("Failed to fetch providers", 500);
  }
}