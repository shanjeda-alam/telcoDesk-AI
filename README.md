# TelcoDesk AI — AI-Powered Telecom Complaint Management System

> **Smarter Complaints. Faster Solutions. Better Connectivity.**

**TelcoDesk AI** is a full-stack, bilingual (**English & বাংলা**) telecom customer complaint management and Network Operations Center (NOC) triage platform built with **Next.js (App Router)**, **React**, **Tailwind CSS**, **DaisyUI**, and the official **Google Gemini SDK (`@google/genai`)**.

---

## 1. Key Modules & Features

1. **Executive Overview Dashboard (`DashboardStats.jsx`)**
   - Live metrics computed from actual complaint records: Total, Open (`Submitted` + `Under Review`), `In Progress`, and `Resolved` complaints.
   - Complaint category breakdown, AI priority distribution, recent complaints table, and an inline Quick Complaint Submission panel.
2. **Submit Complaint (`ComplaintForm.jsx`)**
   - Validated telecom complaint form supporting **Grameenphone**, **Robi**, **Banglalink**, **Teletalk**, and **Other**.
   - Covers 8 telecom issue categories: *Internet Connectivity, Network Coverage, Call Drop, SIM Card Problem, Recharge Problem, Billing Issue, SMS Problem, Other*.
   - Generates sequential unique Ticket IDs (`TEL-2026-0001`, `TEL-2026-0002`, etc.).
   - Offline/API fallback resilience: If the Gemini API is unconfigured or unreachable, customer complaints are still safely saved to `localStorage` and can be analyzed later on demand.
3. **Gemini AI Complaint Analyzer (`ComplaintAnalysis.jsx`)**
   - Uses structured JSON output from Google Gemini to return:
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
   - Interactive bilingual (English & বাংলা) telecom troubleshooting chatbot powered by Google Gemini.
   - Includes suggested telecom questions, session conversation history, loading states, error recovery, and chat reset.

---

## 2. Technology Stack

- **Frontend:** Next.js 15 (App Router), React 19, JavaScript (ES2024+, zero TypeScript), Tailwind CSS v4, DaisyUI v5
- **Backend:** Next.js Server-Side API Routes (`POST /api/gemini`)
- **AI Engine:** Official Google Gen AI SDK (`@google/genai`)
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
│   │   ├── api/gemini/
│   │   │   └── route.js            # POST /api/gemini ('analyze' & 'chat' modes)
│   │   ├── globals.css             # Tailwind CSS & DaisyUI configuration
│   │   ├── layout.js               # Root application layout
│   │   └── page.js                 # Main multi-module workspace controller
│   ├── components/
│   │   ├── features/
│   │   │   ├── AIChat.jsx          # Bilingual AI Support Assistant
│   │   │   ├── Analytics.jsx       # Operator, category, sentiment & SLA analytics
│   │   │   ├── ComplaintAnalysis.jsx # Gemini AI diagnostic cards
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
│   │   └── useGemini.js            # Client hook for /api/gemini requests
│   └── lib/
│       ├── gemini.js               # Server-side @google/genai helper & validation
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

## 4. Local Setup & Gemini API Configuration

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure `.env.local`

Edit `.env.local` in the root directory (or copy from `.env.local.example`) and provide your Google Gemini API key and model ID:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite
```

**Security Notes:**
- Credentials are read **strictly on the server** via `process.env.GEMINI_API_KEY` and `process.env.GEMINI_MODEL` inside `src/lib/gemini.js`.
- Never use `NEXT_PUBLIC_GEMINI_API_KEY`.
- `.env.local` is listed in `.gitignore` and is never exposed to browser bundles.

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

TelcoDesk AI includes `apphosting.yaml` pre-configured for **Firebase App Hosting** with full support for Next.js server-side API routes (`POST /api/gemini`). Static export is intentionally disabled so server-side Gemini routes remain secure.

### Configuring Gemini Secrets in Firebase

1. Install the Firebase CLI and authenticate:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
2. Store your `GEMINI_API_KEY` securely in Google Cloud Secret Manager via Firebase App Hosting:
   ```bash
   firebase apphosting:secrets:set GEMINI_API_KEY
   ```
3. Grant your Firebase App Hosting backend access to the secret when prompted, or run:
   ```bash
   firebase apphosting:secrets:grantaccess GEMINI_API_KEY --backend <your-backend-id>
   ```
4. Verify `GEMINI_MODEL` in `apphosting.yaml` matches your desired Gemini model (default: `gemini-3.1-flash-lite`).
5. Connect your repository in the Firebase Console under **App Hosting** or deploy when ready.
