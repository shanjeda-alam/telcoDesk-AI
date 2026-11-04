"use client";

import { useState, useMemo } from "react";
import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_STATUSES,
  PRIORITY_LEVELS,
  TELECOM_OPERATORS,
} from "@/config/constants";
import { formatDateTime, normalizeMobileNumber } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ComplaintAnalysis from "./ComplaintAnalysis";

export default function SupportDesk({
  complaints = [],
  demoRole,
  setDemoRole,
  onUpdateStatus,
  onAddNote,
  onResolveComplaint,
  onDeleteComplaint,
  onResetDemoData,
  onAttachAnalysis,
  analyzeComplaint,
  isAnalyzing,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [operatorFilter, setOperatorFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedId, setSelectedId] = useState(null);
  const [noteAuthor, setNoteAuthor] = useState("Tier-2 NOC Engineer");
  const [noteText, setNoteText] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [aiError, setAiError] = useState(null);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      if (operatorFilter !== "All" && item.operator !== operatorFilter) {
        return false;
      }
      if (categoryFilter !== "All" && item.category !== categoryFilter) {
        return false;
      }
      if (
        priorityFilter !== "All" &&
        item.aiAnalysis?.priority !== priorityFilter
      ) {
        return false;
      }
      if (statusFilter !== "All" && item.status !== statusFilter) {
        return false;
      }

      const q = searchQuery.trim();
      if (!q) return true;

      const upper = q.toUpperCase();
      const normPhone = normalizeMobileNumber(q);
      const itemPhone = normalizeMobileNumber(item.mobileNumber);

      return (
        item.id.toUpperCase().includes(upper) ||
        item.customerName.toUpperCase().includes(upper) ||
        item.location.toUpperCase().includes(upper) ||
        item.description.toUpperCase().includes(upper) ||
        (normPhone.length >= 3 && itemPhone.includes(normPhone))
      );
    });
  }, [
    complaints,
    searchQuery,
    operatorFilter,
    categoryFilter,
    priorityFilter,
    statusFilter,
  ]);

  const activeTicket = useMemo(() => {
    if (selectedId) {
      const found = complaints.find((c) => c.id === selectedId);
      if (found) return found;
    }
    return filteredComplaints[0] || null;
  }, [complaints, filteredComplaints, selectedId]);

  const showToast = (msg) => {
    setActionFeedback(msg);
    setTimeout(() => {
      setActionFeedback(null);
    }, 3500);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setOperatorFilter("All");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setStatusFilter("All");
  };

  const handleStatusChange = (newStatus) => {
    if (!activeTicket) return;
    onUpdateStatus(activeTicket.id, newStatus, statusNote);
    setStatusNote("");
    showToast(`Ticket ${activeTicket.id} updated to "${newStatus}".`);
  };

  const handleQuickResolve = () => {
    if (!activeTicket) return;
    onResolveComplaint(
      activeTicket.id,
      statusNote ||
        "Verified resolution with subscriber and closed ticket from Support Agent Desk."
    );
    setStatusNote("");
    showToast(`Ticket ${activeTicket.id} marked as Resolved.`);
  };

  const handleAddSupportNote = (e) => {
    e.preventDefault();
    if (!activeTicket || !noteText.trim()) return;
    onAddNote(activeTicket.id, noteText, noteAuthor);
    setNoteText("");
    showToast(`Support note added to ${activeTicket.id}.`);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteId) return;
    const deletedId = confirmDeleteId;
    onDeleteComplaint(deletedId);
    setConfirmDeleteId(null);
    if (selectedId === deletedId) {
      setSelectedId(null);
    }
    showToast(`Demo record ${deletedId} deleted.`);
  };

  const handleRunAiAnalysis = async () => {
    if (!activeTicket || !analyzeComplaint) return;
    setAiError(null);
    const result = await analyzeComplaint({
      operator: activeTicket.operator,
      category: activeTicket.category,
      location: activeTicket.location,
      language: activeTicket.language,
      description: activeTicket.description,
    });

    if (result.success && result.data) {
      onAttachAnalysis(activeTicket.id, result.data);
      showToast(`AI analysis updated for ${activeTicket.id}.`);
    } else {
      setAiError(
        result.error?.message ||
          "Unable to complete AI analysis. Check GROQ_API_KEY in server .env.local."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Agent Mode Banner & Demo Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-slate-800 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-800">
              Support Agent Operations Console (Demo View)
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-600">
            Demonstration interface for NOC &amp; Customer Care agents to
            filter, inspect, update statuses, add engineering notes, and resolve
            complaints.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setDemoRole(demoRole === "agent" ? "customer" : "agent")
            }
            className="btn btn-xs border border-blue-200 bg-white text-blue-800 hover:bg-blue-100"
          >
            Switch to {demoRole === "agent" ? "Customer View" : "Agent View"}
          </button>
          <button
            type="button"
            onClick={() => {
              onResetDemoData();
              showToast("Default demo complaint dataset restored.");
            }}
            className="btn btn-xs border border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            Reset Demo Records
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {actionFeedback && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-900 shadow-2xs">
          <span>✓ {actionFeedback}</span>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            className="text-emerald-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Multi-Criteria Search & Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {/* Search Input (2 cols) */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Search Tickets
            </label>
            <input
              type="text"
              placeholder="Ticket ID, Phone, Name, Location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered input-sm h-9 w-full bg-white text-xs"
            />
          </div>

          {/* Operator Filter */}
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Operator
            </label>
            <select
              value={operatorFilter}
              onChange={(e) => setOperatorFilter(e.target.value)}
              className="select select-bordered select-sm h-9 w-full bg-white text-xs"
            >
              <option value="All">All Operators</option>
              {TELECOM_OPERATORS.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select select-bordered select-sm h-9 w-full bg-white text-xs"
            >
              <option value="All">All Categories</option>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="select select-bordered select-sm h-9 w-full bg-white text-xs"
            >
              <option value="All">All Priorities</option>
              {PRIORITY_LEVELS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-bordered select-sm h-9 w-full bg-white text-xs"
            >
              <option value="All">All Statuses</option>
              {COMPLAINT_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>
            Showing{" "}
            <strong className="text-slate-800">
              {filteredComplaints.length}
            </strong>{" "}
            of <strong className="text-slate-800">{complaints.length}</strong>{" "}
            total complaint records
          </span>
          {(searchQuery ||
            operatorFilter !== "All" ||
            categoryFilter !== "All" ||
            priorityFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="font-semibold text-blue-700 hover:underline"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Split Workspace: Left Table / Queue (5 cols) + Right Detail & Action Console (7 cols) */}
      {filteredComplaints.length === 0 ? (
        <EmptyState
          title="No Complaints Match Current Filters"
          description="Clear one or more filter criteria or restore the default demo records."
          actionLabel="Reset Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Queue Column (5 cols) */}
          <div className="space-y-2.5 lg:col-span-5 max-h-[820px] overflow-y-auto pr-1">
            {filteredComplaints.map((item) => {
              const isSelected = activeTicket?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? "border-blue-700 bg-white ring-2 ring-blue-700/15 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-800">
                        {item.id}
                      </span>
                      <StatusBadge type="operator" value={item.operator} />
                    </div>
                    <StatusBadge type="status" value={item.status} />
                  </div>

                  <div className="mt-2 flex items-baseline justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      {item.customerName}
                    </h4>
                    <span className="font-mono text-xs text-slate-500">
                      {item.mobileNumber}
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                    {item.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-[11px]">
                    <span className="font-semibold text-slate-700">
                      {item.category} • {item.location}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.aiAnalysis?.priority && (
                        <StatusBadge
                          type="priority"
                          value={item.aiAnalysis.priority}
                        />
                      )}
                      {item.aiAnalysis?.sentiment && (
                        <StatusBadge
                          type="sentiment"
                          value={item.aiAnalysis.sentiment}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Ticket Management & AI Console (7 cols) */}
          {activeTicket && (
            <div className="space-y-5 lg:col-span-7">
              {/* Ticket Header & Action Controls */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xl font-bold text-slate-900">
                        {activeTicket.id}
                      </span>
                      <StatusBadge
                        type="operator"
                        value={activeTicket.operator}
                      />
                      <StatusBadge type="status" value={activeTicket.status} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Customer:{" "}
                      <strong className="text-slate-800">
                        {activeTicket.customerName}
                      </strong>{" "}
                      ({activeTicket.mobileNumber}) • {activeTicket.location}
                    </p>
                  </div>

                  {/* Resolve & Delete Buttons */}
                  <div className="flex items-center gap-2">
                    {activeTicket.status !== "Resolved" && (
                      <button
                        type="button"
                        onClick={handleQuickResolve}
                        className="btn btn-xs border-none bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        ✓ Resolve Complaint
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(activeTicket.id)}
                      className="btn btn-xs border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      Delete Record
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation Prompt */}
                {confirmDeleteId === activeTicket.id && (
                  <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-red-900">
                      Confirm Deletion of Demo Record {activeTicket.id}
                    </h5>
                    <p className="mt-1 text-xs text-red-800">
                      Are you sure you want to permanently remove this complaint
                      record from browser storage?
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmDelete}
                        className="btn btn-xs border-none bg-red-600 text-white hover:bg-red-700"
                      >
                        Yes, Delete Permanently
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="btn btn-xs btn-ghost text-slate-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Reported Complaint Text */}
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <span>Subscriber Complaint ({activeTicket.language})</span>
                    <span>{formatDateTime(activeTicket.createdAt)}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-800">
                    {activeTicket.description}
                  </p>
                </div>

                {/* Status Update Workflow Controls */}
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Update Ticket Status
                  </label>
                  <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
                    <input
                      type="text"
                      placeholder="Optional status transition note (e.g., Assigned to RAN engineer)..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="input input-bordered input-sm flex-1 bg-white text-xs"
                    />
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {COMPLAINT_STATUSES.map((st) => {
                      const isCurrent = activeTicket.status === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          disabled={isCurrent}
                          onClick={() => handleStatusChange(st)}
                          className={`btn btn-xs ${
                            isCurrent
                              ? "border-blue-700 bg-blue-700 text-white disabled:bg-blue-700 disabled:text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {isCurrent ? `● ${st}` : `Set ${st}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {aiError && (
                <ErrorMessage
                  title="AI Analysis Error"
                  message={aiError}
                  onDismiss={() => setAiError(null)}
                />
              )}

              {/* AI Diagnostic View */}
              <ComplaintAnalysis
                analysis={activeTicket.aiAnalysis}
                isAnalyzing={isAnalyzing}
                onTriggerAnalysis={handleRunAiAnalysis}
              />

              {/* Support Engineering Notes Panel */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <h4 className="border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-slate-800">
                  Support Agent Notes &amp; Internal Logs (
                  {(activeTicket.supportNotes || []).length})
                </h4>

                <form
                  onSubmit={handleAddSupportNote}
                  className="mt-3 space-y-2.5"
                >
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Agent / Team Name"
                        value={noteAuthor}
                        onChange={(e) => setNoteAuthor(e.target.value)}
                        className="input input-bordered input-sm w-full bg-white text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2 flex gap-2">
                      <input
                        type="text"
                        placeholder="Add diagnostic finding or customer follow-up note..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="input input-bordered input-sm flex-1 bg-white text-xs"
                      />
                      <button
                        type="submit"
                        className="btn btn-sm border-none bg-blue-700 text-white hover:bg-blue-800"
                      >
                        Add Note
                      </button>
                    </div>
                  </div>
                </form>

                <div className="mt-4 space-y-2.5">
                  {(activeTicket.supportNotes || []).length === 0 ? (
                    <p className="text-xs text-slate-400">
                      No internal notes logged for this ticket yet.
                    </p>
                  ) : (
                    activeTicket.supportNotes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            {note.author}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {formatDateTime(note.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-700">{note.text}</p>
                      </div>
                    ))
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
