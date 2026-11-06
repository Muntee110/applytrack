"use server";

import { revalidatePath } from "next/cache";
import { ApplicationsService } from "@/lib/services/applications.service";
import { requireAuth } from "@/lib/auth/session";

/**
 * Creates a new job application
 * @param {Object} formData
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
export async function createApplicationAction(formData) {
  try {
    await requireAuth();

    // Support both plain objects and FormData instances
    const data =
      formData instanceof FormData
        ? Object.fromEntries(formData.entries())
        : formData;

    const created = await ApplicationsService.createApplication(data);

    revalidatePath("/applications");
    revalidatePath("/");

    return { success: true, data: created };
  } catch (error) {
    console.error("Failed to create application:", error);
    return {
      success: false,
      error: error.message || "Failed to create application.",
    };
  }
}

/**
 * Updates application pipeline status
 * @param {string} id
 * @param {string} status
 */
export async function updateApplicationStatusAction(id, status) {
  try {
    await requireAuth();

    if (!id || !status) {
      return { success: false, error: "ID and status are required." };
    }

    const updated = await ApplicationsService.updateStatus(id, status);

    revalidatePath("/applications");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update status:", error);
    return {
      success: false,
      error: error.message || "Failed to update application status.",
    };
  }
}

/**
 * Updates an entire application's details
 * @param {string} id
 * @param {Object} updates
 */
export async function updateApplicationAction(id, updates) {
  try {
    await requireAuth();

    if (!id) {
      return { success: false, error: "Application ID is required." };
    }

    const updated = await ApplicationsService.updateApplication(id, updates);

    revalidatePath("/applications");
    revalidatePath(`/applications/${id}`);
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update application:", error);
    return {
      success: false,
      error: error.message || "Failed to update application.",
    };
  }
}

/**
 * Deletes a job application
 * @param {string} id
 */
export async function deleteApplicationAction(id) {
  try {
    await requireAuth();

    if (!id) {
      return { success: false, error: "Application ID is required." };
    }

    await ApplicationsService.deleteApplication(id);

    revalidatePath("/applications");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete application:", error);
    return {
      success: false,
      error: error.message || "Failed to delete application.",
    };
  }
}
