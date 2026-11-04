"use client";

import StatusBadge from "@/components/ui/StatusBadge";

export default function Analytics({
  stats,
  complaints = [],
  onResetDemoData,
  onNavigate,
}) {
  const total = stats?.total || 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Telecom Intelligence &amp; Complaint Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time aggregations computed from {total} stored complaint
            records across Bangladesh operators
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetDemoData}
            className="btn btn-xs border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
          >
            Restore Default Demo Data
          </button>
          <button
            type="button"
            onClick={() => onNavigate("support-desk")}
            className="btn btn-xs border-none bg-blue-700 text-white hover:bg-blue-800"
          >
            Open Support Desk
          </button>
        </div>
      </div>

      {/* Summary Metric Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            SLA Resolution Rate
          </span>
          <p className="mt-1 text-2xl font-bold text-emerald-700">
            {stats?.resolutionRate ?? 0}%
          </p>
          <p className="text-[11px] text-slate-500">
            {stats?.resolved ?? 0} of {total} tickets resolved
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            High Priority Load
          </span>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {stats?.byPriority?.High ?? 0}
          </p>
          <p className="text-[11px] text-slate-500">
            {stats?.highPriorityOpen ?? 0} currently unresolved
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Frustrated Sentiment
          </span>
          <p className="mt-1 text-2xl font-bold text-rose-600">
            {stats?.bySentiment?.Frustrated ?? 0}
          </p>
          <p className="text-[11px] text-slate-500">
            Detected by AI sentiment analysis
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Bilingual Tickets
          </span>
          <p className="mt-1 text-2xl font-bold text-blue-700">
            {complaints.filter((c) => c.language === "Bangla").length} BN /{" "}
            {complaints.filter((c) => c.language !== "Bangla").length} EN
          </p>
          <p className="text-[11px] text-slate-500">
            Bangla &amp; English AI triage
          </p>
        </div>
      </div>

      {/* Operator & Category Breakdown Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Operator Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
            Complaints by Telecom Operator
          </h3>
          <div className="mt-4 space-y-3.5">
            {(stats?.operatorList || []).map((op) => (
              <div key={op.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <StatusBadge type="operator" value={op.name} />
                  <span className="font-mono font-bold text-slate-700">
                    {op.count} tickets ({op.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-700 transition-all duration-300"
                    style={{
                      width: `${Math.max(op.percentage, op.count > 0 ? 6 : 0)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
            Complaints by Issue Category
          </h3>
          <div className="mt-4 space-y-3">
            {(stats?.categoryList || []).map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    {cat.name}
                  </span>
                  <span className="font-mono font-bold text-slate-700">
                    {cat.count} ({cat.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-cyan-600 transition-all duration-300"
                    style={{
                      width: `${Math.max(cat.percentage, cat.count > 0 ? 6 : 0)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sentiment & Lifecycle Status Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Customer Sentiment Analysis */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
            Subscriber Sentiment Breakdown
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                label: "Frustrated",
                count: stats?.bySentiment?.Frustrated ?? 0,
                tone: "border-rose-200 bg-rose-50/70 text-rose-900",
              },
              {
                label: "Neutral",
                count: stats?.bySentiment?.Neutral ?? 0,
                tone: "border-slate-200 bg-slate-50 text-slate-800",
              },
              {
                label: "Satisfied",
                count: stats?.bySentiment?.Satisfied ?? 0,
                tone: "border-teal-200 bg-teal-50/70 text-teal-900",
              },
            ].map((s) => {
              const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
              return (
                <div
                  key={s.label}
                  className={`rounded-xl border p-4 text-center ${s.tone}`}
                >
                  <StatusBadge type="sentiment" value={s.label} />
                  <p className="mt-2 text-2xl font-bold">{s.count}</p>
                  <p className="text-xs opacity-75">{pct}% of total</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Pipeline Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
            Ticket Lifecycle Pipeline
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(stats?.statusBreakdown || []).map((st) => {
              const pct = total > 0 ? Math.round((st.count / total) * 100) : 0;
              return (
                <div
                  key={st.status}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-center"
                >
                  <StatusBadge type="status" value={st.status} />
                  <p className="mt-2.5 text-2xl font-bold text-slate-900">
                    {st.count}
                  </p>
                  <p className="text-[11px] text-slate-500">{pct}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
