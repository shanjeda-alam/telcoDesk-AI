"use client";

import { APP_CONFIG, NAVIGATION_TABS } from "@/config/constants";

function NavIcon({ id, active }) {
  const colorClass = active ? "text-blue-700" : "text-slate-400 group-hover:text-blue-700";

  switch (id) {
    case "dashboard":
      return (
        <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case "submit":
      return (
        <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "track":
      return (
        <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case "support-desk":
      return (
        <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case "analytics":
      return (
        <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case "ai-chat":
      return (
        <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  demoRole,
  setDemoRole,
  stats,
  mobileOpen,
  onCloseMobile,
}) {
  const handleSelectTab = (tabId) => {
    if (tabId === "support-desk" && demoRole !== "agent") {
      setDemoRole("agent");
    }
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col border-r border-blue-100 bg-white text-slate-800">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-blue-100 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900">
                TelcoDesk
              </span>
              <span className="rounded-sm border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Telecom NOC & Care</p>
          </div>
        </div>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-700 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Active Mode Indicator Banner */}
      <div className="mx-4 mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500">Active Workspace</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              demoRole === "agent"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-blue-200 bg-white text-blue-700"
            }`}
          >
            {demoRole === "agent" ? "Support Agent" : "Subscriber"}
          </span>
        </div>
        <p className="mt-1 text-[11px] leading-snug text-slate-600">
          {demoRole === "agent"
            ? "Full access to ticket triage, status updates & SLA resolution."
            : "Submit complaints, track ticket timeline & chat with AI."}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 flex-1 space-y-1 px-3 overflow-y-auto">
        <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Core Modules
        </p>
        {NAVIGATION_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isAgentOnly = tab.id === "support-desk";

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectTab(tab.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-800 shadow-xs ring-1 ring-blue-200"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <NavIcon id={tab.id} active={isActive} />
                <span>{tab.label}</span>
              </div>

              {isAgentOnly && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "border border-blue-100 bg-white text-blue-700"
                  }`}
                >
                  {stats?.open ?? 0} Open
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick System Telemetry Footer */}
      <div className="border-t border-blue-100 p-4">
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              SLA Resolution Rate
            </span>
            <span className="text-xs font-bold text-blue-700">
              {stats?.resolutionRate ?? 0}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${stats?.resolutionRate ?? 0}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <span>Total Tickets: {stats?.total ?? 0}</span>
            <span>High Priority: {stats?.highPriorityOpen ?? 0}</span>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-500">
          {APP_CONFIG.name} • Bilingual (EN / বাংলা)
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative flex w-72 max-w-xs flex-1 flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
