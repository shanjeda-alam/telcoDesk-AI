"use client";

export default function Loading({
  label = "Processing telecom diagnostics...",
  subLabel = "Communicating with TelcoDesk AI engine",
  compact = false,
}) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2.5 text-sm font-medium text-slate-600">
        <span className="loading loading-spinner loading-sm text-cyan-600" />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs">
      <div className="relative mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700">
        <span className="loading loading-spinner loading-md text-blue-600" />
      </div>
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      {subLabel && (
        <p className="mt-1 text-xs text-slate-500">{subLabel}</p>
      )}
    </div>
  );
}
