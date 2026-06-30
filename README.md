# 🚨 DeadlineAI — The Advanced Last-Minute Life Saver

An autonomous, AI-driven productivity ecosystem engineered to transition from passive, easy-to-ignore traditional alerts to active, time-critical, context-aware desktop notifications. Built exclusively for students, professionals, and creators to prevent missed commitments before they happen.

---

## 🚀 Core Value Proposition & Problem Solved

* **Beyond Passive Reminders:** Traditional calendar apps rely on static, easily dismissible notifications. DeadlineAI actively tracks operational boundaries using background telemetry to force accountability.
* **Frictionless Multimodal Ingestion:** Users don't waste time clicking form fields. Simply speak via the native **Voice Input System** or dump a chaotic unstructured schedule/timeline mess into the **AI Planner** to instantly map out the day.
* **Natural Language Completion Pipeline:** Solves broken UI/Database click events during high-stress operational windows by allowing instant, text-driven status updates (e.g., typing `"security done"` filters, archives, and clears tasks dynamically).

---

## 🤖 System Architecture & Technical Specifications

### 💻 Frontend & State Management
* **Core Framework:** React.js (Vite) paired with React Router for low-latency workspace routing.
* **Styling Engine:** Tailwind CSS providing a fluid, modern dark-themed dashboard optimized for extended productivity sessions.
* **State Persistence & Fallback:** Engineered an absolute lifecycle freeze using `sessionStorage` serialization to preserve user task states and avoid UI rendering freezes during network or server database mutations.

### 🧠 Multimodal AI Core (Gemini NLP)
* Deep prompt-driven Natural Language Processing (NLP) context extraction via Google Gemini API.
* Automatically processes unstructured prose or audio transcriptions into structured JSON telemetry:
```json
{
  "chatResponse": "Timeline parsed successfully.",
  "productivityScore": 85,
  "riskPercentage": 10,
  "todayTasks": [],
  "upcomingDeadlines": []
}
🕒 Background Telemetry & Notifications
Continuous Loop Evaluation: Active polling loops via client-side NotificationManager tracking synchronized time deltas.

Precision Notification Trigger: Desktop native Web Notifications API fired strictly on the exact 5-minute countdown boundary window using automated time-window tolerance matrices and deduplication guards to prevent repeating alert spam.

Smart Re-Notification Worker: Detects overdue, uncompleted high-priority tasks past their deadline and loops back aggressive reminder prompts every 60 seconds until resolved.

🎙️ Key Innovations Highlight
1. Natural Language Shorthand Input (Bypass Flow)
Instead of searching for tiny click checkboxes, type the keyword of the task followed by done directly into the input bar (e.g., "build done"). The state layer triggers a substring evaluation query across active items, maps the status update, and cleans the view instantly.

2. Multi-Modal Audio Extraction
Integrated browser-native Web Audio API recording layers (VoiceRecorder) to capture live human dictation, transmitting structured streams directly to our NLP architecture for hands-free timeline parsing.

📁 Repository Structure
Plaintext
.
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ index.html
├─ public/
│   ├─ logo.png
│   ├─ robot.png
│   ├─ favicon.ico
│   └─ manifest.json
├─ src/
│   ├─ App.jsx
│   ├─ main.jsx
│   ├─ index.css
│   ├─ styles/
│   │   ├─ global.css
│   │   └─ tailwind.css
│   ├─ assets/
│   │   ├─ animations/
│   │   ├─ fonts/
│   │   └─ icons/
│   ├─ context/
│   │   ├─ AuthContext.jsx
│   │   ├─ TaskContext.jsx
│   │   └─ ThemeContext.jsx
│   ├─ routes/
│   │   └─ AppRoutes.jsx
│   ├─ layouts/
│   │   ├─ MainLayout.jsx
│   │   ├─ AuthLayout.jsx
│   │   └─ sidebar.jsx
│   ├─ pages/
│   │   ├─ Dashboard/Dashboard.jsx
│   │   ├─ Tasks/Tasks.jsx
│   │   ├─ AIPlanner/AIPlanner.jsx
│   │   ├─ Calendar/Calendar.jsx
│   │   ├─ Analytics/Analytics.jsx
│   │   ├─ FocusMode/FocusMode.jsx
│   │   ├─ Habits/Habits.jsx
│   │   ├─ Profile/Profile.jsx
│   │   └─ Settings/Settings.jsx
│   ├─ components/
│   │   ├─ Sidebar/Sidebar.jsx
│   │   ├─ Navbar/Navbar.jsx
│   │   ├─ AddTaskForm/AddTaskForm.jsx
│   │   ├─ AIChat/index.jsx
│   │   ├─ Notification/index.jsx
│   │   ├─ Modal/index.jsx
│   │   ├─ VoiceRecorder/index.jsx
│   │   ├─ TaskCard/index.jsx
│   │   ├─ FocusTimer/index.jsx
│   │   └─ HabitTracker/index.jsx
│   ├─ hooks/
│   │   ├─ useAuth.js
│   │   ├─ useTasks.js
│   │   └─ useGemini.js
│   ├─ services/
│   │   ├─ firebase.js
│   │   ├─ auth.js
│   │   ├─ taskService.js
│   │   ├─ profileService.js
│   │   ├─ gemini.js
│   │   ├─ aiPlanner.js
│   │   ├─ calendarService.js
│   │   └─ notificationService.js
│   └─ utils/
│       ├─ constants.js
│       ├─ formatter.js
│       ├─ helper.js
│       └─ validator.js
├─ TODO.md
└─ README.md
🛠️ Installation & Local Setup
Clone the Project Repository:

Bash
git clone [https://github.com/HARINARAYAN-2027/Deadline.git](https://github.com/HARINARAYAN-2027/Deadline.git)
cd Deadline
Install Engineering Dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env file in the root directory and append your API endpoints:

Code snippet
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_GEMINI_API_KEY=your_gemini_key
Launch Local Development Server:

Bash
npm run dev
Developed for the Vibe2Ship CodingNinjas x Google for Developers Challenge.
