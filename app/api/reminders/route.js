import { NextResponse } from "next/server";
import { ApplicationsService } from "@/lib/services/applications.service";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * GET /api/reminders
 * Retrieves all overdue and upcoming follow-ups and scheduled interviews.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    const reminders = await ApplicationsService.getReminders(user?.id);
    return NextResponse.json({ success: true, ...reminders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load reminders." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/reminders
 * Toggles a reminder's completed state.
 * Body: { applicationId: string, completed: boolean }
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { applicationId, completed = true } = body;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "Application ID is required." },
        { status: 400 }
      );
    }

    const updated = await ApplicationsService.markReminderCompleted(
      applicationId,
      completed
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update reminder." },
      { status: 500 }
    );
  }
}
