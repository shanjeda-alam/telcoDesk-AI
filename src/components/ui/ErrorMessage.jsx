"use client";

export default function ErrorMessage({
  title = "Notice",
  message,
  code,
  onRetry,
  onDismiss,
  variant = "error",
}) {
  if (!message) return null;

  const isWarning = variant === "warning";

  return (
    <div
      role="alert"
      className={`rounded-xl border p-4 shadow-xs ${
        isWarning
          ? "border-amber-200 bg-amber-50/90 text-amber-950"
          : "border-red-200 bg-red-50/90 text-red-950"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
            isWarning
              ? "bg-amber-200/80 text-amber-800"
              : "bg-red-200/80 text-red-800"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="flex-1 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold">{title}</h4>
            {code && (
              <span className="rounded-md bg-white/80 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-700 border border-slate-200">
                {code}
              </span>
            )}
          </div>
          <p className="mt-1 leading-relaxed opacity-90">{message}</p>

          {(onRetry || onDismiss) && (
            <div className="mt-3 flex items-center gap-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="btn btn-xs border-none bg-blue-700 text-white hover:bg-blue-800"
                >
                  Try Again
                </button>
              )}
              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="btn btn-xs btn-ghost text-slate-700"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
