# TMU Co-op Portal: HCI Prototype

A high-fidelity interactive prototype of a redesigned co-op job portal for Toronto Metropolitan University students, built for **CPS 613 / CP 8205 (Human-Computer Interaction), Assignment 4**.

## Project Overview

This prototype evaluates three core co-op workflows identified through a prior cognitive walkthrough:

| Workflow | Description |
|---|---|
| Job Search | Live multi-filter job board with work authorization eligibility badges and urgency highlighting |
| Application Submission | Guided 3-step wizard (resume, cover letter, review) with document preview and confirmation screen |
| Document Management | Drag-and-drop upload, version tagging, tabbed filtering, and delete confirmation |

All data is simulated client-side. No backend or authentication is required. The app opens directly on the Dashboard.

## Tech Stack

- **React 18** component framework
- **Vite** dev server and build tool
- **React Router v6** client-side routing
- **CSS Modules** scoped component styling, no utility framework
- **Lucide React** icon set
- **useReducer + Context API** global state management

## Demo

A screen recording of the prototype walkthrough is included in the repository as `demo.mp4`. It covers all three evaluated workflows: job search and filtering, the 3-step application submission, and document library management.

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
