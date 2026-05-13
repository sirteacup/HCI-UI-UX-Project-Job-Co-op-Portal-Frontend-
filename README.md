# TMU Co-op Portal — HCI Prototype

A high-fidelity interactive prototype of a redesigned co-op job portal for Toronto Metropolitan University students, built for **CPS 613 / CP 8205 (Human-Computer Interaction) — Assignment 4**.

## Project Overview

This prototype evaluates three core co-op workflows identified through a prior cognitive walkthrough:

| Workflow | Description |
|---|---|
| Job Search | Live multi-filter job board with work authorization eligibility badges and urgency highlighting |
| Application Submission | Guided 3-step wizard (resume → cover letter → review) with document preview and confirmation screen |
| Document Management | Drag-and-drop upload, version tagging, tabbed filtering, and delete confirmation |

All data is simulated client-side. No backend or authentication is required — the app opens directly on the Dashboard.

## Tech Stack

- **React 18** — component framework
- **Vite** — dev server and build tool
- **React Router v6** — client-side routing
- **CSS Modules** — scoped component styling, no utility framework
- **Lucide React** — icon set
- **useReducer + Context API** — global state management

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation and Run

```bash
# 1. Navigate into the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Other Commands

```bash
# Build for production
npm run build

# Preview the production build
npm run preview

# Run the linter
npm run lint
```

## Project Structure

```
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Badge, Button, Modal, StepIndicator, Tag, Toast
│   │   │   └── Layout/       # AppShell, Sidebar
│   │   ├── context/          # AppContext — useReducer global state
│   │   ├── data/             # fakeData.js — simulated job listings and documents
│   │   ├── pages/            # Dashboard, JobSearch, JobDetail, ApplicationForm,
│   │   │                     # DocumentLibrary, MyApplications
│   │   ├── css/              # Global styles
│   │   ├── App.jsx           # Route definitions
│   │   └── main.jsx          # Entry point
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── prototype_approach_report.txt   # Design rationale and tool justification
├── reflection.txt                  # Team contribution summary
└── README.md
```

## Team

| Member | Contribution |
|---|---|
| Ajmain Hyder | Shared UI component library (Badge, Button, Modal, StepIndicator, Tag, Toast) |
| Ansh Rai | AppShell, Sidebar, JobSearch page, JobDetail page |
| Arshdeep Sandhu | ApplicationForm, DocumentLibrary, MyApplications, AppContext state layer |
| Zaiyan Nazmul | Dashboard, written report, video presentation |
