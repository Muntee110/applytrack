import { db } from "@/lib/db";
import { validateApplicationData } from "@/lib/types/application";
import { APPLICATION_STATUS } from "@/lib/utils/constants";

/**
 * Applications Business Logic Service
 */
export const ApplicationsService = {
  /**
   * Retrieves applications matching filter/search criteria
   */
  async listApplications(params = {}) {
    return db.findMany(params);
  },

  /**
   * Gets a single application by ID
   */
  async getApplication(id) {
    if (!id) return null;
    return db.findById(id);
  },

  /**
   * Creates an application after validating input
   */
  async createApplication(input) {
    const validation = validateApplicationData(input);
    if (!validation.isValid) {
      throw new Error(
        Object.values(validation.errors).join(" ") || "Invalid application data."
      );
    }

    return db.create(input);
  },

  /**
   * Updates an existing application
   */
  async updateApplication(id, updates) {
    if (!id) throw new Error("Application ID is required.");

    const existing = await db.findById(id);
    if (!existing) {
      throw new Error("Application not found.");
    }

    if (updates.company || updates.role || updates.url) {
      const validation = validateApplicationData({
        ...existing,
        ...updates,
      });
      if (!validation.isValid) {
        throw new Error(
          Object.values(validation.errors).join(" ") || "Invalid application data."
        );
      }
    }

    return db.update(id, updates);
  },

  /**
   * Quick status mutation (e.g. dragging across board or dropdown select)
   */
  async updateStatus(id, status) {
    if (!id) throw new Error("Application ID is required.");
    if (!APPLICATION_STATUS[status]) {
      throw new Error(`Invalid status: ${status}`);
    }

    return db.update(id, { status });
  },

  /**
   * Deletes an application
   */
  async deleteApplication(id) {
    if (!id) throw new Error("Application ID is required.");
    return db.delete(id);
  },

  /**
   * Computes key metrics and dashboard summary stats
   */
  async getDashboardMetrics() {
    return db.getMetrics();
  },
};
