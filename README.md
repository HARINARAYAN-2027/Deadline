# 🚨 DeadlineAI - The Advanced Last-Minute Life Saver

An autonomous, AI-driven productivity ecosystem engineered to transition from passive, easy-to-ignore traditional alerts to active, time-critical context-aware desktop notifications. Built exclusively for students, professionals, and creators to prevent missed commitments before they happen.

## 🚀 Core Value Proposition & Problem Solved
* **Beyond Passive Reminders:** Traditional systems rely on static calendars that users easily dismiss. DeadlineAI monitors tasks autonomously using headless tracking.
* **100% Autonomous AI Ingestion:** Eliminated manual friction entirely. Users simply speak or dump raw timeline data into the AI Planner.

## 🤖 System Architecture & Technical Specifications
* **Frontend Architecture:** React.js (Vite) with React Router for workspace routing; Tailwind CSS for fluid, state-synchronized dashboard UX.
* **AI Processing Model:** Deep prompt-driven NLP context extraction (Gemini) to generate structured JSON containing chatResponse, productivityScore, riskPercentage, todayTasks, and upcomingDeadlines.
* **Background Worker Telemetry:** Continuous client-side deadline evaluation loop via `NotificationManager` with permission-gated notification readiness.
* **Precision Notification Trigger:** Desktop native notifications triggered on the **exact 5-minute countdown boundary window** using a time-window tolerance and deduplication guards to prevent repeated spam.

## 📁 Repository Structure
```txt
.
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ index.html
├─ public/
│  ├─ logo.png
│  ├─ robot.png
│  ├─ favicon.ico
│  └─ manifest.json
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ index.css
│  ├─ styles/
│  │  ├─ global.css
│  │  └─ tailwind.css
│  ├─ assets/
│  │  ├─ animations/
│  │  ├─ fonts/
│  │  └─ icons/
│  ├─ context/
│  │  ├─ AuthContext.jsx
│  │  ├─ TaskContext.jsx
│  │  └─ ThemeContext.jsx
│  ├─ routes/
│  │  └─ AppRoutes.jsx
│  ├─ layouts/
│  │  ├─ MainLayout.jsx
│  │  ├─ AuthLayout.jsx
│  │  └─ sidebar.jsx
│  ├─ pages/
│  │  ├─ Dashboard/Dashboard.jsx
│  │  ├─ Tasks/Tasks.jsx
│  │  ├─ AIPlanner/AIPlanner.jsx
│  │  ├─ Calendar/Calendar.jsx
│  │  ├─ Analytics/Analytics.jsx
│  │  ├─ FocusMode/FocusMode.jsx
│  │  ├─ Habits/Habits.jsx
│  │  ├─ Profile/Profile.jsx
│  │  └─ Settings/Settings.jsx
│  ├─ components/
│  │  ├─ Sidebar/Sidebar.jsx
│  │  ├─ Navbar/Navbar.jsx
│  │  ├─ AddTaskForm/AddTaskForm.jsx
│  │  ├─ AIChat/index.jsx
│  │  ├─ Notification/index.jsx
│  │  ├─ Modal/index.jsx
│  │  ├─ VoiceRecorder/index.jsx
│  │  ├─ TaskCard/index.jsx
│  │  ├─ FocusTimer/index.jsx
│  │  └─ HabitTracker/index.jsx
│  ├─ hooks/
│  │  ├─ useAuth.js
│  │  ├─ useTasks.js
│  │  └─ useGemini.js
│  ├─ services/
│  │  ├─ firebase.js
│  │  ├─ auth.js
│  │  ├─ taskService.js
│  │  ├─ profileService.js
│  │  ├─ gemini.js
│  │  ├─ aiPlanner.js
│  │  ├─ calendarService.js
│  │  └─ notificationService.js
│  └─ utils/
│     ├─ constants.js
│     ├─ formatter.js
│     ├─ helper.js
│     └─ validator.js
├─ TODO.md
└─ README.md (this file)
