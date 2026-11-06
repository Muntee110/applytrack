import { INITIAL_APPLICATIONS } from "./mock-data";
import { APPLICATION_STATUS } from "@/lib/utils/constants";

// Global cache to maintain state across hot-reloads and Server Actions in development
const globalForDb = globalThis;
if (!globalForDb._applytrack_db) {
  globalForDb._applytrack_db = [...INITIAL_APPLICATIONS];
}

/**
 * Data Access Layer (Repository Pattern)
 * Designed to mirror Prisma or Drizzle ORM methods for seamless database swap.
 */
export const db = {
  /**
   * Retrieves applications based on filtering, search, and sorting
   * @param {Object} [params]
   * @param {string} [params.search]
   * @param {string} [params.status]
   * @param {string} [params.workplace]
   * @param {string} [params.sortBy='appliedDate']
   * @param {'asc' | 'desc'} [params.sortOrder='desc']
   * @returns {Promise<import('@/lib/types/application').JobApplication[]>}
   */
  async findMany(params = {}) {
    // Simulate slight asynchronous network/database latency
    await new Promise((r) => setTimeout(r, 10));

    let items = [...globalForDb._applytrack_db];

    // Filter by Search Query (Company, Role, Notes, Location)
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        (app) =>
          app.company.toLowerCase().includes(q) ||
          app.role.toLowerCase().includes(q) ||
          (app.location && app.location.toLowerCase().includes(q)) ||
          (app.notes && app.notes.toLowerCase().includes(q))
      );
    }

    // Filter by Pipeline Status
    if (params.status && params.status !== "ALL") {
      items = items.filter((app) => app.status === params.status);
    }

    // Filter by Workplace Type
    if (params.workplace && params.workplace !== "ALL") {
      items = items.filter((app) => app.workplaceType === params.workplace);
    }

    // Sorting
    const sortBy = params.sortBy || "appliedDate";
    const sortOrder = params.sortOrder === "asc" ? 1 : -1;

    items.sort((a, b) => {
      const valA = a[sortBy] || "";
      const valB = b[sortBy] || "";
      if (valA < valB) return -1 * sortOrder;
      if (valA > valB) return 1 * sortOrder;
      return 0;
    });

    return items;
  },

  /**
   * Find a single application by ID
   * @param {string} id
   * @returns {Promise<import('@/lib/types/application').JobApplication | null>}
   */
  async findById(id) {
    await new Promise((r) => setTimeout(r, 10));
    const found = globalForDb._applytrack_db.find((app) => app.id === id);
    return found ? { ...found } : null;
  },

  /**
   * Create a new application
   * @param {Omit<import('@/lib/types/application').JobApplication, 'id' | 'createdAt' | 'updatedAt'>} data
   * @returns {Promise<import('@/lib/types/application').JobApplication>}
   */
  async create(data) {
    await new Promise((r) => setTimeout(r, 10));

    const now = new Date().toISOString();
    const newRecord = {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      company: data.company.trim(),
      role: data.role.trim(),
      status: data.status || APPLICATION_STATUS.APPLIED,
      workplaceType: data.workplaceType || "Remote",
      location: data.location?.trim() || "",
      salary: data.salary?.trim() || "",
      url: data.url?.trim() || "",
      stage: data.stage?.trim() || "Application Submitted",
      priority: data.priority || "Medium",
      contactName: data.contactName?.trim() || "",
      contactEmail: data.contactEmail?.trim() || "",
      notes: data.notes?.trim() || "",
      appliedDate: data.appliedDate || now,
      createdAt: now,
      updatedAt: now,
    };

    globalForDb._applytrack_db.unshift(newRecord);
    return { ...newRecord };
  },

  /**
   * Update an existing application
   * @param {string} id
   * @param {Partial<import('@/lib/types/application').JobApplication>} updates
   * @returns {Promise<import('@/lib/types/application').JobApplication | null>}
   */
  async update(id, updates) {
    await new Promise((r) => setTimeout(r, 10));

    const index = globalForDb._applytrack_db.findIndex((app) => app.id === id);
    if (index === -1) return null;

    const existing = globalForDb._applytrack_db[index];
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    globalForDb._applytrack_db[index] = updated;
    return { ...updated };
  },

  /**
   * Delete an application by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    await new Promise((r) => setTimeout(r, 10));

    const initialLength = globalForDb._applytrack_db.length;
    globalForDb._applytrack_db = globalForDb._applytrack_db.filter(
      (app) => app.id !== id
    );
    return globalForDb._applytrack_db.length < initialLength;
  },

  /**
   * Compute aggregate pipeline KPIs & metrics
   * @returns {Promise<{
   *   total: number,
   *   active: number,
   *   interviewing: number,
   *   offers: number,
   *   rejected: number,
   *   wishlist: number,
   *   interviewRate: string,
   *   offerRate: string
   * }>}
   */
  async getMetrics() {
    await new Promise((r) => setTimeout(r, 10));

    const apps = globalForDb._applytrack_db;
    const total = apps.length;
    const wishlist = apps.filter((a) => a.status === APPLICATION_STATUS.WISHLIST).length;
    const applied = apps.filter((a) => a.status === APPLICATION_STATUS.APPLIED).length;
    const interviewing = apps.filter((a) => a.status === APPLICATION_STATUS.INTERVIEWING).length;
    const offers = apps.filter((a) => a.status === APPLICATION_STATUS.OFFER).length;
    const rejected = apps.filter((a) => a.status === APPLICATION_STATUS.REJECTED).length;

    // Active pipeline excludes wishlist & rejected/archived
    const active = applied + interviewing + offers;

    // Interview rate = (interviews + offers) / (total - wishlist)
    const processedApplications = total - wishlist;
    const interviewRate =
      processedApplications > 0
        ? `${Math.round(((interviewing + offers) / processedApplications) * 100)}%`
        : "0%";

    // Offer rate = offers / (interviews + offers)
    const totalReachedInterview = interviewing + offers;
    const offerRate =
      totalReachedInterview > 0
        ? `${Math.round((offers / totalReachedInterview) * 100)}%`
        : "0%";

    return {
      total,
      active,
      interviewing,
      offers,
      rejected,
      wishlist,
      interviewRate,
      offerRate,
    };
  },
};
