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
   * @param {string} [params.dateRange]
   * @param {string} [params.sort]
   * @param {string} [params.sortBy='appliedDate']
   * @param {'asc' | 'desc'} [params.sortOrder='desc']
   * @param {string} [params.userId]
   * @returns {Promise<import('@/lib/types/application').JobApplication[]>}
   */
  async findMany(params = {}) {
    // Simulate slight asynchronous network/database latency
    await new Promise((r) => setTimeout(r, 10));

    let items = [...globalForDb._applytrack_db];

    // Filter by User ID if provided
    if (params.userId) {
      const userItems = items.filter((app) => app.userId === params.userId);
      if (userItems.length > 0) {
        items = userItems;
      }
    }

    // Filter by Search Query (Company, Role, Notes, Location)
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        (app) =>
          (app.company && app.company.toLowerCase().includes(q)) ||
          (app.role && app.role.toLowerCase().includes(q)) ||
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
      items = items.filter((app) => {
        if (params.workplace === "On-site" || params.workplace === "Onsite") {
          return app.workplaceType === "On-site" || app.workplaceType === "Onsite";
        }
        return app.workplaceType === params.workplace;
      });
    }

    // Filter by Date Range
    if (params.dateRange && params.dateRange !== "ALL") {
      const now = new Date();
      items = items.filter((app) => {
        const appDate = new Date(app.appliedDate || app.createdAt);
        if (isNaN(appDate.getTime())) return true;
        const diffDays = (now.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24);

        if (params.dateRange === "7d") return diffDays <= 7;
        if (params.dateRange === "30d") return diffDays <= 30;
        if (params.dateRange === "90d") return diffDays <= 90;
        if (params.dateRange === "this_year") {
          return appDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    // Sorting
    const sort = params.sort || params.sortBy || "newest";
    items.sort((a, b) => {
      if (sort === "newest") {
        return (
          new Date(b.appliedDate || b.createdAt).getTime() -
          new Date(a.appliedDate || a.createdAt).getTime()
        );
      }
      if (sort === "oldest") {
        return (
          new Date(a.appliedDate || a.createdAt).getTime() -
          new Date(b.appliedDate || b.createdAt).getTime()
        );
      }
      if (sort === "company_asc") {
        return (a.company || "").localeCompare(b.company || "");
      }
      if (sort === "company_desc") {
        return (b.company || "").localeCompare(a.company || "");
      }
      if (sort === "status") {
        const statusOrder = {
          WISHLIST: 1,
          APPLIED: 2,
          INTERVIEWING: 3,
          OFFER: 4,
          REJECTED: 5,
          ARCHIVED: 6,
        };
        return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
      }

      // Default sorting by field
      const sortBy = params.sortBy || "appliedDate";
      const sortOrder = params.sortOrder === "asc" ? 1 : -1;
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
      userId: data.userId || null,
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
      followUpDate: data.followUpDate || null,
      followUpCompleted: Boolean(data.followUpCompleted),
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
   * @param {string} [userId]
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
  async getMetrics(userId) {
    await new Promise((r) => setTimeout(r, 10));

    let apps = globalForDb._applytrack_db;
    if (userId) {
      const userApps = apps.filter((a) => a.userId === userId);
      if (userApps.length > 0) apps = userApps;
    }

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

  /**
   * Compute full suite of advanced analytics for the Analytics Dashboard
   * @param {string} [userId]
   */
  async getAdvancedAnalytics(userId) {
    await new Promise((r) => setTimeout(r, 10));

    let apps = globalForDb._applytrack_db;
    if (userId) {
      const userApps = apps.filter((a) => a.userId === userId);
      if (userApps.length > 0) apps = userApps;
    }

    const metrics = await this.getMetrics(userId);

    // 1. Workplace Distribution Breakdown
    const workplaceCounts = { Remote: 0, Hybrid: 0, "On-site": 0 };
    apps.forEach((a) => {
      const type = a.workplaceType === "Onsite" ? "On-site" : a.workplaceType || "Remote";
      if (workplaceCounts[type] !== undefined) {
        workplaceCounts[type]++;
      } else {
        workplaceCounts["Remote"]++;
      }
    });

    const workplaceDistribution = Object.entries(workplaceCounts).map(([type, count]) => ({
      type,
      count,
      percentage: metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0,
    }));

    // 2. Monthly Application Activity (last 6 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const monthlyActivity = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const yr = d.getFullYear();
      const label = `${monthNames[mIdx]}`;

      const count = apps.filter((a) => {
        const ad = new Date(a.appliedDate || a.createdAt);
        return ad.getMonth() === mIdx && ad.getFullYear() === yr;
      }).length;

      monthlyActivity.push({
        month: label,
        year: yr,
        count,
      });
    }

    // 3. Status Distribution
    const statusDistribution = [
      { status: APPLICATION_STATUS.APPLIED, count: metrics.active - metrics.interviewing - metrics.offers },
      { status: APPLICATION_STATUS.INTERVIEWING, count: metrics.interviewing },
      { status: APPLICATION_STATUS.OFFER, count: metrics.offers },
      { status: APPLICATION_STATUS.WISHLIST, count: metrics.wishlist },
      { status: APPLICATION_STATUS.REJECTED, count: metrics.rejected },
    ].map((item) => ({
      ...item,
      percentage: metrics.total > 0 ? Math.round((item.count / metrics.total) * 100) : 0,
    }));

    // 4. Top Companies Applied To
    const companyMap = {};
    apps.forEach((a) => {
      const name = a.company || "Other";
      if (!companyMap[name]) {
        companyMap[name] = {
          company: name,
          count: 0,
          latestRole: a.role,
          status: a.status,
          appliedDate: a.appliedDate || a.createdAt,
        };
      }
      companyMap[name].count++;
    });

    const topCompanies = Object.values(companyMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // 5. Recent Activity Timeline
    const recentActivity = [...apps]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.appliedDate).getTime() -
          new Date(a.updatedAt || a.appliedDate).getTime()
      )
      .slice(0, 6)
      .map((a) => ({
        id: a.id,
        company: a.company,
        role: a.role,
        status: a.status,
        stage: a.stage || "Application Submitted",
        date: a.updatedAt || a.appliedDate,
        notes: a.notes,
      }));

    // 6. Application Trends & Weekly Velocity
    const totalWeeks = 4;
    const weeklyVelocity = metrics.total > 0 ? Math.max(1, Math.round((metrics.total / totalWeeks) * 10) / 10) : 0;

    return {
      metrics,
      workplaceDistribution,
      monthlyActivity,
      statusDistribution,
      topCompanies,
      recentActivity,
      weeklyVelocity,
    };
  },

  /**
   * Retrieves follow-up reminders and scheduled deadlines
   * @param {string} [userId]
   */
  async getReminders(userId) {
    await new Promise((r) => setTimeout(r, 10));

    let apps = globalForDb._applytrack_db;
    if (userId) {
      const userApps = apps.filter((a) => a.userId === userId);
      if (userApps.length > 0) apps = userApps;
    }

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const reminders = [];

    apps.forEach((app) => {
      // 1. Follow-up reminder if set
      if (app.followUpDate) {
        const fDateStr = app.followUpDate.split("T")[0];
        const isOverdue = fDateStr < todayStr && !app.followUpCompleted;

        reminders.push({
          id: `rem_${app.id}_followup`,
          applicationId: app.id,
          company: app.company,
          role: app.role,
          type: isOverdue ? "OVERDUE_FOLLOW_UP" : "UPCOMING_FOLLOW_UP",
          title: `Follow up with ${app.company}`,
          description: app.stage ? `Stage: ${app.stage}` : `Follow up regarding ${app.role}`,
          dueDate: app.followUpDate,
          isOverdue,
          isCompleted: Boolean(app.followUpCompleted),
          status: app.status,
        });
      }

      // 2. Upcoming Interview notification if status is INTERVIEWING
      if (app.status === APPLICATION_STATUS.INTERVIEWING && !app.followUpCompleted) {
        reminders.push({
          id: `rem_${app.id}_interview`,
          applicationId: app.id,
          company: app.company,
          role: app.role,
          type: "INTERVIEW_SCHEDULED",
          title: `Interview round with ${app.company}`,
          description: app.stage || "Active interview rounds in progress",
          dueDate: app.followUpDate || app.updatedAt,
          isOverdue: false,
          isCompleted: false,
          status: app.status,
        });
      }
    });

    // Sort by due date (earliest/overdue first)
    reminders.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const overdueCount = reminders.filter((r) => r.isOverdue && !r.isCompleted).length;
    const upcomingCount = reminders.filter((r) => !r.isOverdue && !r.isCompleted).length;

    return {
      reminders,
      overdueCount,
      upcomingCount,
      totalActive: overdueCount + upcomingCount,
    };
  },

  /**
   * Toggles the completion status of a follow-up reminder
   */
  async markReminderCompleted(applicationId, completed = true) {
    await new Promise((r) => setTimeout(r, 10));
    return this.update(applicationId, { followUpCompleted: completed });
  },
};
