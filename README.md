# TelcoDesk AI — AI-Powered Telecom Complaint Management System

> **Smarter Complaints. Faster Solutions. Better Connectivity.**

**TelcoDesk AI** is a full-stack, bilingual (**English & বাংলা**) telecom customer complaint management and Network Operations Center (NOC) triage platform built with **Next.js (App Router)**, **React**, **Tailwind CSS**, **DaisyUI**, and **Groq**.

---

## 1. Key Modules & Features

1. **Executive Overview Dashboard (`DashboardStats.jsx`)**
   - Live metrics computed from actual complaint records: Total, Open (`Submitted` + `Under Review`), `In Progress`, and `Resolved` complaints.
   - Complaint category breakdown, AI priority distribution, recent complaints table, and an inline Quick Complaint Submission panel.
2. **Submit Complaint (`ComplaintForm.jsx`)**
   - Validated telecom complaint form supporting **Grameenphone**, **Robi**, **Banglalink**, **Teletalk**, and **Other**.
   - Covers 8 telecom issue categories: *Internet Connectivity, Network Coverage, Call Drop, SIM Card Problem, Recharge Problem, Billing Issue, SMS Problem, Other*.
   - Generates sequential unique Ticket IDs (`TEL-2026-0001`, `TEL-2026-0002`, etc.).
   - Offline/API fallback resilience: If the Groq API is unconfigured or unreachable, customer complaints are still safely saved to `localStorage` and can be analyzed later on demand.
3. **AI Complaint Analyzer (`ComplaintAnalysis.jsx`)**
   - Uses structured JSON output from Groq to return:
     - **Classified Category**
     - **Priority Level** (`High`, `Medium`, `Low`)
     - **Subscriber Sentiment** (`Frustrated`, `Neutral`, `Satisfied`)
     - **Executive Summary** (in English or বাংলা)
     - **Possible Technical Causes** (without falsely claiming live cell-tower outage telemetry)
     - **Recommended Troubleshooting Steps**
     - **NOC / Tier-2 Escalation Recommendation**
4. **Complaint Tracking (`ComplaintList.jsx`)**
   - Search by **Ticket ID** (`TEL-2026-0001`) or **Subscriber Mobile Number** (`01711223344`).
   - 4-stage resolution lifecycle stepper (`Submitted` → `Under Review` → `In Progress` → `Resolved`), full complaint details, AI diagnostic report, chronological timeline, and support agent notes.
5. **Support Agent Operations Desk (`SupportDesk.jsx`)**
   - Demonstration customer/agent workspace switcher in the top bar.
   - Multi-criteria search and filtering by **Operator**, **Category**, **Priority**, and **Status**.
   - Status transition updates, support note logging, one-click complaint resolution, and demo record deletion with confirmation.
6. **AI Support Assistant (`AIChat.jsx`)**
   - Interactive bilingual (English & বাংলা) telecom troubleshooting chatbot powered by Groq (`openai/gpt-oss-120b` by default).
   - Includes suggested telecom questions, session conversation history, loading states, error recovery, and chat reset.

---

## 2. Technology Stack

- **Frontend:** Next.js 15 (App Router), React 19, JavaScript (ES2024+, zero TypeScript), Tailwind CSS v4, DaisyUI v5
- **Backend:** Next.js Server-Side API Route (`POST /api/ai`) for complaint analysis and chat
- **AI Engine:** Groq chat completions for complaint analysis and the AI assistant
- **Storage:** Client-side `localStorage` with hydration safety & preloaded Bangladesh telecom demo dataset
- **Deployment Target:** Firebase App Hosting (`apphosting.yaml`)

---

## 3. Project Structure

```text
telcodesk-ai/
├── public/
│   ├── icons/
│   │   └── logo.svg
│   └── images/
│       └── network-banner.svg
├── src/
│   ├── app/
│   │   ├── api/ai/
│   │   │   └── route.js            # POST /api/ai ('analyze' & 'chat' modes)
│   │   ├── globals.css             # Tailwind CSS & DaisyUI configuration
│   │   ├── layout.js               # Root application layout
│   │   └── page.js                 # Main multi-module workspace controller
│   ├── components/
│   │   ├── features/
│   │   │   ├── AIChat.jsx          # Bilingual AI Support Assistant
│   │   │   ├── Analytics.jsx       # Operator, category, sentiment & SLA analytics
│   │   │   ├── ComplaintAnalysis.jsx # AI diagnostic cards
│   │   │   ├── ComplaintForm.jsx   # Validated complaint submission & ticket generator
│   │   │   ├── ComplaintList.jsx   # Ticket ID & Mobile Number tracking view
│   │   │   ├── DashboardStats.jsx  # KPI overview & quick complaint submission
│   │   │   └── SupportDesk.jsx     # Support Agent Operations Console
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx # Responsive shell with mobile navigation
│   │   │   ├── Header.jsx          # Header with Customer/Agent demo switcher
│   │   │   └── Sidebar.jsx         # Telecom NOC sidebar & SLA meter
│   │   └── ui/
│   │       ├── EmptyState.jsx
│   │       ├── ErrorMessage.jsx
│   │       ├── Loading.jsx
│   │       └── StatusBadge.jsx
│   ├── config/
│   │   └── constants.js            # Operators, categories, statuses & demo data
│   ├── hooks/
│   │   ├── useComplaints.js        # localStorage CRUD, search, filter & stats hook
│   │   └── useAI.js                # Client hook for /api/ai requests
│   └── lib/
│       ├── groq.js                 # Server-side Groq helpers & validation
│       └── utils.js                # Ticket ID generator, form validator & stats engine
├── .env.local                      # Local server-side credentials (gitignored)
├── .env.local.example              # Environment template with placeholders
├── .gitignore
├── apphosting.yaml                 # Firebase App Hosting Cloud Run configuration
├── jsconfig.json
├── next.config.js
├── package.json
├── postcss.config.mjs
└── README.md
```

---

## 4. Local Setup & AI API Configuration

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure `.env.local`

Create or edit `.env.local` in the project root and configure your Groq API key:

```env
GROQ_API_KEY=your_actual_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

**Security Notes:**
- Credentials are read strictly on the server by `src/lib/groq.js` for both complaint analysis and chatbot replies.
- Never prefix the API key with `NEXT_PUBLIC_`.
- `.env.local` is listed in `.gitignore` and is never exposed to browser bundles. Restart `npm run dev` after changing it.

### Step 3: Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Step 4: Production Build

```bash
npm run build
npm run start
```

---

## 5. Firebase App Hosting Deployment

TelcoDesk AI includes `apphosting.yaml` pre-configured for **Firebase App Hosting** with the server-side Groq API credential. Static export is intentionally disabled so the provider key remains secure.

### Configuring AI Secrets in Firebase

1. Install the Firebase CLI and authenticate:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
2. Store the API key securely in Google Cloud Secret Manager via Firebase App Hosting:
   ```bash
   firebase apphosting:secrets:set GROQ_API_KEY
   ```
3. Grant your Firebase App Hosting backend access to the secret when prompted, or run:
   ```bash
   firebase apphosting:secrets:grantaccess GROQ_API_KEY --backend <your-backend-id>
   ```
4. `GROQ_MODEL` is configured in `apphosting.yaml`.
5. Connect your repository in the Firebase Console under **App Hosting** or deploy when ready.
