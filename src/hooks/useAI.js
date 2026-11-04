"use client";

import { useState, useCallback } from "react";

export function useAI() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Calls POST /api/ai with mode: "analyze"
   */
  const analyzeComplaint = useCallback(async (complaintData) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "analyze",
          payload: complaintData,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        const errMessage =
          result?.error?.message ||
          "Failed to analyze complaint with AI.";
        const errCode = result?.error?.code || "AI_ERROR";
        const errObj = { code: errCode, message: errMessage };
        setError(errObj);
        return { success: false, error: errObj, data: null };
      }

      return {
        success: true,
        data: result.data,
        error: null,
      };
    } catch {
      const networkError = {
        code: "NETWORK_ERROR",
        message:
          "Network error while connecting to the AI analysis service. Your complaint can still be saved.",
      };
      setError(networkError);
      return { success: false, error: networkError, data: null };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Calls POST /api/ai with mode: "chat"
   */
  const sendChatMessage = useCallback(
    async ({ message, language = "English", history = [] }) => {
      setIsChatting(true);
      setError(null);

      try {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode: "chat",
            payload: {
              message,
              language,
              history,
            },
          }),
        });

        const result = await response.json();

        if (!response.ok || !result?.success) {
          const errMessage =
            result?.error?.message ||
            "Unable to get a response from the Groq AI Support Assistant.";
          const errCode = result?.error?.code || "CHAT_ERROR";
          const errObj = { code: errCode, message: errMessage };
          setError(errObj);
          return { success: false, error: errObj, data: null };
        }

        return {
          success: true,
          data: result.data,
          error: null,
        };
      } catch {
        const networkError = {
          code: "NETWORK_ERROR",
          message:
            "Unable to reach the AI Support Assistant server. Please check your connection.",
        };
        setError(networkError);
        return { success: false, error: networkError, data: null };
      } finally {
        setIsChatting(false);
      }
    },
    []
  );

  return {
    isAnalyzing,
    isChatting,
    error,
    clearError,
    analyzeComplaint,
    sendChatMessage,
  };
}
