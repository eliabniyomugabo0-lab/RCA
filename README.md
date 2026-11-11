# GCS Operations Hub — Gahanga Cricket Stadium (Kigali, Rwanda)

A modern, production-grade stadium operations management system designed for Gahanga Cricket Stadium in Kigali, Rwanda. The application coordinates groundskeeping deliverables, multi-pitch maintenance cycles, international tournament fixture schedules, inventory control, and multi-role operations.

---

## 🚀 Quick Start (Running Locally)

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher (recommended: Node.js 20+ LTS)
- **npm**: `v9.0.0` or higher (comes with Node.js)

Verify your Node version:
```bash
node -v
npm -v
```

---

### 2. Installation
Extract the project archive or clone the repository, open a terminal in the project root directory, and install dependencies:

```bash
npm install
```

*Note: All dependencies including React 19, `@tailwindcss/vite`, `recharts`, `lucide-react`, and `react-is` are configured in `package.json` and pre-optimized in `vite.config.ts`.*

---

### 3. Start Development Server
Run the local Vite development server:

```bash
npm run dev
```

The app will be available at:
👉 **`http://localhost:3000`** (or the port specified by Vite in the terminal).

---

### 4. Build for Production
To generate an optimized production bundle:

```bash
npm run build
```

The compiled assets will be output to the `dist/` directory.

---

### 5. Preview Production Build
To test and preview the production build locally:

```bash
npm run preview
```

---

### 6. TypeScript Validation / Linting
To run static type checking:

```bash
npm run lint
```

---

## 🌟 Core Features Included

1. **Task & Workflow Management (`TaskManager`)**:
   - **Kanban Board with Drag & Drop**: Fluid status transitions between columns (`Assigned` ➔ `In Progress` ➔ `Submitted` ➔ `Revision Requested` ➔ `Approved`).
   - **Separation of Duties**: Built-in verification preventing assignees from self-approving their own submitted reports without supervisor/manager sign-off.
   - **View Switcher**: Instant toggle between Kanban Board and Tabular Grid views.
   - **Accessible Action Controls**: "Move to..." dropdown on every card for touch and keyboard navigation.

2. **Stadium & Fixture Calendar (`StadiumCalendar`)**:
   - **Three Views**: Month grid with interactive day-add shortcuts, Week timeline, and Chronological Agenda sorted earliest/latest.
   - **Classification Filters**: Matches, Pitch & Turf Preparation, Training Clinics, VIP Events, and Stores Audits.
   - **Export & Sync**: Download `.ics` (RFC 5545 standard) for Apple/Outlook/Google Calendar, plus direct Google Calendar web links.
   - **Global Search Integration**: Fixtures and events are indexed into the Global Command Bar (`Cmd/Ctrl + K`).

3. **Multi-Language Support (English, Kinyarwanda & French)**:
   - **Native React i18n Engine**: Zero-latency offline translation across all menus, buttons, status badges, and modules.
   - **Integrated Google Translate (GTranslate)**: Automatic synchronization with Google Translate for full-page machine auto-translation.
   - **Language Switcher**: Flag dropdown (🇬🇧 English, 🇷🇼 Ikinyarwanda, 🇫🇷 Français) in both the top header and the public landing page.

4. **Multi-Role Persona Matrix**:
   - Test perspective switcher between:
     - Cricket Operations Manager (*Hagenimana Damascene*)
     - Director / Supervisor (*Claire Uwase*)
     - Head Storekeeper (*Mugisha Emmanuel*)
     - Ground Operations Staff (*Jean-Claude Bizimana*)
     - System Administrator (*Eric Ndahiro*)

5. **5 Operational Color Palettes**:
   - Midnight Slate (Classic Tournament Navy)
   - Pitch Turf (Gahanga Grass Green)
   - Obsidian OLED (Minimal Deep Charcoal)
   - Indigo Dusk (Twilight Blue)
   - Daylight Match (Executive Clean Light)

---

## 📁 Project Structure

```
├── dist/                      # Production build output
├── src/
│   ├── assets/                # Stadium photography & avatars
│   ├── components/
│   │   ├── audit/             # Immutable audit trail & compliance ledger
│   │   ├── calendar/          # Stadium & fixture calendar with .ics export
│   │   ├── common/            # Reusable modals, toast notifications
│   │   ├── communication/     # Operations bulletins & direct messaging
│   │   ├── directory/         # Team & staff directory
│   │   ├── inventory/         # Store inventory & stock movement logs
│   │   ├── landing/           # Public welcome landing page
│   │   ├── layout/            # Navbar, Sidebar, Global Search (Cmd+K), Language Switcher
│   │   ├── profile/           # User profile modal
│   │   ├── roles/             # RBAC role matrix
│   │   ├── stadium/           # Oval inspection, turf moisture & facility overview
│   │   ├── tasks/             # Kanban board with Drag-and-Drop & report sign-offs
│   │   └── workspace/         # Role-tailored dashboards
│   ├── data/                  # Seeded stadium operational records
│   ├── i18n/                  # LanguageContext & translations (EN, RW, FR)
│   ├── types/                 # TypeScript interfaces and data models
│   ├── utils/                 # Storage, calendar export, and date utilities
│   ├── App.tsx                # Master state controller
│   ├── index.css              # Global styles & Tailwind theme overrides
│   └── main.tsx               # App root with LanguageProvider
├── index.html                 # HTML entry point with GTranslate support
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript compiler settings
└── vite.config.ts             # Vite build configuration with React & Tailwind plugins
```

---

## 🛠️ Troubleshooting Local Setup

- **Port in Use**: If port 3000 is occupied on your computer, run:
  ```bash
  npm run dev -- --port 3001
  ```
- **Clear Vite Cache**: If you experience cached module warnings, run:
  ```bash
  rm -rf node_modules/.vite
  npm run dev
  ```
- **Node Version Compatibility**: If you see unsupported engine warnings, ensure you are using Node.js 18 or 20 (`node -v`).
