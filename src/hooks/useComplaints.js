"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { APP_CONFIG, INITIAL_DEMO_COMPLAINTS } from "@/config/constants";
import {
  calculateComplaintStats,
  generateTicketId,
  normalizeMobileNumber,
} from "@/lib/utils";

/**
 * Validates that a parsed storage array contains valid complaint objects
 */
function sanitizeStoredComplaints(rawArray) {
  if (!Array.isArray(rawArray)) return null;

  const valid = rawArray.filter(
    (item) =>
      item &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.customerName === "string" &&
      typeof item.mobileNumber === "string" &&
      typeof item.description === "string"
  );

  return valid;
}

export function useComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageError, setStorageError] = useState(null);

  // Load from localStorage only on client mount
  useEffect(() => {
    try {
      const storedRaw = window.localStorage.getItem(APP_CONFIG.storageKey);
      if (!storedRaw) {
        window.localStorage.setItem(
          APP_CONFIG.storageKey,
          JSON.stringify(INITIAL_DEMO_COMPLAINTS)
        );
        setComplaints(INITIAL_DEMO_COMPLAINTS);
      } else {
        const parsed = JSON.parse(storedRaw);
        const sanitized = sanitizeStoredComplaints(parsed);
        if (sanitized === null) {
          // Corrupted structure -> recover with initial demo data
          window.localStorage.setItem(
            APP_CONFIG.storageKey,
            JSON.stringify(INITIAL_DEMO_COMPLAINTS)
          );
          setComplaints(INITIAL_DEMO_COMPLAINTS);
        } else {
          setComplaints(sanitized);
        }
      }
    } catch {
      setStorageError(
        "Browser localStorage is restricted or unavailable. Operating in in-memory session mode."
      );
      setComplaints(INITIAL_DEMO_COMPLAINTS);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist changes to localStorage safely
  const persistComplaints = useCallback((nextList) => {
    setComplaints(nextList);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          APP_CONFIG.storageKey,
          JSON.stringify(nextList)
        );
      }
    } catch {
      setStorageError("Failed to persist changes to browser localStorage.");
    }
  }, []);

  /**
   * Creates a new complaint record with a unique ticket ID (e.g. TEL-2026-0006)
   */
  const createComplaint = useCallback(
    (formData, aiAnalysis = null) => {
      const now = new Date().toISOString();
      const ticketId = generateTicketId(complaints);

      const newComplaint = {
        id: ticketId,
        customerName: formData.customerName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        operator: formData.operator,
        category: aiAnalysis?.category || formData.category,
        userSelectedCategory: formData.category,
        location: formData.location.trim(),
        language: formData.language || "English",
        description: formData.description.trim(),
        status: "Submitted",
        createdAt: now,
        updatedAt: now,
        aiAnalysis: aiAnalysis || null,
        supportNotes: [],
        timeline: [
          {
            status: "Submitted",
            note: aiAnalysis
              ? "Complaint submitted and automatically triaged by TelcoDesk Gemini AI."
              : "Complaint submitted without AI analysis (saved via offline/fallback resilience).",
            timestamp: now,
          },
        ],
      };

      const updated = [newComplaint, ...complaints];
      persistComplaints(updated);
      return newComplaint;
    },
    [complaints, persistComplaints]
  );

  /**
   * Updates complaint status and appends to its timeline
   */
  const updateComplaintStatus = useCallback(
    (ticketId, newStatus, statusNote = "") => {
      const now = new Date().toISOString();
      const updated = complaints.map((item) => {
        if (item.id !== ticketId) return item;
        const timelineEntry = {
          status: newStatus,
          note:
            statusNote.trim() ||
            `Ticket status updated to ${newStatus} by Support Desk.`,
          timestamp: now,
        };
        return {
          ...item,
          status: newStatus,
          updatedAt: now,
          timeline: [...(Array.isArray(item.timeline) ? item.timeline : []), timelineEntry],
        };
      });

      persistComplaints(updated);
    },
    [complaints, persistComplaints]
  );

  /**
   * Adds a support agent note to a complaint record
   */
  const addSupportNote = useCallback(
    (ticketId, noteText, author = "Support Specialist") => {
      const trimmed = (noteText || "").trim();
      if (!trimmed) return;

      const now = new Date().toISOString();
      const newNote = {
        id: `note-${Date.now()}`,
        author: author.trim() || "Support Specialist",
        text: trimmed,
        createdAt: now,
      };

      const updated = complaints.map((item) => {
        if (item.id !== ticketId) return item;
        return {
          ...item,
          updatedAt: now,
          supportNotes: [
            ...(Array.isArray(item.supportNotes) ? item.supportNotes : []),
            newNote,
          ],
        };
      });

      persistComplaints(updated);
    },
    [complaints, persistComplaints]
  );

  /**
   * Attaches or refreshes Gemini AI analysis on an existing complaint
   */
  const attachAiAnalysis = useCallback(
    (ticketId, aiAnalysis) => {
      if (!aiAnalysis) return;
      const now = new Date().toISOString();

      const updated = complaints.map((item) => {
        if (item.id !== ticketId) return item;
        return {
          ...item,
          category: aiAnalysis.category || item.category,
          aiAnalysis,
          updatedAt: now,
          timeline: [
            ...(Array.isArray(item.timeline) ? item.timeline : []),
            {
              status: item.status,
              note: "Gemini AI diagnostic analysis completed and attached to ticket.",
              timestamp: now,
            },
          ],
        };
      });

      persistComplaints(updated);
    },
    [complaints, persistComplaints]
  );

  /**
   * Marks a complaint as Resolved with an optional resolution note
   */
  const resolveComplaint = useCallback(
    (ticketId, resolutionSummary = "") => {
      const now = new Date().toISOString();
      const noteText =
        resolutionSummary.trim() ||
        "Issue resolved and verified by Support Agent.";

      const updated = complaints.map((item) => {
        if (item.id !== ticketId) return item;
        return {
          ...item,
          status: "Resolved",
          updatedAt: now,
          supportNotes: resolutionSummary.trim()
            ? [
                ...(Array.isArray(item.supportNotes) ? item.supportNotes : []),
                {
                  id: `note-${Date.now()}`,
                  author: "Resolution Desk",
                  text: noteText,
                  createdAt: now,
                },
              ]
            : item.supportNotes || [],
          timeline: [
            ...(Array.isArray(item.timeline) ? item.timeline : []),
            {
              status: "Resolved",
              note: noteText,
              timestamp: now,
            },
          ],
        };
      });

      persistComplaints(updated);
    },
    [complaints, persistComplaints]
  );

  /**
   * Deletes a complaint record by ticket ID
   */
  const deleteComplaint = useCallback(
    (ticketId) => {
      const updated = complaints.filter((item) => item.id !== ticketId);
      persistComplaints(updated);
    },
    [complaints, persistComplaints]
  );

  /**
   * Restores the default demo complaints dataset
   */
  const resetDemoData = useCallback(() => {
    persistComplaints(INITIAL_DEMO_COMPLAINTS);
  }, [persistComplaints]);

  /**
   * Finds complaints matching a Ticket ID or Mobile Number query
   */
  const findByTicketOrMobile = useCallback(
    (query = "") => {
      const trimmed = query.trim();
      if (!trimmed) return [];

      const upperQuery = trimmed.toUpperCase();
      const normalizedQueryPhone = normalizeMobileNumber(trimmed);

      return complaints.filter((item) => {
        const idMatch = item.id.toUpperCase().includes(upperQuery);
        const itemPhone = normalizeMobileNumber(item.mobileNumber);
        const phoneMatch =
          normalizedQueryPhone.length >= 4 &&
          itemPhone.includes(normalizedQueryPhone);
        return idMatch || phoneMatch;
      });
    },
    [complaints]
  );

  const stats = useMemo(
    () => calculateComplaintStats(complaints),
    [complaints]
  );

  return {
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
    findByTicketOrMobile,
  };
}
