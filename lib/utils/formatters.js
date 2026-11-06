/**
 * Formats a date string or timestamp into a human-readable date (e.g., "Nov 6, 2026")
 * @param {string | Date | number} date - The date to format
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(d);
}

/**
 * Returns a relative time string (e.g. "3 days ago", "Today", "In 2 days")
 * @param {string | Date | number} date
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";

  const diffMs = d.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "Yesterday";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 0) return `${Math.abs(diffDays)}d ago`;
  return `In ${diffDays}d`;
}

/**
 * Formats a salary range or single amount into currency string
 * @param {number|string} amount
 * @param {string} [currency='USD']
 * @returns {string}
 */
export function formatSalary(amount, currency = "USD") {
  if (!amount) return "—";
  if (typeof amount === "string" && (amount.includes("-") || amount.includes("$") || amount.includes("k"))) {
    return amount;
  }
  const num = Number(amount);
  if (isNaN(num)) return String(amount);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(num);
}
