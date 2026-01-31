import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Code,
  Mail,
  Users,
  Star,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getAllMessages } from '../../lib/api';
import type { Message } from '../../types';

interface DashboardStats {
  totalProjects: number;
  totalMessages: number;
  unreadMessages: number;
  totalSubscribers: number;
  totalSkills: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalSubscribers: 0,
    totalSkills: 0,
  });
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user info
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.name) {
        setAdminName(user.user_metadata.name);
      }

      // Fetch all stats in parallel
      const [projectsData, messagesData, subscribersData, skillsData, messages] = 
        await Promise.all([
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('messages').select('id, is_read', { count: 'exact' }),
          supabase.from('subscribers').select('id', { count: 'exact', head: true }),
          supabase.from('skills').select('id', { count: 'exact', head: true }),
          getAllMessages(),
        ]);

      // Calculate stats
      const totalMessages = messagesData.count || 0;
      const unreadMessages = messagesData.data?.filter((m: any) => !m.is_read).length || 0;

      setStats({
        totalProjects: projectsData.count || 0,
        totalMessages,
        unreadMessages,
        totalSubscribers: subscribersData.count || 0,
        totalSkills: skillsData.count || 0,
      });

      // Get recent messages (top 5)
      setRecentMessages(messages.slice(0, 5));

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    count: number;
    icon: React.ReactNode;
    trend?: string;
    bgGradient: string;
    iconColor: string;
  }> = ({ title, count, icon, trend, bgGradient, iconColor }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {loading ? '...' : count}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl ${bgGradient} flex items-center justify-center`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {adminName}! 👋
        </h1>
        <p className="text-blue-100 dark:text-blue-200">
          Here's what's happening with your portfolio today.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          count={stats.totalProjects}
          icon={<Code className="w-7 h-7" />}
          bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
          iconColor="text-white"
        />
        <StatCard
          title="Messages"
          count={stats.totalMessages}
          icon={<Mail className="w-7 h-7" />}
          trend={stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : undefined}
          bgGradient="bg-gradient-to-br from-purple-500 to-purple-600"
          iconColor="text-white"
        />
        <StatCard
          title="Subscribers"
          count={stats.totalSubscribers}
          icon={<Users className="w-7 h-7" />}
          bgGradient="bg-gradient-to-br from-green-500 to-green-600"
          iconColor="text-white"
        />
        <StatCard
          title="Skills"
          count={stats.totalSkills}
          icon={<Star className="w-7 h-7" />}
          bgGradient="bg-gradient-to-br from-orange-500 to-orange-600"
          iconColor="text-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Messages
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {message.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {message.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {message.email}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {message.message}
                      </p>
                      {!message.is_read && (
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
                          Unread
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <Link
                  to="/admin/messages"
                  className="flex items-center justify-center gap-2 py-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  View All Messages
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
          </div>
          <div className="p-6 space-y-3">
            <Link
              to="/admin/projects"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Add Project</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create new project</p>
              </div>
            </Link>

            <Link
              to="/admin/experiences"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Add Experience</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create new experience</p>
              </div>
            </Link>

            <Link
              to="/admin/messages"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                <Mail className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">View Messages</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : 'No new messages'}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
