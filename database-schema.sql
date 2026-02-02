-- Penushya Portfolio Website Database Schema
-- Execute this in your Supabase SQL editor

-- ====================================================================================
-- IMPORTANT: Storage Buckets Setup
-- ====================================================================================
-- This schema creates database tables only. You MUST also create storage buckets
-- manually in the Supabase Dashboard (Storage section).
--
-- Required Buckets:
-- 
-- 1. Bucket Name: resumes
--    - Public: YES
--    - File size limit: 5 MB
--    - Allowed MIME types: application/pdf
--    - Used for: Resume PDF files
--
-- 2. Bucket Name: images  
--    - Public: YES
--    - File size limit: 10 MB
--    - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
--    - Used for: Project images, logos, certificates, achievements
--
-- See SETUP.md for detailed instructions on creating buckets and setting up policies.
-- ====================================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Experiences Table
CREATE TABLE IF NOT EXISTS experiences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    certificate_url TEXT,
    logo_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Education Table
CREATE TABLE IF NOT EXISTS education (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    grade VARCHAR(50),
    certificate_url TEXT,
    logo_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_description TEXT,
    full_description TEXT,
    hero_image_url TEXT,
    tech_stack TEXT[], -- Array of technologies
    is_featured BOOLEAN DEFAULT false,
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Project Images Table
CREATE TABLE IF NOT EXISTS project_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Project Videos Table
CREATE TABLE IF NOT EXISTS project_videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Project Buttons Table
CREATE TABLE IF NOT EXISTS project_buttons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    button_type VARCHAR(50), -- e.g., 'demo', 'github', 'docs', etc.
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(100), -- e.g., 'Frontend', 'Backend', 'Robotics', 'Tools'
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5), -- 1=Basic, 5=Advanced
    icon_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    certificate_name VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    certificate_image_url TEXT,
    certificate_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE,
    image_url TEXT,
    certificate_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 10. Publications Table
CREATE TABLE IF NOT EXISTS publications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    authors TEXT NOT NULL,
    publication_venue VARCHAR(255),
    publication_date DATE,
    abstract TEXT,
    url TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 11. Messages Table (Contact Form Submissions)
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 12. Subscribers Table (Newsletter)
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 13. Resume Table
CREATE TABLE IF NOT EXISTS resume (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    file_url TEXT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 14. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_experiences_display_order ON experiences(display_order);
CREATE INDEX IF NOT EXISTS idx_education_display_order ON education(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default education data
INSERT INTO education (degree, institution, start_date, end_date, is_current, grade, display_order, is_published)
VALUES
    ('B.Tech in Robotics & Automation', 'Vignan University', '2022-01-01', NULL, true, 'CGPA: 9.23', 1, true),
    ('Diploma in Automation & Robotics', 'CITD Hyderabad', '2019-01-01', '2021-12-31', false, 'CGPA: 9.34', 2, true),
    ('10th Standard', 'Sri Chaitanya School', '2018-01-01', '2019-12-31', false, 'GPA: 10/10', 3, true)
ON CONFLICT DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value)
VALUES
    ('site_name', 'Penushya Varri'),
    ('site_tagline', 'Robotics & Automation Engineer'),
    ('contact_email', 'varripenushya9573@gmail.com'),
    ('linkedin_url', 'https://www.linkedin.com/in/penushya/'),
    ('github_url', 'https://github.com/Penushya')
ON CONFLICT (setting_key) DO NOTHING;

-- Row Level Security (RLS) Policies
-- Note: Adjust these based on your authentication setup

-- Enable RLS on all tables
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_buttons ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published experiences" ON experiences
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published education" ON education
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published projects" ON projects
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view project images" ON project_images
    FOR SELECT USING (true);

CREATE POLICY "Public can view project videos" ON project_videos
    FOR SELECT USING (true);

CREATE POLICY "Public can view project buttons" ON project_buttons
    FOR SELECT USING (true);

CREATE POLICY "Public can view published skills" ON skills
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published certifications" ON certifications
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published achievements" ON achievements
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published publications" ON publications
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view resume" ON resume
    FOR SELECT USING (true);

CREATE POLICY "Public can view site settings" ON site_settings
    FOR SELECT USING (true);

-- Public can insert messages and subscribe
CREATE POLICY "Anyone can submit messages" ON messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can subscribe" ON subscribers
    FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) have full access
CREATE POLICY "Authenticated users have full access to experiences" ON experiences
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to education" ON education
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to project_images" ON project_images
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to project_videos" ON project_videos
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to project_buttons" ON project_buttons
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to skills" ON skills
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to certifications" ON certifications
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to achievements" ON achievements
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to publications" ON publications
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view all messages" ON messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update messages" ON messages
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view subscribers" ON subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to resume" ON resume
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users have full access to site_settings" ON site_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- ====================================================================================
-- Storage Bucket Policies
-- ====================================================================================
-- After creating the 'resumes' and 'images' buckets in Supabase Dashboard → Storage,
-- apply these policies to enable proper access control.
--
-- Note: You must create the buckets first before applying these policies!
-- See SETUP.md for step-by-step instructions.
-- ====================================================================================

-- Bucket: resumes
-- Policies for resume PDF files

-- Allow public to read/download resumes
CREATE POLICY "Public can view resumes"
ON storage.objects FOR SELECT
USING ( bucket_id = 'resumes' );

-- Allow authenticated users to upload resumes
CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete resumes
CREATE POLICY "Authenticated users can delete resumes"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resumes' 
  AND auth.role() = 'authenticated'
);

-- Bucket: images
-- Policies for project images, logos, certificates

-- Allow public to view images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

