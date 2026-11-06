/**
 * @typedef {'WISHLIST' | 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED' | 'ARCHIVED'} ApplicationStatus
 * @typedef {'Remote' | 'Hybrid' | 'On-site'} WorkplaceType
 * @typedef {'High' | 'Medium' | 'Low'} PriorityLevel
 *
 * @typedef {Object} JobApplication
 * @property {string} id - Unique identifier (UUID / DB ID)
 * @property {string} company - Company name
 * @property {string} role - Position title
 * @property {ApplicationStatus} status - Current pipeline status
 * @property {WorkplaceType} workplaceType - Workplace arrangement
 * @property {string} [location] - City, State, or Country
 * @property {string} [salary] - Salary or compensation range
 * @property {string} [url] - Job posting or application link
 * @property {string} [stage] - Current interview stage
 * @property {PriorityLevel} [priority] - Target priority
 * @property {string} [contactName] - Recruiter or hiring manager name
 * @property {string} [contactEmail] - Contact email address
 * @property {string} [notes] - Interview notes or application feedback
 * @property {string} appliedDate - ISO date string
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

/**
 * Validates a job application payload before creation or update
 * @param {Partial<JobApplication>} data
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateApplicationData(data) {
  const errors = {};

  if (!data.company || typeof data.company !== "string" || !data.company.trim()) {
    errors.company = "Company name is required.";
  }

  if (!data.role || typeof data.role !== "string" || !data.role.trim()) {
    errors.role = "Job role/title is required.";
  }

  if (data.url && typeof data.url === "string" && data.url.trim()) {
    try {
      new URL(data.url.trim());
    } catch {
      errors.url = "Please provide a valid URL (including https://).";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
