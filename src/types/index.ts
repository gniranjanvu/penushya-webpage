// Database entity types

export interface Experience {
  id: string;
  company_name: string;
  role: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  certificate_url?: string;
  logo_url?: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  grade?: string;
  certificate_url?: string;
  logo_url?: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  short_description?: string;
  full_description?: string;
  hero_image_url?: string;
  tech_stack?: string[];
  is_featured: boolean;
  category?: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
  videos?: ProjectVideo[];
  buttons?: ProjectButton[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface ProjectVideo {
  id: string;
  project_id: string;
  video_url: string;
  display_order: number;
  created_at: string;
}

export interface ProjectButton {
  id: string;
  project_id: string;
  label: string;
  url: string;
  button_type?: string;
  display_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  skill_name: string;
  category?: string;
  proficiency_level: number; // 1-5
  icon_url?: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

export interface Certification {
  id: string;
  certificate_name: string;
  provider: string;
  issue_date: string;
  expiry_date?: string;
  certificate_image_url?: string;
  certificate_url?: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date?: string;
  image_url?: string;
  certificate_url?: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  publication_venue?: string;
  publication_date?: string;
  abstract?: string;
  url?: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface Resume {
  id: string;
  file_url: string;
  filename: string;
  uploaded_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value?: string;
  updated_at: string;
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface SubscribeFormData {
  email: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}
