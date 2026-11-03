"use client";

import { useState, useEffect } from "react";
import {
  COMPLAINT_CATEGORIES,
  LANGUAGES,
  TELECOM_OPERATORS,
} from "@/config/constants";
import { validateComplaintForm } from "@/lib/utils";
import ComplaintAnalysis from "./ComplaintAnalysis";
import ErrorMessage from "@/components/ui/ErrorMessage";
import StatusBadge from "@/components/ui/StatusBadge";

const INITIAL_FORM = {
  customerName: "",
  mobileNumber: "",
  operator: "Grameenphone",
  category: "Internet Connectivity",
  location: "",
  language: "English",
  description: "",
};

const SAMPLE_TEMPLATES = {
  en: {
    customerName: "Tariqul Islam",
    mobileNumber: "01715998877",
    operator: "Grameenphone",
    category: "Internet Connectivity",
    location: "Banani Road 11, Dhaka",
    language: "English",
    description:
      "My 4G LTE speed has dropped below 0.3 Mbps since 10 AM today even though I have an active 40GB monthly data pack and full signal bars. Websites time out and remote office VPN disconnects repeatedly.",
  },
  bn: {
    customerName: "ফারহানা আক্তার",
    mobileNumber: "01822334455",
    operator: "Robi",
    category: "Call Drop",
    location: "মিরপুর ১০, ঢাকা",
    language: "Bangla",
    description:
      "গত দুই দিন ধরে আমার ফোনে কথা বলার সময় ৩০-৪০ সেকেন্ড পর পর কল কেটে যাচ্ছে এবং অপর পাশের কথা স্পষ্ট শোনা যাচ্ছে না। নেটওয়ার্ক সিগন্যাল ২-৩ দাগ দেখালেও ঘরের ভেতরে কল ড্রপ হচ্ছে।",
  },
};

