"use client";

import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { formatDateTime } from "@/lib/utils";
import {
  COMPLAINT_CATEGORIES,
  TELECOM_OPERATORS,
} from "@/config/constants";

export default function DashboardStats({
  complaints = [],
  stats,
  onNavigate,
  onSelectComplaint,
  onQuickSubmit,
}) {
  const [quickForm, setQuickForm] = useState({
    customerName: "",
    mobileNumber: "",
    operator: "Grameenphone",
    category: "Internet Connectivity",
    location: "",
    description: "",
  });
  const [quickError, setQuickError] = useState("");

  const recentComplaints = complaints.slice(0, 5);

  const handleQuickSubmitForm = (e) => {
    e.preventDefault();
    if (
      !quickForm.customerName.trim() ||
      !quickForm.mobileNumber.trim() ||
      !quickForm.location.trim() ||
      quickForm.description.trim().length < 15
    ) {
      setQuickError(
        "Please fill in all fields (description at least 15 characters) or use the full Submit Complaint form."
      );
      return;
    }
    setQuickError("");
    if (onQuickSubmit) {
      onQuickSubmit({
        ...quickForm,
        language: "English",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-white via-white to-blue-50 p-5 text-slate-900 shadow-sm sm:p-6">
        <div className="relative z-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>AI-Powered Telecom Complaint Management System</span>
            </div>
            <h2 className="mt-2.5 text-xl font-bold tracking-tight text-blue-950 sm:text-2xl">
              Smarter Complaints. Faster Solutions. Better Connectivity.
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">
              Automated bilingual (English &amp; বাংলা) complaint classification,
              sentiment detection, root-cause diagnostics, and support desk SLA
              tracking powered by Google Gemini AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("submit")}
              className="btn btn-sm border-none bg-blue-700 font-semibold text-white hover:bg-blue-800"
            >
              + Submit Complaint
            </button>
            <button
              type="button"
              onClick={() => onNavigate("track")}
              className="btn btn-sm border border-blue-200 bg-white text-blue-800 hover:bg-blue-50"
            >
              Track Ticket
            </button>
            <button
              type="button"
              onClick={() => onNavigate("ai-chat")}
              className="btn btn-sm border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100"
            >
              AI Support Assistant
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Complaints */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Complaints
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {stats?.total ?? 0}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Across {Object.keys(stats?.byOperator || {}).length} telecom operators
          </p>
        </div>

        {/* Open Complaints */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Open Complaints
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-blue-700">
            {stats?.open ?? 0}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {stats?.submitted ?? 0} Submitted • {stats?.underReview ?? 0} Under Review
          </p>
        </div>

        {/* In-Progress Complaints */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              In Progress
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-cyan-700">
            {stats?.inProgress ?? 0}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Active engineering &amp; NOC remediation
          </p>
        </div>

        {/* Resolved Complaints */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Resolved Complaints
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-emerald-700">
            {stats?.resolved ?? 0}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {stats?.resolutionRate ?? 0}% overall resolution rate
          </p>
        </div>
      </div>

      {/* Middle Row: Category Statistics & Priority Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Complaint Category Statistics (2 columns wide) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Complaint Category Statistics
              </h3>
              <p className="text-xs text-slate-500">
                Live breakdown calculated from active complaint records
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("analytics")}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              Full Analytics →
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(stats?.categoryList || []).map((cat) => (
              <div
                key={cat.name}
                className="rounded-lg border border-slate-100 bg-slate-50/70 p-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    {cat.name}
                  </span>
                  <span className="font-mono font-bold text-slate-700">
                    {cat.count} ({cat.percentage}%)
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-700 transition-all duration-300"
                    style={{ width: `${Math.max(cat.percentage, cat.count > 0 ? 8 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority & Sentiment Distribution */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div>
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Priority Distribution
              </h3>
              <p className="text-xs text-slate-500">
                AI-triaged urgency levels across tickets
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {[
                {
                  level: "High",
                  count: stats?.byPriority?.High ?? 0,
                  barClass: "bg-red-500",
                  bgClass: "bg-red-50 border-red-100",
                  desc: "Immediate NOC / Billing intervention",
                },
                {
                  level: "Medium",
                  count: stats?.byPriority?.Medium ?? 0,
                  barClass: "bg-amber-500",
                  bgClass: "bg-amber-50 border-amber-100",
                  desc: "Standard Tier-2 investigation queue",
                },
                {
                  level: "Low",
                  count: stats?.byPriority?.Low ?? 0,
                  barClass: "bg-emerald-500",
                  bgClass: "bg-emerald-50 border-emerald-100",
                  desc: "Self-care / routine inquiry",
                },
              ].map((item) => {
                const pct =
                  stats?.total > 0
                    ? Math.round((item.count / stats.total) * 100)
                    : 0;
                return (
                  <div
                    key={item.level}
                    className={`rounded-lg border p-3 ${item.bgClass}`}
                  >
                    <div className="flex items-center justify-between">
                      <StatusBadge type="priority" value={item.level} />
                      <span className="text-xs font-bold text-slate-800">
                        {item.count} tickets ({pct}%)
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/80">
                      <div
                        className={`h-full rounded-full ${item.barClass}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-700">
                Unresolved High-Priority
              </span>
              <span className="rounded-md bg-red-500/20 px-2 py-0.5 font-bold text-red-300 border border-red-400/30">
                {stats?.highPriorityOpen ?? 0} Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Complaints Table & Quick Complaint Submission */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Complaints (2 columns) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recent Complaints
              </h3>
              <p className="text-xs text-slate-500">
                Latest subscriber tickets and AI triage status
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("track")}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              View All ({complaints.length}) →
            </button>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No complaints recorded yet"
                description="Use the Quick Submit panel or Submit Complaint page to log your first telecom ticket."
                actionLabel="Submit Complaint"
                onAction={() => onNavigate("submit")}
              />
            </div>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="table table-sm w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                    <th>Ticket ID</th>
                    <th>Customer &amp; Operator</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {recentComplaints.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/90 transition-colors"
                    >
                      <td className="font-mono font-bold text-blue-800">
                        {item.id}
                        <span className="block font-sans text-[10px] font-normal text-slate-400">
                          {formatDateTime(item.createdAt)}
                        </span>
                      </td>
                      <td>
                        <div className="font-semibold text-slate-800">
                          {item.customerName}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <StatusBadge type="operator" value={item.operator} />
                          <span className="text-[11px] text-slate-400">
                            {item.location}
                          </span>
                        </div>
                      </td>
                      <td className="font-medium text-slate-700">
                        {item.category}
                      </td>
                      <td>
                        {item.aiAnalysis?.priority ? (
                          <StatusBadge
                            type="priority"
                            value={item.aiAnalysis.priority}
                          />
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            Pending AI
                          </span>
                        )}
                      </td>
                      <td>
                        <StatusBadge type="status" value={item.status} />
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => onSelectComplaint(item.id)}
                          className="btn btn-xs border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Complaint Submission Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Quick Complaint Submission
              </h3>
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                Fast Log
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Log an urgent issue directly from the dashboard
            </p>
          </div>

          <form onSubmit={handleQuickSubmitForm} className="mt-3 space-y-2.5">
            {quickError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                {quickError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                  Customer Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arif Hossain"
                  value={quickForm.customerName}
                  onChange={(e) =>
                    setQuickForm({ ...quickForm, customerName: e.target.value })
                  }
                  className="input input-sm input-bordered w-full bg-white text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  placeholder="017XXXXXXXX"
                  value={quickForm.mobileNumber}
                  onChange={(e) =>
                    setQuickForm({ ...quickForm, mobileNumber: e.target.value })
                  }
                  className="input input-sm input-bordered w-full bg-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                  Operator *
                </label>
                <select
                  value={quickForm.operator}
                  onChange={(e) =>
                    setQuickForm({ ...quickForm, operator: e.target.value })
                  }
                  className="select select-sm select-bordered w-full bg-white text-xs"
                >
                  {TELECOM_OPERATORS.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                  Category *
                </label>
                <select
                  value={quickForm.category}
                  onChange={(e) =>
                    setQuickForm({ ...quickForm, category: e.target.value })
                  }
                  className="select select-sm select-bordered w-full bg-white text-xs"
                >
                  {COMPLAINT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                Location / Area *
              </label>
              <input
                type="text"
                placeholder="e.g. Mirpur 10, Dhaka"
                value={quickForm.location}
                onChange={(e) =>
                  setQuickForm({ ...quickForm, location: e.target.value })
                }
                className="input input-sm input-bordered w-full bg-white text-xs"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                Issue Description *
              </label>
              <textarea
                rows={2}
                placeholder="Describe the network, billing, or SIM issue..."
                value={quickForm.description}
                onChange={(e) =>
                  setQuickForm({ ...quickForm, description: e.target.value })
                }
                className="textarea textarea-bordered w-full bg-white text-xs leading-snug"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="btn btn-sm flex-1 border-none bg-blue-700 text-white hover:bg-blue-800"
              >
                Analyze &amp; Submit
              </button>
              <button
                type="button"
                onClick={() => onNavigate("submit")}
                className="btn btn-sm btn-ghost text-xs text-slate-600"
              >
                Full Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
