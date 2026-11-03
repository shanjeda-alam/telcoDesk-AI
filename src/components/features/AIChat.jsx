"use client";

import { useState, useRef, useEffect } from "react";
import { LANGUAGES, SUGGESTED_CHAT_QUESTIONS } from "@/config/constants";
import { formatDateTime } from "@/lib/utils";
import ErrorMessage from "@/components/ui/ErrorMessage";

const INITIAL_WELCOME_MESSAGES = {
  English:
    "Hello! I am the TelcoDesk AI Support Assistant. Ask me any question about slow 4G/5G internet, dropped calls, weak indoor signal, failed MFS recharges, or SMS/OTP issues in English or বাংলা.",
  Bangla:
    "আসসালামু আলাইকুম! আমি TelcoDesk AI সাপোর্ট অ্যাসিস্ট্যান্ট। ধীরগতির ইন্টারনেট, কল ড্রপ, দুর্বল নেটওয়ার্ক সিগন্যাল, রিচার্জ সমস্যা বা এসএমএস না আসা সম্পর্কে বাংলায় অথবা ইংরেজিতে যেকোনো প্রশ্ন করতে পারেন।",
};

export default function AIChat({
  sendChatMessage = async () => ({
    success: false,
    error: {
      code: "CHAT_ERROR",
      message: "AI assistant is temporarily unavailable.",
    },
    data: null,
  }),
  isChatting,
  onNavigateSubmit = () => {},
}) {
  const [language, setLanguage] = useState("English");
  const [messages, setMessages] = useState([
    {
      id: "welcome-msg",
      role: "assistant",
      content: INITIAL_WELCOME_MESSAGES.English,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [chatError, setChatError] = useState(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatting]);

  const handleLanguageSwitch = (newLang) => {
    setLanguage(newLang);
    if (messages.length === 1 && messages[0].id === "welcome-msg") {
      setMessages([
        {
          id: "welcome-msg",
          role: "assistant",
          content: INITIAL_WELCOME_MESSAGES[newLang],
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleClearChat = () => {
    setChatError(null);
    setLastFailedPrompt("");
    setMessages([
      {
        id: "welcome-msg",
        role: "assistant",
        content: INITIAL_WELCOME_MESSAGES[language],
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const submitQuestion = async (questionText) => {
    const trimmed = (questionText || "").trim();
    if (!trimmed || isChatting) return;

    setChatError(null);
    setLastFailedPrompt("");

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput("");

    try {
      const result = await sendChatMessage({
        message: trimmed,
        language,
        history: updatedHistory.slice(-8).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      if (!result || typeof result !== "object") {
        throw new Error("AI response was empty.");
      }

      if (result.success && result.data?.reply) {
        const botMsg = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: result.data.reply,
          timestamp: result.data.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setLastFailedPrompt(trimmed);
        setChatError({
          code: result.error?.code || "CHAT_ERROR",
          message:
            result.error?.message ||
            "Unable to get a response from Gemini AI. Please verify GEMINI_API_KEY in .env.local.",
        });
      }
    } catch (error) {
      setLastFailedPrompt(trimmed);
      setChatError({
        code: "CHAT_ERROR",
        message:
          error?.message ||
          "Unable to get a response from Gemini AI. Please verify GEMINI_API_KEY in .env.local.",
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    submitQuestion(input);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Sidebar: Suggested Questions & Capabilities (4 cols) */}
      <div className="space-y-4 lg:col-span-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Suggested Questions
              </h3>
              <p className="text-xs text-slate-500">
                Click any common telecom issue to ask Gemini
              </p>
            </div>
            <span className="rounded-md bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-800 border border-cyan-200">
              {language === "Bangla" ? "বাংলা" : "EN"}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {SUGGESTED_CHAT_QUESTIONS.map((q, idx) => {
              const displayQuestion = language === "Bangla" ? q.bn : q.en;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isChatting}
                  onClick={() => submitQuestion(displayQuestion)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-left text-xs font-medium text-slate-800 transition-all hover:border-blue-600 hover:bg-blue-50/50 disabled:opacity-50"
                >
                  <span>{displayQuestion}</span>
                  <span className="ml-2 text-blue-700">→</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Escalation Card */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-slate-800 shadow-2xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800">
            Need Engineering Escalation?
          </h4>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
            If self-service troubleshooting does not resolve your issue, file an
            official ticket with our NOC &amp; Billing desk.
          </p>
          <button
            type="button"
            onClick={onNavigateSubmit}
            className="btn btn-xs mt-3 border-none bg-blue-700 font-semibold text-white hover:bg-blue-800"
          >
            + Submit Official Complaint
          </button>
        </div>
      </div>

      {/* Right Column: Interactive Chat Window (8 cols) */}
      <div className="flex h-[min(680px,75vh)] min-h-[420px] flex-col overflow-hidden rounded-xl border border-blue-100 bg-white shadow-2xs lg:col-span-8">
        {/* Chat Window Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 bg-white px-4 py-3.5 text-slate-800 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
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
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  TelcoDesk AI Support Assistant
                </h3>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-500">
                Powered by Google Gemini • Session History Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex rounded-lg border border-blue-100 bg-blue-50 p-0.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageSwitch(lang)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    language === lang
                      ? "bg-blue-700 text-white"
                      : "text-slate-600 hover:text-blue-800"
                  }`}
                >
                  {lang === "Bangla" ? "বাংলা" : "English"}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleClearChat}
              className="btn btn-xs border border-blue-100 bg-white text-slate-700 hover:bg-blue-50"
            >
              Clear Chat
            </button>
          </div>
        </div>

        {/* Conversation Messages Area */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-blue-50/40 p-3 sm:p-5">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[92%] break-words rounded-2xl px-4 py-3 text-sm shadow-2xs sm:max-w-[85%] ${
                    isUser
                      ? "rounded-br-xs bg-blue-700 text-white"
                      : "rounded-bl-xs border border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-4 text-[10px] opacity-75">
                    <span className="font-bold uppercase tracking-wider">
                      {isUser ? "You" : "TelcoDesk AI"}
                    </span>
                    <span>{formatDateTime(msg.timestamp)}</span>
                  </div>
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}

          {isChatting && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-xs border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="loading loading-dots loading-sm text-cyan-600" />
                  <span>
                    {language === "Bangla"
                      ? "TelcoDesk AI উত্তর তৈরি করছে..."
                      : "TelcoDesk AI is diagnosing your issue..."}
                  </span>
                </div>
              </div>
            </div>
          )}

          {chatError && (
            <ErrorMessage
              title="AI Assistant Unavailable"
              code={chatError.code}
              message={chatError.message}
              onRetry={
                lastFailedPrompt
                  ? () => submitQuestion(lastFailedPrompt)
                  : undefined
              }
              onDismiss={() => setChatError(null)}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={handleFormSubmit}
          className="border-t border-blue-100 bg-white p-3 sm:p-4"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={
                language === "Bangla"
                  ? "আপনার টেলিকম সমস্যাটি এখানে লিখুন..."
                  : "Ask a telecom troubleshooting question (e.g., Why is my internet slow?)..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isChatting}
              className="input input-bordered input-sm h-10 min-w-0 flex-1 bg-white text-sm"
            />
            <button
              type="submit"
              disabled={isChatting || !input.trim()}
              className="btn btn-sm h-10 border-none bg-blue-700 px-5 text-white hover:bg-blue-800 disabled:bg-slate-300"
            >
              {isChatting ? "Sending..." : "Send"}
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Supports English and বাংলা • Do not share PINs, passwords, or OTP
            codes in chat.
          </p>
        </form>
      </div>
    </div>
  );
}
