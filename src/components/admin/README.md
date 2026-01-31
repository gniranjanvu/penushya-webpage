# Admin Components Documentation

This directory contains the admin section components for the Penushya webpage.

## Components

### 1. AdminLogin (`src/pages/AdminLogin.tsx`)

A beautiful, glassmorphism-styled login page for admin authentication.

#### Features
- ✨ Glassmorphism design with backdrop blur effects
- 🔐 Email/Username and Password inputs with validation
- 👁️ Password visibility toggle
- ✅ "Remember me" checkbox
- 🔗 "Forgot Password?" link (placeholder)
- 🔄 Loading states during authentication
- 🎯 Form validation using react-hook-form
- 🔑 Supabase authentication integration
- 📱 Fully responsive design
- 🌓 Dark mode support
- 🔔 Toast notifications for errors/success
- ➡️ Auto-redirect to dashboard on successful login

#### Default Credentials
- **Username:** harekrishna
- **Password:** HareKrishna@07

#### Usage Example
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminLogin } from './pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}
```

---

### 2. AdminLayout (`src/components/admin/AdminLayout.tsx`)

A complete admin dashboard layout with sidebar navigation, top bar, and content area.

#### Features
- 📊 Full-featured admin dashboard layout
- 🎨 Modern, professional UI design
- 📱 Fully responsive (mobile drawer, desktop sidebar)
- 🌓 Dark mode support with theme toggle
- 🧭 Sidebar navigation with 12 menu items:
  - Dashboard
  - Experiences
  - Education
  - Projects
  - Skills
  - Certifications
  - Achievements
  - Publications
  - Resume
  - Messages
  - Subscribers
  - Settings
- ✨ Active route highlighting
- 🍞 Breadcrumb navigation
- 👤 Admin profile dropdown
- 🚪 Logout functionality
- 🔄 Smooth transitions and animations
- 📍 Uses React Router's `Outlet` for nested routes

#### Usage Example
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './pages';
import { AdminLayout } from './components/admin';

// Example dashboard component
const Dashboard = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Dashboard
    </h1>
    <p className="text-gray-600 dark:text-gray-400">
      Welcome to the admin dashboard!
    </p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="experiences" element={<div>Experiences</div>} />
          <Route path="education" element={<div>Education</div>} />
          <Route path="projects" element={<div>Projects</div>} />
          <Route path="skills" element={<div>Skills</div>} />
          <Route path="certifications" element={<div>Certifications</div>} />
          <Route path="achievements" element={<div>Achievements</div>} />
          <Route path="publications" element={<div>Publications</div>} />
          <Route path="resume" element={<div>Resume</div>} />
          <Route path="messages" element={<div>Messages</div>} />
          <Route path="subscribers" element={<div>Subscribers</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Complete Integration Example

Here's a complete example of how to integrate both components with routing and theme support:

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          theme="colored"
        />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
```

```tsx
// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './pages';
import { AdminLayout } from './components/admin';

// Example admin pages
const Dashboard = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Total Projects</h3>
        <p className="text-3xl font-bold text-blue-600">24</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Messages</h3>
        <p className="text-3xl font-bold text-green-600">12</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Subscribers</h3>
        <p className="text-3xl font-bold text-purple-600">156</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<div>Home Page</div>} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="experiences" element={<div>Experiences Management</div>} />
        <Route path="education" element={<div>Education Management</div>} />
        <Route path="projects" element={<div>Projects Management</div>} />
        <Route path="skills" element={<div>Skills Management</div>} />
        <Route path="certifications" element={<div>Certifications Management</div>} />
        <Route path="achievements" element={<div>Achievements Management</div>} />
        <Route path="publications" element={<div>Publications Management</div>} />
        <Route path="resume" element={<div>Resume Management</div>} />
        <Route path="messages" element={<div>Messages</div>} />
        <Route path="subscribers" element={<div>Subscribers</div>} />
        <Route path="settings" element={<div>Settings</div>} />
      </Route>
    </Routes>
  );
}

export default App;
```

---

## Required Dependencies

Make sure these packages are installed:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.93.3",
    "lucide-react": "^0.563.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.71.1",
    "react-router-dom": "^7.13.0",
    "react-toastify": "^11.0.5",
    "tailwindcss": "^4.1.18"
  }
}
```

---

## Supabase Setup

Ensure you have a Supabase client configured in `src/lib/supabase.ts`:

```tsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Theme Context

The components use a ThemeContext for dark mode support. Ensure you have `src/context/ThemeContext.tsx` set up.

---

## Styling

The components use Tailwind CSS with dark mode support. Make sure your `tailwind.config.js` has dark mode enabled:

```js
module.exports = {
  darkMode: 'class',
  // ... rest of config
}
```

---

## Icons

All icons are from [Lucide React](https://lucide.dev/). The following icons are used:

**AdminLogin:**
- Lock
- Mail
- Eye
- EyeOff

**AdminLayout:**
- LayoutDashboard
- Briefcase
- GraduationCap
- Code
- Star
- Award
- Trophy
- BookOpen
- FileText
- Mail
- Users
- Settings
- Menu
- X
- ChevronRight
- LogOut
- User
- Moon
- Sun

---

## Authentication Flow

1. User navigates to `/admin/login`
2. Enters credentials (default: harekrishna / HareKrishna@07)
3. Form validates input using react-hook-form
4. Credentials are sent to Supabase via `signInWithPassword()`
5. On success: Toast notification + redirect to `/admin/dashboard`
6. On error: Toast notification with error message
7. User can logout from the profile dropdown in AdminLayout

---

## Mobile Responsiveness

- **Desktop (≥1024px):** Fixed sidebar on left, content on right
- **Mobile (<1024px):** Collapsible drawer sidebar with hamburger menu
- Touch-friendly UI elements
- Responsive spacing and typography

---

## Customization

### Changing Menu Items

Edit the `menuItems` array in `AdminLayout.tsx`:

```tsx
const menuItems: MenuItem[] = [
  {
    id: 'custom',
    label: 'Custom Page',
    icon: <CustomIcon className="w-5 h-5" />,
    path: '/admin/custom',
  },
  // ... other items
];
```

### Styling

All components use Tailwind CSS classes. Modify the className attributes to customize the appearance.

### Authentication

Update the `onSubmit` function in `AdminLogin.tsx` to change authentication logic.

---

## Notes

- The components are fully TypeScript typed
- All form inputs have proper validation
- Loading states prevent double submissions
- Toast notifications provide user feedback
- Dark mode is persistent (saved to localStorage)
- Breadcrumbs automatically update based on current route
