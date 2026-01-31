import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Code,
  Star,
  Award,
  Trophy,
  BookOpen,
  FileText,
  Mail,
  Users,
  Settings,
  Menu,
  X,
  ChevronRight,
  LogOut,
  User,
  Moon,
  Sun,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/admin/dashboard',
  },
  {
    id: 'experiences',
    label: 'Experiences',
    icon: <Briefcase className="w-5 h-5" />,
    path: '/admin/experiences',
  },
  {
    id: 'education',
    label: 'Education',
    icon: <GraduationCap className="w-5 h-5" />,
    path: '/admin/education',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <Code className="w-5 h-5" />,
    path: '/admin/projects',
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: <Star className="w-5 h-5" />,
    path: '/admin/skills',
  },
  {
    id: 'certifications',
    label: 'Certifications',
    icon: <Award className="w-5 h-5" />,
    path: '/admin/certifications',
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: <Trophy className="w-5 h-5" />,
    path: '/admin/achievements',
  },
  {
    id: 'publications',
    label: 'Publications',
    icon: <BookOpen className="w-5 h-5" />,
    path: '/admin/publications',
  },
  {
    id: 'resume',
    label: 'Resume',
    icon: <FileText className="w-5 h-5" />,
    path: '/admin/resume',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: <Mail className="w-5 h-5" />,
    path: '/admin/messages',
  },
  {
    id: 'subscribers',
    label: 'Subscribers',
    icon: <Users className="w-5 h-5" />,
    path: '/admin/subscribers',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    path: '/admin/settings',
  },
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    return segments.map((segment, index) => {
      const isLast = index === segments.length - 1;
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      return { label, href, isLast };
    });
  };

  const breadcrumbs = getBreadcrumb();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const Sidebar = ({ isMobile = false }) => (
    <aside
      className={`${
        isMobile
          ? 'fixed inset-0 z-50 lg:hidden'
          : 'hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:w-64'
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
    >
      {/* Mobile Overlay */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`${
          isMobile ? 'relative w-64 h-full' : 'h-full'
        } bg-white dark:bg-gray-800 flex flex-col`}
      >
        {/* Logo & Close Button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Admin Panel
          </h2>
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = isActiveRoute(item.path);
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span className={isActive ? 'text-blue-600 dark:text-blue-400' : ''}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                admin@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      {isSidebarOpen && <Sidebar isMobile />}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left Section: Menu Button & Breadcrumb */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Breadcrumb */}
              <nav className="hidden sm:flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    {crumb.isLast ? (
                      <span className="text-gray-900 dark:text-white font-medium">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        to={crumb.href}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>

            {/* Right Section: Theme Toggle & Profile */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Admin User
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          admin@example.com
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
