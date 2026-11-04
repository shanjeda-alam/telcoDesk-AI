"use client";

import { useState, useEffect, useMemo } from "react";
import { COMPLAINT_STATUSES } from "@/config/constants";
import { formatDateTime, normalizeMobileNumber } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ComplaintAnalysis from "./ComplaintAnalysis";

export default function ComplaintList({
  complaints = [],
  selectedTicketId,
  onSelectTicketId,
  analyzeComplaint,
  isAnalyzing,
  onAttachAnalysis,
  onNavigateSubmit,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiError, setAiError] = useState(null);

  // Sync selectedTicketId if passed from another view
  useEffect(() => {
    if (selectedTicketId) {
      setAiError(null);
    }
  }, [selectedTicketId]);

  const filteredComplaints = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return complaints;

    const upper = q.toUpperCase();
    const normPhone = normalizeMobileNumber(q);

    return complaints.filter((item) => {
      const matchId = item.id.toUpperCase().includes(upper);
      const itemPhone = normalizeMobileNumber(item.mobileNumber);
      const matchPhone =
        normPhone.length >= 3 && itemPhone.includes(normPhone);
      const matchName = item.customerName.toUpperCase().includes(upper);
      return matchId || matchPhone || matchName;
    });
  }, [complaints, searchQuery]);

  const activeComplaint = useMemo(() => {
    if (selectedTicketId) {
      const found = complaints.find((c) => c.id === selectedTicketId);
      if (found) return found;
    }
    return filteredComplaints[0] || null;
  }, [complaints, filteredComplaints, selectedTicketId]);

  const handleRunAiAnalysis = async (complaint) => {
    if (!complaint || !analyzeComplaint) return;
    setAiError(null);
    const result = await analyzeComplaint({
      operator: complaint.operator,
      category: complaint.category,
      location: complaint.location,
      language: complaint.language,
      description: complaint.description,
    });

    if (result.success && result.data) {
      onAttachAnalysis(complaint.id, result.data);
    } else {
      setAiError(
        result.error?.message ||
          "Could not complete AI analysis. Check GROQ_API_KEY in server .env.local."
      );
    }
  };

  const currentStatusIndex = activeComplaint
    ? COMPLAINT_STATUSES.indexOf(activeComplaint.status)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Search & Lookup Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Track Telecom Complaint Status
            </h2>
            <p className="text-xs text-slate-500">
              Search by Ticket ID (e.g.,{" "}
              <code className="font-mono text-blue-700">TEL-2026-0001</code>) or
              Subscriber Mobile Number (e.g.,{" "}
              <code className="font-mono text-blue-700">01711223344</code>)
            </p>
          </div>

          <div className="flex w-full items-center gap-2 md:w-96">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Ticket ID or Mobile Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered input-sm h-10 w-full bg-white pr-8 text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Ticket Selector Pills */}
        {complaints.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Recent Tickets:
            </span>
            {complaints.slice(0, 8).map((item) => {
              const isSelected = activeComplaint?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTicketId(item.id)}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold transition-all ${
                    isSelected
                      ? "border-blue-700 bg-blue-700 text-white shadow-2xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.id}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {filteredComplaints.length === 0 ? (
        <EmptyState
          title="No Matching Complaint Found"
          description={`No complaint matched "${searchQuery}". Verify the Ticket ID (e.g. TEL-2026-0001) or Mobile Number, or submit a new complaint.`}
          actionLabel="Submit New Complaint"
          onAction={onNavigateSubmit}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Matching Tickets List (4 cols) */}
          <div className="space-y-3 lg:col-span-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Matching Records ({filteredComplaints.length})
              </span>
            </div>

            <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
              {filteredComplaints.map((item) => {
                const isSelected = activeComplaint?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectTicketId(item.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-blue-700 bg-white ring-2 ring-blue-700/15 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-blue-800">
                        {item.id}
                      </span>
                      <StatusBadge type="status" value={item.status} />
                    </div>

                    <p className="mt-1.5 text-sm font-bold text-slate-900">
                      {item.customerName}
                    </p>
                    <p className="font-mono text-xs text-slate-500">
                      {item.mobileNumber} • {item.operator}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700">
                        {item.category}
                      </span>
                      {item.aiAnalysis?.priority && (
                        <StatusBadge
                          type="priority"
                          value={item.aiAnalysis.priority}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Ticket View, Timeline, Notes & AI Analysis (8 cols) */}
          {activeComplaint && (
            <div className="space-y-5 lg:col-span-8">
              {/* Ticket Header & 4-Stage Status Progress */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xl font-bold text-slate-900">
                        {activeComplaint.id}
                      </span>
                      <StatusBadge
                        type="operator"
                        value={activeComplaint.operator}
                      />
                      <StatusBadge
                        type="status"
                        value={activeComplaint.status}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Logged on {formatDateTime(activeComplaint.createdAt)} •
                      Last updated {formatDateTime(activeComplaint.updatedAt)}
                    </p>
                  </div>

                  {activeComplaint.aiAnalysis?.priority && (
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        type="priority"
                        value={activeComplaint.aiAnalysis.priority}
                      />
                      <StatusBadge
                        type="sentiment"
                        value={activeComplaint.aiAnalysis.sentiment}
                      />
                    </div>
                  )}
                </div>

                {/* 4-Stage Progress Bar */}
                <div className="mt-5">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Ticket Resolution Lifecycle
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {COMPLAINT_STATUSES.map((statusStep, idx) => {
                      const isCompleted = idx <= currentStatusIndex;
                      const isCurrent = idx === currentStatusIndex;

                      return (
                        <div
                          key={statusStep}
                          className={`rounded-lg border p-2.5 text-center transition-all ${
                            isCurrent
                              ? "border-blue-700 bg-blue-50/80 text-blue-900 font-bold"
                              : isCompleted
                              ? "border-emerald-200 bg-emerald-50/60 text-emerald-800 font-semibold"
                              : "border-slate-200 bg-slate-50 text-slate-400"
                          }`}
                        >
                          <div className="text-[10px] uppercase tracking-wider opacity-75">
                            Step {idx + 1}
                          </div>
                          <div className="mt-0.5 text-xs">{statusStep}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subscriber & Complaint Details Grid */}
                <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-3">
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">
                      Customer Name
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {activeComplaint.customerName}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">
                      Mobile Number
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {activeComplaint.mobileNumber}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">
                      Location / Area
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {activeComplaint.location}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">
                      Category
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {activeComplaint.category}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">
                      Preferred Language
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {activeComplaint.language || "English"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-400">
                      Operator Network
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {activeComplaint.operator}
                    </span>
                  </div>
                </div>

                {/* Original Complaint Description */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Reported Issue Description
                  </h4>
                  <p className="mt-1.5 rounded-xl border border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-slate-800">
                    {activeComplaint.description}
                  </p>
                </div>
              </div>

              {aiError && (
                <ErrorMessage
                  title="AI Analysis Error"
                  message={aiError}
                  onDismiss={() => setAiError(null)}
                />
              )}

              {/* AI Analysis Card */}
              <ComplaintAnalysis
                analysis={activeComplaint.aiAnalysis}
                isAnalyzing={isAnalyzing}
                onTriggerAnalysis={() => handleRunAiAnalysis(activeComplaint)}
              />

              {/* Timeline & Support Agent Notes */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Complaint Timeline */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <h4 className="border-b border-slate-100 pb-2.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Complaint Activity Timeline
                  </h4>
                  <ol className="mt-4 space-y-3 border-l-2 border-blue-200 pl-4">
                    {(activeComplaint.timeline || []).map((entry, idx) => (
                      <li key={idx} className="relative">
                        <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-blue-700 ring-4 ring-white" />
                        <div className="flex items-center justify-between gap-2">
                          <StatusBadge type="status" value={entry.status} />
                          <span className="text-[11px] text-slate-400">
                            {formatDateTime(entry.timestamp)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">
                          {entry.note}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Support Agent Notes */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <h4 className="border-b border-slate-100 pb-2.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Support Desk Notes (
                    {(activeComplaint.supportNotes || []).length})
                  </h4>

                  {(activeComplaint.supportNotes || []).length === 0 ? (
                    <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                      No support engineering notes added yet. Support agents can
                      append updates from the Support Agent Desk.
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {activeComplaint.supportNotes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800">
                              {note.author}
                            </span>
                            <span className="text-slate-400">
                              {formatDateTime(note.createdAt)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-700">
                            {note.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
