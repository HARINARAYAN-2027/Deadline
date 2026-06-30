# 📂 Project Structure

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

## 1️⃣ Clone the Repository

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