export default function ComplaintForm({
  onCreateComplaint,
  onAttachAnalysis,
  analyzeComplaint,
  isAnalyzing,
  onViewTicket,
  prefillData = null,
  onClearPrefill,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [aiWarning, setAiWarning] = useState(null);

  // Handle quick-submit prefill from Dashboard if provided
  useEffect(() => {
    if (prefillData) {
      setFormData((prev) => ({
        ...prev,
        ...prefillData,
      }));
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefillData, onClearPrefill]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleLoadSample = (langKey) => {
    const sample = SAMPLE_TEMPLATES[langKey];
    if (sample) {
      setFormData(sample);
      setFieldErrors({});
      setSubmittedTicket(null);
      setAiWarning(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAiWarning(null);

    const validation = validateComplaintForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});

    // Attempt Gemini AI Complaint Analysis
    const aiResult = await analyzeComplaint(formData);

    if (aiResult.success && aiResult.data) {
      const saved = onCreateComplaint(formData, aiResult.data);
      setSubmittedTicket(saved);
    } else {
      // Save complaint even if Gemini fails (Section 5 requirement)
      const saved = onCreateComplaint(formData, null);
      setSubmittedTicket(saved);
      setAiWarning({
        code: aiResult.error?.code || "AI_UNAVAILABLE",
        message:
          aiResult.error?.message ||
          "Gemini AI analysis could not be completed, so your complaint was saved directly without AI triage.",
      });
    }
  };

  const handleRetryAiForSavedTicket = async () => {
    if (!submittedTicket) return;
    setAiWarning(null);
    const aiResult = await analyzeComplaint({
      operator: submittedTicket.operator,
      category: submittedTicket.category,
      location: submittedTicket.location,
      language: submittedTicket.language,
      description: submittedTicket.description,
    });

    if (aiResult.success && aiResult.data) {
      onAttachAnalysis(submittedTicket.id, aiResult.data);
      setSubmittedTicket((prev) => ({
        ...prev,
        category: aiResult.data.category || prev.category,
        aiAnalysis: aiResult.data,
      }));
    } else {
      setAiWarning({
        code: aiResult.error?.code || "AI_UNAVAILABLE",
        message:
          aiResult.error?.message ||
          "Still unable to reach Gemini AI. Verify GEMINI_API_KEY in .env.local.",
      });
    }
  };

  const handleResetNew = () => {
    setFormData(INITIAL_FORM);
    setFieldErrors({});
    setSubmittedTicket(null);
    setAiWarning(null);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Complaint Submission Form (7 cols) */}
      <div className="lg:col-span-7">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Submit a Telecom Complaint
              </h2>
              <p className="text-xs text-slate-500">
                Provide your subscriber and issue details for instant ticket
                generation &amp; Gemini AI triage
              </p>
            </div>

            {/* Quick Demo Fillers */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleLoadSample("en")}
                className="btn btn-xs border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              >
                Fill English Sample
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample("bn")}
                className="btn btn-xs border border-cyan-200 bg-cyan-50 text-cyan-900 hover:bg-cyan-100"
              >
                বাংলা নমুনা (Bangla)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            {/* Row 1: Customer Name & Mobile Number */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                  className={`input input-bordered input-sm h-10 w-full bg-white text-sm ${
                    fieldErrors.customerName ? "border-red-400" : ""
                  }`}
                />
                {fieldErrors.customerName && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 01711223344"
                  value={formData.mobileNumber}
                  onChange={(e) => handleChange("mobileNumber", e.target.value)}
                  className={`input input-bordered input-sm h-10 w-full bg-white font-mono text-sm ${
                    fieldErrors.mobileNumber ? "border-red-400" : ""
                  }`}
                />
                {fieldErrors.mobileNumber && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.mobileNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Telecom Operator & Complaint Category */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Telecom Operator <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.operator}
                  onChange={(e) => handleChange("operator", e.target.value)}
                  className="select select-bordered select-sm h-10 w-full bg-white text-sm"
                >
                  {TELECOM_OPERATORS.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                {fieldErrors.operator && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.operator}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Complaint Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="select select-bordered select-sm h-10 w-full bg-white text-sm"
                >
                  {COMPLAINT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {fieldErrors.category && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.category}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Location & Preferred Language */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Location / Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhanmondi, Dhaka or Agrabad, Chattogram"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className={`input input-bordered input-sm h-10 w-full bg-white text-sm ${
                    fieldErrors.location ? "border-red-400" : ""
                  }`}
                />
                {fieldErrors.location && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.location}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Preferred AI Output Language{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleChange("language", lang)}
                      className={`h-10 rounded-lg border text-xs font-semibold transition-all ${
                        formData.language === lang
                          ? "border-blue-700 bg-blue-50 text-blue-800 shadow-2xs"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {lang === "Bangla" ? "Bangla (বাংলা)" : "English"}
                    </button>
                  ))}
                </div>
                {fieldErrors.language && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.language}
                  </p>
                )}
              </div>
            </div>

            {/* Row 4: Complaint Description */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Complaint Description <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {formData.description.length}/2000 chars
                </span>
              </div>
              <textarea
                rows={4}
                placeholder="Describe the telecom issue in English or বাংলা (e.g., when it started, signal level, error messages, recharge amount)..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={`textarea textarea-bordered w-full bg-white text-sm leading-relaxed ${
                  fieldErrors.description ? "border-red-400" : ""
                }`}
              />
              {fieldErrors.description && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.description}
                </p>
              )}
            </div>

            {/* Submit & Reset Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleResetNew}
                className="btn btn-sm btn-ghost text-slate-600"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="btn btn-sm h-10 border-none bg-blue-700 px-6 text-white hover:bg-blue-800 disabled:bg-slate-300"
              >
                {isAnalyzing ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    <span>Analyzing &amp; Generating Ticket...</span>
                  </>
                ) : (
                  <span>Submit &amp; Analyze with Gemini AI</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Ticket Confirmation & Live Gemini AI Analyzer Panel (5 cols) */}
      <div className="space-y-4 lg:col-span-5">
        {submittedTicket ? (
          <>
            {/* Ticket Created Confirmation Banner */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-2xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    Ticket Registered
                  </span>
                  <h3 className="mt-2 font-mono text-2xl font-bold text-slate-900">
                    {submittedTicket.id}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Subscriber:{" "}
                    <strong className="text-slate-800">
                      {submittedTicket.customerName}
                    </strong>{" "}
                    ({submittedTicket.mobileNumber})
                  </p>
                </div>

                <StatusBadge type="status" value={submittedTicket.status} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onViewTicket(submittedTicket.id)}
                  className="btn btn-xs border-none bg-blue-700 text-white hover:bg-blue-800"
                >
                  Track Ticket Timeline
                </button>
                <button
                  type="button"
                  onClick={handleResetNew}
                  className="btn btn-xs border border-emerald-300 bg-white text-emerald-900 hover:bg-emerald-100"
                >
                  + Submit Another
                </button>
              </div>
            </div>

            {/* Warning if Gemini failed but complaint was saved */}
            {aiWarning && (
              <ErrorMessage
                variant="warning"
                title="Complaint Saved Without AI Analysis"
                code={aiWarning.code}
                message={aiWarning.message}
                onRetry={handleRetryAiForSavedTicket}
                onDismiss={() => setAiWarning(null)}
              />
            )}

            {/* Gemini AI Analysis Card */}
            <ComplaintAnalysis
              analysis={submittedTicket.aiAnalysis}
              isAnalyzing={isAnalyzing}
              onTriggerAnalysis={handleRetryAiForSavedTicket}
            />
          </>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
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
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Gemini AI Complaint Analyzer
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time bilingual telecom triage &amp; root-cause analysis
                </p>
              </div>
            </div>

            {isAnalyzing ? (
              <div className="mt-4">
                <ComplaintAnalysis isAnalyzing={true} />
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-xs text-slate-600">
                <p className="leading-relaxed">
                  When you submit a complaint,{" "}
                  <strong className="text-slate-800">TelcoDesk AI</strong>{" "}
                  processes the issue securely on the server using Google Gemini
                  and generates:
                </p>

                <ul className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    <span>
                      <strong>Unique Ticket ID</strong> (e.g.,{" "}
                      <code className="font-mono text-blue-700">
                        TEL-2026-0006
                      </code>
                      )
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    <span>
                      <strong>AI Category &amp; Urgency Priority</strong> (High,
                      Medium, Low)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    <span>
                      <strong>Subscriber Sentiment</strong> (Frustrated,
                      Neutral, Satisfied)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    <span>
                      <strong>Possible Technical Causes</strong> &amp;{" "}
                      <strong>Step-by-Step Troubleshooting</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    <span>
                      <strong>NOC Escalation Path</strong> in English or বাংলা
                    </span>
                  </li>
                </ul>

                <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3 text-[11px] text-blue-900">
                  <strong>Offline Resilience:</strong> Even if the Gemini API key
                  is not yet configured in <code>.env.local</code>, your
                  complaint will still be safely recorded with a valid Ticket ID.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
