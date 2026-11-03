export const APP_CONFIG = {
  name: "TelcoDesk AI",
  title: "AI-Powered Telecom Complaint Management System",
  tagline: "Smarter Complaints. Faster Solutions. Better Connectivity.",
  storageKey: "telcodesk_ai_complaints_v1",
  roleStorageKey: "telcodesk_ai_demo_role_v1",
};

export const TELECOM_OPERATORS = [
  "Grameenphone",
  "Robi",
  "Banglalink",
  "Teletalk",
  "Other",
];

export const COMPLAINT_CATEGORIES = [
  "Internet Connectivity",
  "Network Coverage",
  "Call Drop",
  "SIM Card Problem",
  "Recharge Problem",
  "Billing Issue",
  "SMS Problem",
  "Other",
];

export const COMPLAINT_STATUSES = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
];

export const PRIORITY_LEVELS = ["High", "Medium", "Low"];

export const SENTIMENT_LEVELS = ["Frustrated", "Neutral", "Satisfied"];

export const LANGUAGES = ["English", "Bangla"];

export const NAVIGATION_TABS = [
  {
    id: "dashboard",
    label: "Overview Dashboard",
    shortLabel: "Dashboard",
    description: "Real-time complaint metrics & SLA insights",
    roles: ["customer", "agent"],
  },
  {
    id: "submit",
    label: "Submit Complaint",
    shortLabel: "Submit",
    description: "File a new telecom issue with instant Gemini AI triage",
    roles: ["customer", "agent"],
  },
  {
    id: "track",
    label: "Track Complaint",
    shortLabel: "Track",
    description: "Search ticket status, timeline & AI diagnostics",
    roles: ["customer", "agent"],
  },
  {
    id: "support-desk",
    label: "Support Agent Desk",
    shortLabel: "Agent Desk",
    description: "Manage, filter, update & resolve customer tickets",
    roles: ["agent"],
  },
  {
    id: "analytics",
    label: "Telecom Analytics",
    shortLabel: "Analytics",
    description: "Operator, category, sentiment & priority intelligence",
    roles: ["agent", "customer"],
  },
  {
    id: "ai-chat",
    label: "AI Support Assistant",
    shortLabel: "AI Assistant",
    description: "24/7 bilingual telecom troubleshooting assistant",
    roles: ["customer", "agent"],
  },
];

export const SUGGESTED_CHAT_QUESTIONS = [
  {
    en: "Why is my internet slow?",
    bn: "আমার ইন্টারনেট ধীরগতির কেন?",
  },
  {
    en: "Why are my calls dropping?",
    bn: "আমার কল বারবার কেটে যাচ্ছে কেন?",
  },
  {
    en: "How do I fix weak signals?",
    bn: "দুর্বল নেটওয়ার্ক সিগন্যাল কীভাবে ঠিক করব?",
  },
  {
    en: "What should I do if my recharge fails?",
    bn: "রিচার্জ ব্যর্থ হলে আমার কী করা উচিত?",
  },
  {
    en: "Why is my SIM not receiving SMS?",
    bn: "আমার সিমে এসএমএস আসছে না কেন?",
  },
];

