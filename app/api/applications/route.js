import { NextResponse } from "next/server";
import { ApplicationsService } from "@/lib/services/applications.service";

/**
 * GET /api/applications
 * Returns applications with optional query params (?search=&status=&workplace=)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const workplace = searchParams.get("workplace") || undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const sortOrder = searchParams.get("sortOrder") || undefined;

    const data = await ApplicationsService.listApplications({
      search,
      status,
      workplace,
      sortBy,
      sortOrder,
    });

    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch applications." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/applications
 * Creates a new job application
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const created = await ApplicationsService.createApplication(body);

    return NextResponse.json(
      { success: true, data: created },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create application." },
      { status: 400 }
    );
  }
}
