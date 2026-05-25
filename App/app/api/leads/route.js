export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { allocateProviders } from "@/lib/allocation";
import { validateLeadInput } from "@/lib/validations";
import { success, error } from "@/lib/apiResponse";

export async function POST(req) {
  try {
    const body = await req.json();

    const validationError = validateLeadInput(body);

    if (validationError) {
      return error(validationError, 400);
    }

    const { name, phone, city, serviceType, description } = body;

    const result = await prisma.$transaction(
  async (tx) => {
    const lead = await tx.lead.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        serviceType,
        description: description.trim(),
      },
    });

    const assignedProviders = await allocateProviders(tx, lead);

    return {
      lead,
      assignedProviders,
    };
  },
  {
    maxWait: 60000,
    timeout: 60000,
  }
);

    return success(result, "Lead created and assigned successfully", 201);
  } catch (err) {
    console.error("Lead create error:", err);

    if (err.code === "P2002") {
      return error(
        "Duplicate lead: same phone number cannot request the same service again",
        409
      );
    }

    return error(err.message || "Failed to create lead", 500);
  }
}