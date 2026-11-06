export const APPLICATION_STATUS = {
  WISHLIST: "WISHLIST",
  APPLIED: "APPLIED",
  INTERVIEWING: "INTERVIEWING",
  OFFER: "OFFER",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
};

export const STATUS_CONFIG = {
  [APPLICATION_STATUS.WISHLIST]: {
    label: "Wishlist",
    variant: "secondary",
    color: "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700",
    dotColor: "bg-slate-400",
  },
  [APPLICATION_STATUS.APPLIED]: {
    label: "Applied",
    variant: "info",
    color: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900",
    dotColor: "bg-blue-500",
  },
  [APPLICATION_STATUS.INTERVIEWING]: {
    label: "Interviewing",
    variant: "warning",
    color: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900",
    dotColor: "bg-amber-500",
  },
  [APPLICATION_STATUS.OFFER]: {
    label: "Offer",
    variant: "success",
    color: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900",
    dotColor: "bg-emerald-500",
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: "Rejected",
    variant: "destructive",
    color: "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900",
    dotColor: "bg-rose-500",
  },
  [APPLICATION_STATUS.ARCHIVED]: {
    label: "Archived",
    variant: "outline",
    color: "text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
    dotColor: "bg-zinc-400",
  },
};

export const WORKPLACE_TYPES = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "On-site",
};

export const PRIORITY_LEVELS = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};
