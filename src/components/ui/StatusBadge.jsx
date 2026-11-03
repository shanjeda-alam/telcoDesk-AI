"use client";

export default function StatusBadge({ type = "status", value }) {
  if (!value) return null;

  if (type === "priority") {
    const priorityStyles = {
      High: "bg-red-50 text-red-700 border-red-200 ring-red-500/10",
      Medium: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10",
      Low: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10",
    };
    const dotStyles = {
      High: "bg-red-500",
      Medium: "bg-amber-500",
      Low: "bg-emerald-500",
    };

    const style =
      priorityStyles[value] ||
      "bg-slate-100 text-slate-700 border-slate-200";
    const dot = dotStyles[value] || "bg-slate-400";

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {value}
      </span>
    );
  }

  if (type === "sentiment") {
    const sentimentStyles = {
      Frustrated: "bg-rose-50 text-rose-700 border-rose-200",
      Neutral: "bg-slate-100 text-slate-700 border-slate-200",
      Satisfied: "bg-teal-50 text-teal-700 border-teal-200",
    };
    const style =
      sentimentStyles[value] || "bg-slate-100 text-slate-600 border-slate-200";

    return (
      <span
        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${style}`}
      >
        {value}
      </span>
    );
  }

  if (type === "operator") {
    const operatorStyles = {
      Grameenphone: "bg-sky-50 text-sky-800 border-sky-200",
      Robi: "bg-rose-50 text-rose-800 border-rose-200",
      Banglalink: "bg-orange-50 text-orange-800 border-orange-200",
      Teletalk: "bg-emerald-50 text-emerald-800 border-emerald-200",
      Other: "bg-slate-100 text-slate-700 border-slate-200",
    };
    const style =
      operatorStyles[value] || "bg-slate-100 text-slate-700 border-slate-200";

    return (
      <span
        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${style}`}
      >
        {value}
      </span>
    );
  }

  // Default: ticket status badge
  const statusStyles = {
    Submitted: "bg-blue-50 text-blue-800 border-blue-200",
    "Under Review": "bg-amber-50 text-amber-800 border-amber-200",
    "In Progress": "bg-cyan-50 text-cyan-800 border-cyan-200",
    Resolved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  };

  const statusDots = {
    Submitted: "bg-blue-600",
    "Under Review": "bg-amber-500",
    "In Progress": "bg-cyan-500",
    Resolved: "bg-emerald-600",
  };

  const style =
    statusStyles[value] || "bg-slate-100 text-slate-700 border-slate-200";
  const dot = statusDots[value] || "bg-slate-500";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {value}
    </span>
  );
}