export const INITIAL_DEMO_COMPLAINTS = [
  {
    id: "TEL-2026-0001",
    customerName: "Tanvir Ahmed",
    mobileNumber: "01711223344",
    operator: "Grameenphone",
    category: "Internet Connectivity",
    location: "Dhanmondi, Dhaka",
    language: "English",
    description:
      "My 4G data connection keeps dropping to E every 10 minutes since yesterday evening despite having an active 25GB monthly pack. Video calls and work meetings are completely unusable.",
    status: "In Progress",
    createdAt: "2026-10-30T09:15:00.000Z",
    updatedAt: "2026-10-30T14:20:00.000Z",
    aiAnalysis: {
      category: "Internet Connectivity",
      priority: "High",
      sentiment: "Frustrated",
      summary:
        "Customer in Dhanmondi, Dhaka is experiencing frequent 4G fallback to EDGE (2G) every 10 minutes despite an active 25GB data package, disrupting work video calls.",
      possibleCauses: [
        "Local indoor 4G LTE band congestion or cell handover instability in the area",
        "Handset network mode set to automatic GSM/WCDMA/LTE switching aggressively on weak indoor RSRP",
        "Stale APN profile or temporary SIM packet-session registration glitch",
      ],
      troubleshootingSteps: [
        "Lock preferred network type to '4G/LTE Only' or 'LTE/WCDMA' in mobile network settings and toggle Airplane Mode for 30 seconds.",
        "Reset Access Point Names (APN) to default ('gpinternet') and restart the handset.",
        "Test the SIM card in another 4G VoLTE handset to isolate device vs. local sector radio issues.",
      ],
      escalationRecommendation:
        "Escalate to Radio Access Network (RAN) L2 Engineering to inspect Dhanmondi sector LTE cell load and handover drop counters if issue persists after APN reset.",
    },
    supportNotes: [
      {
        id: "note-101",
        author: "Agent Farhana (L1 Noc)",
        text: "Verified 25GB pack active. Reset HLR packet data session remotely and requested customer to re-test LTE lock.",
        createdAt: "2026-10-30T11:30:00.000Z",
      },
      {
        id: "note-102",
        author: "RAN Tier-2 Support",
        text: "Scheduled sector antenna tilt optimization check for Dhanmondi Road 27 micro-cell.",
        createdAt: "2026-10-30T14:20:00.000Z",
      },
    ],
    timeline: [
      {
        status: "Submitted",
        note: "Complaint submitted and analyzed by TelcoDesk Gemini AI.",
        timestamp: "2026-10-30T09:15:00.000Z",
      },
      {
        status: "Under Review",
        note: "Assigned to Packet Core & Data Support queue.",
        timestamp: "2026-10-30T10:05:00.000Z",
      },
      {
        status: "In Progress",
        note: "Remote packet profile refresh completed; monitoring LTE stability.",
        timestamp: "2026-10-30T14:20:00.000Z",
      },
    ],
  },
  {
    id: "TEL-2026-0002",
    customerName: "Nusrat Jahan",
    mobileNumber: "01819556677",
    operator: "Robi",
    category: "Recharge Problem",
    location: "Agrabad, Chattogram",
    language: "Bangla",
    description:
      "আমি বিকাশ থেকে ৪৯৮ টাকার বান্ডেল রিচার্জ করেছি ২ ঘন্টা আগে। বিকাশ থেকে টাকা কেটে নিয়েছে এবং ট্রানজেকশন আইডি দিয়েছে, কিন্তু এখনো আমার সিমে কোনো ব্যালেন্স বা এমবি যোগ হয়নি। জরুরি সমাধান চাই।",
    status: "Under Review",
    createdAt: "2026-10-31T06:40:00.000Z",
    updatedAt: "2026-10-31T07:15:00.000Z",
    aiAnalysis: {
      category: "Recharge Problem",
      priority: "High",
      sentiment: "Frustrated",
      summary:
        "গ্রাহক ২ ঘণ্টা আগে বিকাশের মাধ্যমে ৪৯৮ টাকা বান্ডেল রিচার্জ করেছেন এবং টাকা কেটে নেওয়া হলেও সিমে ব্যালেন্স বা ডাটা প্যাক যুক্ত হয়নি। (MFS bundle recharge of BDT 498 deducted two hours ago but not credited to SIM).",
      possibleCauses: [
        "এমএফএস (bKash) গেটওয়ে এবং টেলিকম ইন্টেলিজেন্ট নেটওয়ার্ক (IN) চার্জিং সিস্টেমের মধ্যে কলব্যাক টাইমআউট",
        "৪৯৮ টাকার নির্দিষ্ট ডিনমিনেশন ট্যারিফ ট্রিগারে অস্থায়ী বিলম্ব বা পেন্ডিং রিকনসিলিয়েশন",
        "গ্রাহকের সিম প্রোফাইলে পূর্ববর্তী প্যাক ওভারল্যাপ বা প্রিপেইড ইনভয়েস লক",
      ],
      troubleshootingSteps: [
        "*222# এবং *8444*88# ডায়াল করে মেইন ব্যালেন্স ও ডাটা ব্যালেন্স পুনরায় যাচাই করুন।",
        "বিকাশ ট্রানজেকশন আইডি (TrxID) এবং রিচার্জের সময় সাপোর্ট নোটের সাথে মিলিয়ে এমএফএস গেটওয়ে লগ চেক করুন।",
        "লেনদেনটি পেন্ডিং থাকলে স্বয়ংক্রিয় রিফান্ড বা ম্যানুয়াল প্যাক প্রভিশনিংয়ের জন্য ২৪ ঘণ্টা অপেক্ষা না করে ফাস্ট-ট্র্যাক ভেরিফিকেশন করুন।",
      ],
      escalationRecommendation:
        "Escalate immediately to Billing & MFS Settlement Desk with the customer's mobile number and bKash TrxID for manual IN reconciliation.",
    },
    supportNotes: [
      {
        id: "note-201",
        author: "Billing Desk Agent",
        text: "Checked IN recharge gateway log; transaction found in pending state due to timeout. Forwarded for manual pack provisioning.",
        createdAt: "2026-10-31T07:15:00.000Z",
      },
    ],
    timeline: [
      {
        status: "Submitted",
        note: "Complaint logged with Bangla AI diagnostic analysis.",
        timestamp: "2026-10-31T06:40:00.000Z",
      },
      {
        status: "Under Review",
        note: "Billing & MFS Reconciliation team verifying transaction ledger.",
        timestamp: "2026-10-31T07:15:00.000Z",
      },
    ],
  },
  {
    id: "TEL-2026-0003",
    customerName: "Rafiqul Islam",
    mobileNumber: "01911889900",
    operator: "Banglalink",
    category: "Call Drop",
    location: "Uttara Sector 7, Dhaka",
    language: "English",
    description:
      "Calls are dropping automatically after 45 to 60 seconds during voice conversations indoors. Signal bars show 3 out of 4 bars, yet the call disconnects abruptly.",
    status: "Submitted",
    createdAt: "2026-10-31T08:05:00.000Z",
    updatedAt: "2026-10-31T08:05:00.000Z",
    aiAnalysis: {
      category: "Call Drop",
      priority: "Medium",
      sentiment: "Neutral",
      summary:
        "Customer in Uttara Sector 7 reports voice calls disconnecting consistently after 45–60 seconds indoors despite showing 3 signal bars.",
      possibleCauses: [
        "VoLTE to 3G/2G Circuit-Switched Fallback (CSFB) timer failure during indoor signal fluctuation",
        "High co-channel interference (SINR degradation) inside high-rise buildings despite moderate signal strength (RSRP)",
        "Incompatible VoLTE carrier config on handset firmware",
      ],
      troubleshootingSteps: [
        "Disable VoLTE calls temporarily in SIM settings to test if standard circuit-switched voice calls remain stable.",
        "Restart the phone and ensure Wi-Fi Calling is disabled if the local Wi-Fi router has unstable packet loss.",
        "Note exact timestamps of 2 recent dropped calls so engineering can trace call release codes.",
      ],
      escalationRecommendation:
        "Assign to Voice Core / RF Optimization team if call drops continue with VoLTE disabled.",
    },
    supportNotes: [],
    timeline: [
      {
        status: "Submitted",
        note: "Complaint submitted and prioritized by Gemini AI.",
        timestamp: "2026-10-31T08:05:00.000Z",
      },
    ],
  },
  {
    id: "TEL-2026-0004",
    customerName: "Mahmudul Hasan",
    mobileNumber: "01552334455",
    operator: "Teletalk",
    category: "SMS Problem",
    location: "Rajshahi Sadar, Rajshahi",
    language: "English",
    description:
      "Not receiving bank OTP and government verification SMS since this morning. Regular voice calls and outgoing SMS are working fine.",
    status: "Resolved",
    createdAt: "2026-10-29T10:00:00.000Z",
    updatedAt: "2026-10-29T16:45:00.000Z",
    aiAnalysis: {
      category: "SMS Problem",
      priority: "High",
      sentiment: "Frustrated",
      summary:
        "Customer is unable to receive incoming A2P transactional SMS (bank OTPs and verification codes) while voice calls and outgoing P2P SMS work normally.",
      possibleCauses: [
        "A2P SMSC routing congestion or DND (Do Not Disturb) promotional filter inadvertently blocking short-code messages",
        "Device SMS inbox memory full or spam protection app auto-blocking short-code senders",
        "SMSC number or HLR MT-SMS flag out of sync on the subscriber profile",
      ],
      troubleshootingSteps: [
        "Check the Spam & Blocked folder in the Messages app and clear old messages.",
        "Restart the handset after toggling Airplane Mode to force a fresh Location Update to the VLR/SMSC.",
        "Verify SMS Service Center (SMSC) number in messaging advanced settings.",
      ],
      escalationRecommendation:
        "Escalate to Messaging & VAS Support to clear HLR MT-SMS delivery flags and check A2P aggregator routing.",
    },
    supportNotes: [
      {
        id: "note-401",
        author: "VAS Engineer",
        text: "Flushed SM-RP-DA queue on SMSC and refreshed subscriber HLR MT-SMS profile. Customer confirmed receiving OTPs.",
        createdAt: "2026-10-29T16:45:00.000Z",
      },
    ],
    timeline: [
      {
        status: "Submitted",
        note: "Ticket created via TelcoDesk AI portal.",
        timestamp: "2026-10-29T10:00:00.000Z",
      },
      {
        status: "In Progress",
        note: "Messaging team refreshing SMSC delivery buffer.",
        timestamp: "2026-10-29T13:10:00.000Z",
      },
      {
        status: "Resolved",
        note: "HLR SMS routing refreshed and OTP delivery verified with customer.",
        timestamp: "2026-10-29T16:45:00.000Z",
      },
    ],
  },
  {
    id: "TEL-2026-0005",
    customerName: "Sadia Afrin",
    mobileNumber: "01799001122",
    operator: "Grameenphone",
    category: "Billing Issue",
    location: "Zindabazar, Sylhet",
    language: "English",
    description:
      "BDT 45 was deducted from my main balance over the last 3 days without making any calls or activating any value-added services. Please check and stop unauthorized deductions.",
    status: "Resolved",
    createdAt: "2026-10-28T12:20:00.000Z",
    updatedAt: "2026-10-29T09:10:00.000Z",
    aiAnalysis: {
      category: "Billing Issue",
      priority: "Medium",
      sentiment: "Frustrated",
      summary:
        "Customer reported unexplained main balance deductions totaling BDT 45 over three days without active calls or known VAS subscriptions.",
      possibleCauses: [
        "Auto-renewal of a third-party Value Added Service (VAS), caller tune, or news alert subscription",
        "Pay-as-you-go background mobile data consumption after data pack expiration",
        "Missed-call alert or micro-loan service fee deduction",
      ],
      troubleshootingSteps: [
        "Dial the operator's STOP ALL VAS USSD code or check active subscriptions in the self-care app.",
        "Turn off Mobile Data when no active internet pack is present to prevent pay-as-you-go charging.",
        "Review itemized usage history for the past 72 hours.",
      ],
      escalationRecommendation:
        "Route to Customer Billing Care to deactivate unwanted VAS and process goodwill balance adjustment if applicable.",
    },
    supportNotes: [
      {
        id: "note-501",
        author: "Customer Care L1",
        text: "Found active daily sports alert VAS (BDT 15/day). Deactivated all VAS subscriptions, enabled DND, and refunded BDT 45.",
        createdAt: "2026-10-29T09:10:00.000Z",
      },
    ],
    timeline: [
      {
        status: "Submitted",
        note: "Complaint registered and categorized under Billing Issue.",
        timestamp: "2026-10-28T12:20:00.000Z",
      },
      {
        status: "Resolved",
        note: "VAS deactivated and BDT 45 credited back to main balance.",
        timestamp: "2026-10-29T09:10:00.000Z",
      },
    ],
  },
];
