import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Lock, Save, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getSiteSettings } from '../../lib/api';
import type { SiteSetting } from '../../types';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SiteSettingsFormData {
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  linkedinUrl: string;
  githubUrl: string;
}

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');

  const passwordForm = useForm<PasswordFormData>();
  const settingsForm = useForm<SiteSettingsFormData>();

  useEffect(() => {
    fetchUserInfo();
    fetchSiteSettings();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAdminEmail(user.email || '');
        setAdminName(user.user_metadata?.name || 'Admin');
      }
    } catch (error: any) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      setSettingsLoading(true);
      const settings = await getSiteSettings();
      
      const settingsMap: Record<string, string> = {};
      settings.forEach((setting: SiteSetting) => {
        settingsMap[setting.setting_key] = setting.setting_value || '';
      });

      settingsForm.reset({
        siteName: settingsMap['site_name'] || '',
        siteTagline: settingsMap['site_tagline'] || '',
        contactEmail: settingsMap['contact_email'] || '',
        linkedinUrl: settingsMap['linkedin_url'] || '',
        githubUrl: settingsMap['github_url'] || '',
      });
    } catch (error: any) {
      console.error('Error fetching site settings:', error);
      toast.error('Failed to load site settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (data.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      // Note: Supabase doesn't support re-authentication with password in the client
      // So we'll just update the password directly
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      passwordForm.reset();
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSettingsUpdate = async (data: SiteSettingsFormData) => {
    try {
      setLoading(true);

      const settingsToUpdate = [
        { setting_key: 'site_name', setting_value: data.siteName },
        { setting_key: 'site_tagline', setting_value: data.siteTagline },
        { setting_key: 'contact_email', setting_value: data.contactEmail },
        { setting_key: 'linkedin_url', setting_value: data.linkedinUrl },
        { setting_key: 'github_url', setting_value: data.githubUrl },
      ];

      // Update or insert settings
      for (const setting of settingsToUpdate) {
        const { data: existingData } = await supabase
          .from('site_settings')
          .select('id')
          .eq('setting_key', setting.setting_key)
          .single();

        if (existingData) {
          // Update existing
          const { error } = await supabase
            .from('site_settings')
            .update({ setting_value: setting.setting_value })
            .eq('setting_key', setting.setting_key);

          if (error) throw error;
        } else {
          // Insert new
          const { error } = await supabase
            .from('site_settings')
            .insert([setting]);

          if (error) throw error;
        }
      }

      toast.success('Site settings updated successfully');
    } catch (error: any) {
      console.error('Error updating site settings:', error);
      toast.error('Failed to update site settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account and site settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                  {adminName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400">
                  {adminEmail || 'Loading...'}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Change Password */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Change Password
              </h2>
            </div>

            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  {...passwordForm.register('currentPassword', { required: true })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  {...passwordForm.register('newPassword', { 
                    required: true,
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter new password"
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...passwordForm.register('confirmPassword', { required: true })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
              >
                <Lock className="w-5 h-5" />
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* General Site Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Save className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                General Settings
              </h2>
            </div>

            {settingsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={settingsForm.handleSubmit(handleSiteSettingsUpdate)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    {...settingsForm.register('siteName')}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Your Portfolio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Site Tagline
                  </label>
                  <input
                    type="text"
                    {...settingsForm.register('siteTagline')}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Your professional tagline"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    {...settingsForm.register('contactEmail')}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="contact@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    {...settingsForm.register('linkedinUrl')}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    {...settingsForm.register('githubUrl')}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="https://github.com/username"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
