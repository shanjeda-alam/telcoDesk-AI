"use client";

import { APP_CONFIG, NAVIGATION_TABS } from "@/config/constants";

export default function Header({
  activeTab,
  setActiveTab,
  demoRole,
  setDemoRole,
  openComplaintsCount = 0,
  onToggleMobileMenu,
}) {
  const currentTabInfo =
    NAVIGATION_TABS.find((t) => t.id === activeTab) || NAVIGATION_TABS[0];

  const handleRoleSwitch = (newRole) => {
    setDemoRole(newRole);
    if (newRole === "agent" && activeTab === "submit") {
      setActiveTab("support-desk");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
      <div className="flex min-h-16 items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        {/* Left: Mobile hamburger & Current View Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Open navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                {currentTabInfo.label}
              </h1>
              <span className="hidden rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-800 sm:inline-block">
                Groq AI Enabled
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 md:block">
              {currentTabInfo.description || APP_CONFIG.tagline}
            </p>
          </div>
        </div>

        {/* Right: Customer / Support Agent Demo View Switch & Quick Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Demo Role Switcher */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button
              type="button"
              aria-label="Switch to customer view"
              onClick={() => handleRoleSwitch("customer")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                demoRole === "customer"
                  ? "bg-white text-blue-800 shadow-2xs"
                  : "text-slate-600 hover:text-blue-800"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  demoRole === "customer" ? "bg-cyan-500" : "bg-slate-400"
                }`}
              />
              <span>Customer View</span>
            </button>

            <button
              type="button"
              aria-label="Switch to agent view"
              onClick={() => handleRoleSwitch("agent")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                demoRole === "agent"
                  ? "bg-blue-700 text-white shadow-2xs"
                  : "text-slate-600 hover:text-blue-800"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  demoRole === "agent" ? "bg-emerald-400" : "bg-slate-400"
                }`}
              />
              <span>Agent View</span>
              {openComplaintsCount > 0 && (
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    demoRole === "agent"
                      ? "bg-white text-blue-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {openComplaintsCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick CTA Button */}
          {demoRole === "customer" ? (
            <button
              type="button"
              onClick={() => setActiveTab("submit")}
              className="btn btn-sm hidden border-none bg-blue-700 text-white hover:bg-blue-800 sm:inline-flex"
            >
              + New Complaint
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab("support-desk")}
              className="btn btn-sm hidden border-none bg-blue-700 text-white hover:bg-blue-800 sm:inline-flex"
            >
              Open Agent Desk
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
