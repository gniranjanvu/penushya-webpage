import { supabase, isSupabaseConfigured } from './supabase';
import type {
  Experience,
  Education,
  Project,
  Skill,
  Certification,
  Achievement,
  Publication,
  Message,
  Subscriber,
  Resume,
  SiteSetting,
  ContactFormData,
  SubscribeFormData,
  ProjectImage,
  ProjectVideo,
  ProjectButton,
} from '../types';

// Helper to check if Supabase is available
const checkSupabase = () => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase is not configured. Using mock data.');
    return false;
  }
  return true;
};

// Experiences
export const getExperiences = async (): Promise<Experience[]> => {
  if (!checkSupabase()) return [];
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
};

// Education
export const getEducation = async (): Promise<Education[]> => {
  if (!checkSupabase()) return [];
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
};

// Projects
export const getProjects = async (featured?: boolean): Promise<Project[]> => {
  if (!checkSupabase()) return [];
  let query = supabase.from('projects').select('*').eq('is_published', true);
  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }
  const { data, error } = await query.order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  if (!checkSupabase()) return null;
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const getProjectImages = async (projectId: string): Promise<ProjectImage[]> => {
  if (!checkSupabase()) return [];
  const { data, error } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const getProjectVideos = async (projectId: string): Promise<ProjectVideo[]> => {
  if (!checkSupabase()) return [];
  const { data, error } = await supabase
    .from('project_videos')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const getProjectButtons = async (projectId: string): Promise<ProjectButton[]> => {
  if (!checkSupabase()) return [];
  const { data, error } = await supabase
    .from('project_buttons')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
};

// Skills
export const getSkills = async (): Promise<Skill[]> => {
  if (!checkSupabase()) return [];
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
};

// Certifications
export const getCertifications = async (): Promise<Certification[]> => {
  if (!checkSupabase()) return [];
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
};

// Achievements
export const getAchievements = async (): Promise<Achievement[]> => {
  if (!checkSupabase()) return [];
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
};

// Publications
export const getPublications = async (): Promise<Publication[]> => {
  if (!checkSupabase()) return [];
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
};

// Resume
export const getLatestResume = async (): Promise<Resume | null> => {
  if (!checkSupabase()) return null;
  const { data, error } = await supabase
    .from('resume')
    .select('*')
    .order('uploaded_at', { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data;
};

// Site Settings
export const getSiteSettings = async (): Promise<SiteSetting[]> => {
  if (!checkSupabase()) return [];
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) throw error;
  return data || [];
};

export const getSiteSetting = async (key: string): Promise<string | null> => {
  if (!checkSupabase()) return null;
  const { data, error } = await supabase
    .from('site_settings')
    .select('setting_value')
    .eq('setting_key', key)
    .single();
  if (error) throw error;
  return data?.setting_value || null;
};

// Contact Form
export const submitContactForm = async (formData: ContactFormData): Promise<void> => {
  if (!checkSupabase()) {
    console.log('Contact form submission (mock):', formData);
    return;
  }
  const { error } = await supabase.from('messages').insert([
    {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    },
  ]);
  if (error) throw error;
};

// Newsletter Subscription
export const subscribe = async (formData: SubscribeFormData): Promise<void> => {
  if (!checkSupabase()) {
    console.log('Newsletter subscription (mock):', formData);
    return;
  }
  const { error } = await supabase.from('subscribers').insert([
    {
      email: formData.email,
    },
  ]);
  if (error) throw error;
};

// Admin API functions
export const getAllMessages = async (): Promise<Message[]> => {
  if (!checkSupabase()) return [];
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const markMessageAsRead = async (id: string): Promise<void> => {
  if (!checkSupabase()) return;
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', id);
  if (error) throw error;
};

export const getAllSubscribers = async (): Promise<Subscriber[]> => {
  if (!checkSupabase()) return [];
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });
  if (error) throw error;
  return data || [];
};
