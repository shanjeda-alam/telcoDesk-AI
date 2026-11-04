"use client";

import { useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardStats from "@/components/features/DashboardStats";
import ComplaintForm from "@/components/features/ComplaintForm";
import ComplaintList from "@/components/features/ComplaintList";
import SupportDesk from "@/components/features/SupportDesk";
import AIChat from "@/components/features/AIChat";
import Analytics from "@/components/features/Analytics";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useComplaints } from "@/hooks/useComplaints";
import { useAI } from "@/hooks/useAI";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [demoRole, setDemoRole] = useState("customer");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [prefillComplaint, setPrefillComplaint] = useState(null);

  const {
    complaints,
    stats,
    isHydrated,
    storageError,
    createComplaint,
    updateComplaintStatus,
    addSupportNote,
    attachAiAnalysis,
    resolveComplaint,
    deleteComplaint,
    resetDemoData,
  } = useComplaints();

  const {
    isAnalyzing,
    isChatting,
    analyzeComplaint,
    sendChatMessage,
  } = useAI();

  const handleInspectComplaint = useCallback((ticketId) => {
    setSelectedTicketId(ticketId);
    setActiveTab("track");
  }, []);

  const handleQuickSubmitFromDashboard = useCallback((quickData) => {
    setPrefillComplaint(quickData);
    setActiveTab("submit");
  }, []);

  const handleClearPrefill = useCallback(() => {
    setPrefillComplaint(null);
  }, []);

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      demoRole={demoRole}
      setDemoRole={setDemoRole}
      stats={stats}
    >
      {storageError && (
        <div className="mb-4">
          <ErrorMessage
            variant="warning"
            title="Storage Notice"
            message={storageError}
          />
        </div>
      )}

      {!isHydrated ? (
        <Loading
          label="Loading TelcoDesk AI Workspace..."
          subLabel="Initializing subscriber complaint records and telemetry"
        />
      ) : (
        <>
          {activeTab === "dashboard" && (
            <DashboardStats
              complaints={complaints}
              stats={stats}
              onNavigate={setActiveTab}
              onSelectComplaint={handleInspectComplaint}
              onQuickSubmit={handleQuickSubmitFromDashboard}
            />
          )}

          {activeTab === "submit" && (
            <ComplaintForm
              onCreateComplaint={createComplaint}
              onAttachAnalysis={attachAiAnalysis}
              analyzeComplaint={analyzeComplaint}
              isAnalyzing={isAnalyzing}
              onViewTicket={handleInspectComplaint}
              prefillData={prefillComplaint}
              onClearPrefill={handleClearPrefill}
            />
          )}

          {activeTab === "track" && (
            <ComplaintList
              complaints={complaints}
              selectedTicketId={selectedTicketId}
              onSelectTicketId={setSelectedTicketId}
              analyzeComplaint={analyzeComplaint}
              isAnalyzing={isAnalyzing}
              onAttachAnalysis={attachAiAnalysis}
              onNavigateSubmit={() => setActiveTab("submit")}
            />
          )}

          {activeTab === "support-desk" && (
            <SupportDesk
              complaints={complaints}
              demoRole={demoRole}
              setDemoRole={setDemoRole}
              onUpdateStatus={updateComplaintStatus}
              onAddNote={addSupportNote}
              onResolveComplaint={resolveComplaint}
              onDeleteComplaint={deleteComplaint}
              onResetDemoData={resetDemoData}
              onAttachAnalysis={attachAiAnalysis}
              analyzeComplaint={analyzeComplaint}
              isAnalyzing={isAnalyzing}
            />
          )}

          {activeTab === "analytics" && (
            <Analytics
              stats={stats}
              complaints={complaints}
              onResetDemoData={resetDemoData}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === "ai-chat" && (
            <AIChat
              sendChatMessage={sendChatMessage}
              isChatting={isChatting}
              onNavigateSubmit={() => setActiveTab("submit")}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
