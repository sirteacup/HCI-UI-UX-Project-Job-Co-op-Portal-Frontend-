# TMU Co-op Portal — Frontend

High-fidelity interactive prototype of a redesigned co-op job portal for Toronto Metropolitan University students, built as part of **CPS 613 / CP 8205 — Human-Computer Interaction**.

## Overview

This prototype was developed to evaluate three core co-op workflows identified during a cognitive walkthrough (A3):

- **Job Search** — live multi-filter job board with work authorization eligibility
- **Application Submission** — guided 3-step wizard with document selection and confirmation
- **Document Management** — drag-and-drop upload, version tagging, and library browsing

## Tech Stack

- React 18 + Vite
- React Router v6
- CSS Modules (no utility framework)
- Lucide React (icons)
- useReducer + Context API (global state)

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Project Structure

```
src/
  components/
    common/       # Shared primitives: Badge, Button, Modal, StepIndicator, Tag, Toast
    Layout/       # AppShell, Sidebar
  context/        # AppContext — useReducer state layer
  data/           # fakeData.js — hardcoded job listings and documents
  pages/          # Dashboard, JobSearch, JobDetail, ApplicationForm, DocumentLibrary, MyApplications
  css/            # Global styles
```

## Notes

All data is simulated client-side. No backend or authentication is implemented. The prototype starts directly on the Dashboard.
