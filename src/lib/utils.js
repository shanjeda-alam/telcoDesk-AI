import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_STATUSES,
  LANGUAGES,
  PRIORITY_LEVELS,
  SENTIMENT_LEVELS,
  TELECOM_OPERATORS,
} from "@/config/constants";

/**
 * Generates a unique ticket ID in the format TEL-2026-0001
 */
export function generateTicketId(existingComplaints = []) {
  const year = new Date().getFullYear() || 2026;
  const prefix = `TEL-${year}-`;

  let maxNum = 0;
  if (Array.isArray(existingComplaints)) {
    for (const item of existingComplaints) {
      if (item && typeof item.id === "string" && item.id.startsWith("TEL-")) {
        const parts = item.id.split("-");
        const numPart = parseInt(parts[2], 10);
        if (!Number.isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    }
  }

  const nextNum = maxNum + 1;
  const padded = String(nextNum).padStart(4, "0");
  return `${prefix}${padded}`;
}

/**
 * Normalizes a phone number for searching and comparison
 */
export function normalizeMobileNumber(raw = "") {
  if (typeof raw !== "string") return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8801") && digits.length === 13) {
    return digits.slice(2);
  }
  return digits;
}

/**
 * Validates the complaint submission form fields
 */
export function validateComplaintForm(formData = {}) {
  const errors = {};

  const customerName = (formData.customerName || "").trim();
  const mobileNumber = (formData.mobileNumber || "").trim();
  const operator = (formData.operator || "").trim();
  const category = (formData.category || "").trim();
  const location = (formData.location || "").trim();
  const language = (formData.language || "").trim();
  const description = (formData.description || "").trim();

  if (!customerName) {
    errors.customerName = "Customer name is required.";
  } else if (customerName.length < 2) {
    errors.customerName = "Customer name must be at least 2 characters.";
  } else if (customerName.length > 80) {
    errors.customerName = "Customer name cannot exceed 80 characters.";
  }

  const normalizedPhone = normalizeMobileNumber(mobileNumber);
  if (!mobileNumber) {
    errors.mobileNumber = "Mobile number is required.";
  } else if (!/^01[3-9]\d{8}$/.test(normalizedPhone) && !/^\d{8,15}$/.test(normalizedPhone)) {
    errors.mobileNumber =
      "Enter a valid mobile number (e.g., 017XXXXXXXX or +88017XXXXXXXX).";
  }

  if (!operator || !TELECOM_OPERATORS.includes(operator)) {
    errors.operator = "Please select a valid telecom operator.";
  }

  if (!category || !COMPLAINT_CATEGORIES.includes(category)) {
    errors.category = "Please select a complaint category.";
  }

  if (!location) {
    errors.location = "Location / area is required.";
  } else if (location.length < 2) {
    errors.location = "Please provide a specific area or city.";
  } else if (location.length > 100) {
    errors.location = "Location cannot exceed 100 characters.";
  }

  if (!language || !LANGUAGES.includes(language)) {
    errors.language = "Please select a preferred language.";
  }

  if (!description) {
    errors.description = "Complaint description is required.";
  } else if (description.length < 15) {
    errors.description =
      "Please describe the issue in at least 15 characters for accurate diagnosis.";
  } else if (description.length > 2000) {
    errors.description = "Description cannot exceed 2000 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Formats an ISO date string into a concise human-readable timestamp
 */
export function formatDateTime(isoString) {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "N/A";
  }
}

/**
 * Formats relative time (e.g., "2h ago", "Just now")
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const diffMs = Date.now() - date.getTime();
    if (Number.isNaN(diffMs)) return "";
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return "";
  }
}

/**
 * Calculates comprehensive statistics from actual complaint records
 */
export function calculateComplaintStats(complaints = []) {
  const safeList = Array.isArray(complaints) ? complaints : [];

  const total = safeList.length;
  let submitted = 0;
  let underReview = 0;
  let inProgress = 0;
  let resolved = 0;
  let highPriorityOpen = 0;

  const byCategory = {};
  for (const cat of COMPLAINT_CATEGORIES) {
    byCategory[cat] = 0;
  }

  const byOperator = {};
  for (const op of TELECOM_OPERATORS) {
    byOperator[op] = 0;
  }

  const byPriority = {
    High: 0,
    Medium: 0,
    Low: 0,
    Unassigned: 0,
  };

  const bySentiment = {
    Frustrated: 0,
    Neutral: 0,
    Satisfied: 0,
    Unanalyzed: 0,
  };

  for (const item of safeList) {
    if (!item || typeof item !== "object") continue;

    // Status counts
    if (item.status === "Submitted") submitted += 1;
    else if (item.status === "Under Review") underReview += 1;
    else if (item.status === "In Progress") inProgress += 1;
    else if (item.status === "Resolved") resolved += 1;

    // Category count
    const cat = item.category || item.aiAnalysis?.category || "Other";
    byCategory[cat] = (byCategory[cat] || 0) + 1;

    // Operator count
    const op = item.operator || "Other";
    byOperator[op] = (byOperator[op] || 0) + 1;

    // Priority count
    const priority = item.aiAnalysis?.priority;
    if (priority && PRIORITY_LEVELS.includes(priority)) {
      byPriority[priority] += 1;
      if (priority === "High" && item.status !== "Resolved") {
        highPriorityOpen += 1;
      }
    } else {
      byPriority.Unassigned += 1;
    }

    // Sentiment count
    const sentiment = item.aiAnalysis?.sentiment;
    if (sentiment && SENTIMENT_LEVELS.includes(sentiment)) {
      bySentiment[sentiment] += 1;
    } else {
      bySentiment.Unanalyzed += 1;
    }
  }

  const open = submitted + underReview;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const categoryList = Object.entries(byCategory)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const operatorList = Object.entries(byOperator)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    total,
    open,
    submitted,
    underReview,
    inProgress,
    resolved,
    highPriorityOpen,
    resolutionRate,
    byCategory,
    categoryList,
    byOperator,
    operatorList,
    byPriority,
    bySentiment,
     statusBreakdown: COMPLAINT_STATUSES.map((st) => ({
      status: st,
      count: safeList.filter((c) => c.status === st).length,
    })),
  };
}

/**
 * Sanitizes text input and enforces a maximum character limit
 */
export function sanitizeText(value = "", maxLength = 2000) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}
