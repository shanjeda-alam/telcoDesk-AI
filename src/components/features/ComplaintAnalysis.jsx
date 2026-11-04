"use client";

import StatusBadge from "@/components/ui/StatusBadge";
import Loading from "@/components/ui/Loading";

export default function ComplaintAnalysis({
  analysis,
  isAnalyzing = false,
  onTriggerAnalysis,
  compact = false,
}) {
  if (isAnalyzing) {
    return (
      <Loading
        label="AI is analyzing telecom complaint..."
        subLabel="Evaluating category, priority, sentiment, root causes & troubleshooting steps"
      />
    );
  }

  if (!analysis) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
        <p className="text-sm font-semibold text-slate-700">
          AI Diagnostic Analysis Not Yet Attached
        </p>
        <p className="mt-1 text-xs text-slate-500">
          This complaint was saved without AI triage. You can run AI diagnostics
          anytime when the server API key is configured.
        </p>
        {onTriggerAnalysis && (
          <button
            type="button"
            onClick={onTriggerAnalysis}
            className="btn btn-xs mt-3 border-none bg-blue-700 text-white hover:bg-blue-800"
          >
            Run AI Analysis
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 bg-blue-50 px-4 py-3 text-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-blue-200 bg-white text-blue-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800">
            AI Telecom Diagnostic Report
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge type="priority" value={analysis.priority} />
          <StatusBadge type="sentiment" value={analysis.sentiment} />
        </div>
      </div>

      {/* Classification Bar */}
      <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:grid-cols-3">
        <div>
          <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
            AI Classified Category
          </span>
          <span className="mt-0.5 inline-block text-xs font-bold text-slate-800">
            {analysis.category}
          </span>
        </div>
        <div>
          <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Urgency / Priority
          </span>
          <span className="mt-0.5 inline-block text-xs font-bold text-slate-800">
            {analysis.priority} Priority
          </span>
        </div>
        <div>
          <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Subscriber Sentiment
          </span>
          <span className="mt-0.5 inline-block text-xs font-bold text-slate-800">
            {analysis.sentiment}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4 p-4">
        {/* Executive Summary */}
        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3.5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-blue-900">
            Complaint Summary
          </h5>
          <p className="mt-1 text-sm leading-relaxed text-slate-800">
            {analysis.summary}
          </p>
        </div>

        {!compact && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Possible Technical Causes */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Possible Technical Causes
              </h5>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-700">
                {(analysis.possibleCauses || []).map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Troubleshooting Steps */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Recommended Troubleshooting Steps
              </h5>
              <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-700">
                {(analysis.troubleshootingSteps || []).map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-800">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Escalation Recommendation */}
        <div className="rounded-lg border border-cyan-200 bg-cyan-50/40 p-3.5">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-950">
              NOC / Support Escalation Recommendation
            </h5>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-700">
            {analysis.escalationRecommendation}
          </p>
        </div>

        <p className="text-[11px] text-slate-400">
          Note: AI diagnostics are generated from subscriber-reported symptoms
          and do not represent live cell-tower outage telemetry.
        </p>
      </div>
    </div>
  );
}
