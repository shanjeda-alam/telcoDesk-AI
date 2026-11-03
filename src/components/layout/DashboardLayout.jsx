"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { NAVIGATION_TABS } from "@/config/constants";

export default function DashboardLayout({
  activeTab,
  setActiveTab,
  demoRole,
  setDemoRole,
  stats,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-blue-50/40 text-slate-900">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        demoRole={demoRole}
        setDemoRole={setDemoRole}
        stats={stats}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          demoRole={demoRole}
          setDemoRole={setDemoRole}
          openComplaintsCount={stats?.open ?? 0}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />

        {/* Main Workspace Content */}
        <main className="min-w-0 flex-1 px-4 py-5 pb-24 sm:px-6 sm:py-6 lg:px-8 lg:pb-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        {/* Mobile Bottom Quick Navigation Bar */}
        <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-blue-100 bg-white/95 px-1 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(30,64,175,0.06)] backdrop-blur-xs lg:hidden">
          {NAVIGATION_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id === "support-desk" && demoRole !== "agent") {
                    setDemoRole("agent");
                  }
                  setActiveTab(tab.id);
                }}
                className={`flex min-w-0 flex-1 flex-col items-center rounded-lg px-1 py-2 text-[10px] font-semibold ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="truncate">{tab.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
