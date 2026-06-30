# DeadlineAI - Autonomous Productivity Ecosystem

DeadlineAI is an advanced, autonomous AI-driven productivity ecosystem engineered to transform unorganized daily schedules into structured, high-efficiency operational execution timelines. Built using React, Vite, and Tailwind CSS, the platform leverages the Google Gemini API to offer real-time natural language processing (NLP) and contextual data parsing.

## 🚀 Key Core Architectural Features:

1. **Autonomous AI Planner:** Converts raw, chaotic textual or voice inputs into precise, multi-layered calendar grids and task execution timelines with dynamically calculated productivity and risk metrics.
2. **Real-Time Telemetry & Notification Engine:** Features an automated background scheduler that matches system time against extracted task deadlines. Built via the native Web Notifications API, the system is fully operational and verified in local development environments (localhost) to push instant desktop alert sheets when a task boundary condition is met. *(Note: Production server push sync requires localized HTTPS service worker lifecycle stabilization).*
3. **Smart Command Shorthand Override:** Enables users to instantly manage and filter active pipelines via direct shorthand keyword inputs (e.g., 'hotfix done'), ensuring seamless UI performance and immediate cleanup of operational items.
4. **Fail-Safe Execution Fallbacks:** Integrates custom local storage persistence layers to ensure zero data-loss states across continuous browser sessions.
5. **Secure Authentication Matrix:** Implements fully integrated Firebase Google Authentication whitelisted over secure production server contexts.

---
### 📂 Project Structure

```text
Deadline/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── public/
│   ├── logo.png
│   ├── robot.png
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── styles/
│   │   ├── global.css
│   │   └── tailwind.css
│   ├── assets/
│   │   ├── animations/
│   │   ├── fonts/
│   │   └── icons/
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── TaskContext.jsx
│   │   └── ThemeContext.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── Tasks/
│   │   │   └── Tasks.jsx
│   │   ├── AIPlanner/
│   │   │   └── AIPlanner.jsx
│   │   ├── Calendar/
│   │   │   └── Calendar.jsx
│   │   ├── Analytics/
│   │   │   └── Analytics.jsx
│   │   ├── FocusMode/
│   │   │   └── FocusMode.jsx
│   │   ├── Habits/
│   │   │   └── Habits.jsx
│   │   ├── Profile/
│   │   │   └── Profile.jsx
│   │   └── Settings/
│   │       └── Settings.jsx
│   ├── components/
│   │   ├── Sidebar/
│   │   │   └── Sidebar.jsx
│   │   ├── Navbar/
│   │   │   └── Navbar.jsx
│   │   ├── AddTaskForm/
│   │   │   └── AddTaskForm.jsx
│   │   ├── AIChat/
│   │   │   └── index.jsx
│   │   ├── Notification/
│   │   │   └── index.jsx
│   │   ├── Modal/
│   │   │   └── index.jsx
│   │   ├── VoiceRecorder/
│   │   │   └── index.jsx
│   │   ├── TaskCard/
│   │   │   └── index.jsx
│   │   ├── FocusTimer/
│   │   │   └── index.jsx
│   │   └── HabitTracker/
│   │       └── index.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTasks.js
│   │   └── useGemini.js
│   ├── services/
│   │   ├── firebase.js
│   │   ├── auth.js
│   │   ├── taskService.js
│   │   ├── profileService.js
│   │   ├── gemini.js
│   │   ├── aiPlanner.js
│   │   ├── calendarService.js
│   │   └── notificationService.js
│   └── utils/
│       ├── constants.js
│       ├── formatter.js
│       ├── helper.js
│       └── validator.js
├── TODO.md
└── README.md
```

---

# 🚀 Installation & Local Setup

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/HARINARAYAN-2027/Deadline.git
cd Deadline
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file in the project root and add the following variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_GEMINI_API_KEY=your_gemini_key
```

Replace the placeholder values with your actual Firebase and Gemini API keys.

---

## 4️⃣ Start the Development Server

```bash
npm run dev
```

The application will start on the local development server. Open the URL displayed in your terminal (usually `http://localhost:5173`) in your browser.
### 🔗 [Live Production Link](https://deadline-ai-roan.vercel.app)
