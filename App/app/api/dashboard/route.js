export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/apiResponse";


export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        assignments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            lead: true,
          },
        },
      },
    });

    const dashboardData = providers.map((provider) => ({
      id: provider.id,
      name: provider.name,
      remainingQuota: provider.monthlyQuota,
      leadsReceived: provider.leadsReceived,
      assignedLeads: provider.assignments.map((assignment) => ({
        assignmentId: assignment.id,
        leadId: assignment.lead.id,
        customerName: assignment.lead.name,
        phone: assignment.lead.phone,
        city: assignment.lead.city,
        serviceType: assignment.lead.serviceType,
        description: assignment.lead.description,
        assignedAt: assignment.createdAt,
      })),
    }));

    return success(dashboardData, "Dashboard data fetched successfully");
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    return error("Failed to fetch dashboard data", 500);
  }
}