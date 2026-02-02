import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Code, Plus, Edit, Trash2, Save, X, Star, Image as ImageIcon, Video, Link2 } from 'lucide-react';
import { supabase, uploadFile, deleteFile, getPublicUrl } from '../../lib/supabase';
import type { Project, ProjectImage, ProjectVideo, ProjectButton } from '../../types';
import RichTextEditor from './RichTextEditor';

interface ProjectFormData {
  title: string;
  short_description?: string;
  full_description?: string;
  hero_image_url?: string;
  tech_stack: string;
  is_featured: boolean;
  category?: string;
  display_order: number;
}

interface ImageItem {
  id?: string;
  file?: File;
  url: string;
  display_order: number;
}

interface VideoItem {
  id?: string;
  url: string;
  display_order: number;
}

interface ButtonItem {
  id?: string;
  label: string;
  url: string;
  button_type: string;
  display_order: number;
}

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fullDescription, setFullDescription] = useState('');
  
  // New state for enhanced features
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [buttons, setButtons] = useState<ButtonItem[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          images:project_images(*),
          videos:project_videos(*),
          buttons:project_buttons(*)
        `)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: ProjectFormData) => {
    try {
      setSubmitting(true);

      const techStackArray = formData.tech_stack
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      // Upload hero image if file is selected
      let heroImageUrl = formData.hero_image_url || null;
      if (heroImageFile) {
        const fileName = `projects/hero-${Date.now()}-${heroImageFile.name}`;
        const result = await uploadFile('images', fileName, heroImageFile);
        
        if (result.error) {
          const errorMessage = result.error instanceof Error ? result.error.message : String(result.error);
          if (errorMessage.includes('Bucket not found')) {
            throw new Error('Storage bucket "images" not found. Please create the bucket in Supabase Dashboard. See SETUP.md for instructions.');
          }
          throw result.error;
        }
        
        heroImageUrl = getPublicUrl('images', fileName);
      }

      const projectData = {
        title: formData.title,
        short_description: formData.short_description?.trim() || null,
        full_description: fullDescription || null,
        hero_image_url: heroImageUrl,
        tech_stack: techStackArray,
        is_featured: formData.is_featured,
        category: formData.category?.trim() || null,
        display_order: formData.display_order,
      };

      let projectId = editingId;

      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();

        if (error) throw error;
        projectId = data.id;
      }

      // Save images
      if (projectId) {
        await saveProjectImages(projectId);
      }
      
      // Save videos
      if (projectId) {
        await saveProjectVideos(projectId);
      }
      
      // Save buttons
      if (projectId) {
        await saveProjectButtons(projectId);
      }

      toast.success(editingId ? 'Project updated successfully' : 'Project added successfully');
      fetchProjects();
      handleCancelForm();
    } catch (error: unknown) {
      console.error('Error saving project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save project';
      toast.error(errorMessage, { autoClose: 8000 });
    } finally {
      setSubmitting(false);
    }
  };

  const saveProjectImages = async (projectId: string) => {
    // Delete removed images
    if (editingId) {
      const existingImageIds = images.filter(img => img.id).map(img => img.id!);
      const { data: currentImages } = await supabase
        .from('project_images')
        .select('id, image_url')
        .eq('project_id', projectId);
      
      const imagesToDelete = currentImages?.filter(img => !existingImageIds.includes(img.id)) || [];
      
      for (const img of imagesToDelete) {
        // Delete from storage
        const fileName = img.image_url.split('/').pop();
        if (fileName) {
          await deleteFile('images', `projects/${fileName}`);
        }
        // Delete from database
        await supabase.from('project_images').delete().eq('id', img.id);
      }
    }

    // Upload new images and save
    for (const img of images) {
      if (img.file) {
        // Upload new image
        const fileName = `projects/${Date.now()}-${img.file.name}`;
        const result = await uploadFile('images', fileName, img.file);
        
        if (result.error) throw result.error;
        
        const imageUrl = getPublicUrl('images', fileName);
        
        await supabase.from('project_images').insert([{
          project_id: projectId,
          image_url: imageUrl,
          display_order: img.display_order,
        }]);
      } else if (img.id) {
        // Update existing image order
        await supabase
          .from('project_images')
          .update({ display_order: img.display_order })
          .eq('id', img.id);
      }
    }
  };

  const saveProjectVideos = async (projectId: string) => {
    // Delete removed videos
    if (editingId) {
      const existingVideoIds = videos.filter(vid => vid.id).map(vid => vid.id!);
      const { data: currentVideos } = await supabase
        .from('project_videos')
        .select('id')
        .eq('project_id', projectId);
      
      const videosToDelete = currentVideos?.filter(vid => !existingVideoIds.includes(vid.id)) || [];
      
      for (const vid of videosToDelete) {
        await supabase.from('project_videos').delete().eq('id', vid.id);
      }
    }

    // Save videos
    for (const vid of videos) {
      if (!vid.id) {
        // Insert new video
        await supabase.from('project_videos').insert([{
          project_id: projectId,
          video_url: vid.url,
          display_order: vid.display_order,
        }]);
      } else {
        // Update existing video
        await supabase
          .from('project_videos')
          .update({ 
            video_url: vid.url,
            display_order: vid.display_order 
          })
          .eq('id', vid.id);
      }
    }
  };

  const saveProjectButtons = async (projectId: string) => {
    // Delete removed buttons
    if (editingId) {
      const existingButtonIds = buttons.filter(btn => btn.id).map(btn => btn.id!);
      const { data: currentButtons } = await supabase
        .from('project_buttons')
        .select('id')
        .eq('project_id', projectId);
      
      const buttonsToDelete = currentButtons?.filter(btn => !existingButtonIds.includes(btn.id)) || [];
      
      for (const btn of buttonsToDelete) {
        await supabase.from('project_buttons').delete().eq('id', btn.id);
      }
    }

    // Save buttons
    for (const btn of buttons) {
      if (!btn.id) {
        // Insert new button
        await supabase.from('project_buttons').insert([{
          project_id: projectId,
          label: btn.label,
          url: btn.url,
          button_type: btn.button_type,
          display_order: btn.display_order,
        }]);
      } else {
        // Update existing button
        await supabase
          .from('project_buttons')
          .update({ 
            label: btn.label,
            url: btn.url,
            button_type: btn.button_type,
            display_order: btn.display_order 
          })
          .eq('id', btn.id);
      }
    }
  };

  const handleEdit = async (project: Project) => {
    setEditingId(project.id);
    setValue('title', project.title);
    setValue('short_description', project.short_description || '');
    setFullDescription(project.full_description || '');
    setValue('hero_image_url', project.hero_image_url || '');
    setHeroImagePreview(project.hero_image_url || '');
    setValue('tech_stack', project.tech_stack?.join(', ') || '');
    setValue('is_featured', project.is_featured);
    setValue('category', project.category || '');
    setValue('display_order', project.display_order);
    
    // Load images
    const projectImages = project.images || [];
    setImages(projectImages.map((img: ProjectImage) => ({
      id: img.id,
      url: img.image_url,
      display_order: img.display_order,
    })));
    
    // Load videos
    const projectVideos = project.videos || [];
    setVideos(projectVideos.map((vid: ProjectVideo) => ({
      id: vid.id,
      url: vid.video_url,
      display_order: vid.display_order,
    })));
    
    // Load buttons
    const projectButtons = project.buttons || [];
    setButtons(projectButtons.map((btn: ProjectButton) => ({
      id: btn.id,
      label: btn.label,
      url: btn.url,
      button_type: btn.button_type || '',
      display_order: btn.display_order,
    })));
    
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFullDescription('');
    setHeroImageFile(null);
    setHeroImagePreview('');
    setImages([]);
    setVideos([]);
    setButtons([]);
    reset();
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFullDescription('');
    setHeroImageFile(null);
    setHeroImagePreview('');
    setImages([]);
    setVideos([]);
    setButtons([]);
    reset({
      title: '',
      short_description: '',
      hero_image_url: '',
      tech_stack: '',
      is_featured: false,
      category: '',
      display_order: projects.length + 1,
    });
    setShowForm(true);
  };

  // Hero image handling
  const handleHeroImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setHeroImageFile(file);
    setHeroImagePreview(URL.createObjectURL(file));
  };

  // Gallery image handling
  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 10MB`);
        continue;
      }

      newImages.push({
        file,
        url: URL.createObjectURL(file),
        display_order: images.length + newImages.length,
      });
    }

    setImages([...images, ...newImages]);
    event.target.value = ''; // Reset input
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Video handling
  const handleAddVideo = () => {
    setVideos([...videos, { url: '', display_order: videos.length }]);
  };

  const handleVideoChange = (index: number, url: string) => {
    const updated = [...videos];
    updated[index].url = url;
    setVideos(updated);
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  // Button handling
  const handleAddButton = () => {
    setButtons([...buttons, { 
      label: '', 
      url: '', 
      button_type: 'demo',
      display_order: buttons.length 
    }]);
  };

  const handleButtonChange = (index: number, field: keyof ButtonItem, value: string) => {
    const updated = [...buttons];
    updated[index] = { ...updated[index], [field]: value };
    setButtons(updated);
  };

  const handleRemoveButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Project Manager
          </h2>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {editingId ? 'Edit Project' : 'Add New Project'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  {...register('category')}
                  placeholder="e.g., Web Development, Mobile App"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hero Image
                </label>
                
                {/* Image Preview */}
                {(heroImagePreview || heroImageFile) && (
                  <div className="mb-4 relative">
                    <img 
                      src={heroImagePreview} 
                      alt="Hero preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setHeroImageFile(null);
                        setHeroImagePreview('');
                        setValue('hero_image_url', '');
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Upload Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageSelect}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Or Enter URL
                    </label>
                    <input
                      type="url"
                      {...register('hero_image_url')}
                      placeholder="https://..."
                      onChange={(e) => {
                        setValue('hero_image_url', e.target.value);
                        if (e.target.value) {
                          setHeroImagePreview(e.target.value);
                          setHeroImageFile(null);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Order *
                </label>
                <input
                  type="number"
                  {...register('display_order', { required: 'Display order is required', valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.display_order && (
                  <p className="text-red-500 text-sm mt-1">{errors.display_order.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('is_featured')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Featured Project
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Short Description
              </label>
              <input
                type="text"
                {...register('short_description')}
                placeholder="Brief description of the project"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                {...register('tech_stack')}
                placeholder="React, TypeScript, Tailwind CSS, Node.js"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter technologies separated by commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Description (Rich Text Editor)
              </label>
              <RichTextEditor
                content={fullDescription}
                onChange={setFullDescription}
                placeholder="Write detailed description of the project. You can add text formatting, images, videos, and more..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Use the toolbar above to format text, add headings, lists, images, and YouTube videos.
              </p>
            </div>

            {/* Image Gallery Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Image Gallery
                </label>
                <label className="cursor-pointer px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAddImage}
                    className="hidden"
                  />
                </label>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                        #{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {images.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No images added yet. Click "Add Images" to upload.
                </p>
              )}
            </div>

            {/* Video Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Videos (YouTube/Vimeo URLs)
                </label>
                <button
                  type="button"
                  onClick={handleAddVideo}
                  className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Video
                </button>
              </div>
              
              {videos.length > 0 && (
                <div className="space-y-2">
                  {videos.map((vid, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={vid.url}
                        onChange={(e) => handleVideoChange(index, e.target.value)}
                        placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {videos.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No videos added yet. Click "Add Video" to include video URLs.
                </p>
              )}
            </div>

            {/* Action Buttons Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Link2 className="w-5 h-5" />
                  Action Buttons
                </label>
                <button
                  type="button"
                  onClick={handleAddButton}
                  className="px-3 py-1.5 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Button
                </button>
              </div>
              
              {buttons.length > 0 && (
                <div className="space-y-3">
                  {buttons.map((btn, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Button Label *
                          </label>
                          <input
                            type="text"
                            value={btn.label}
                            onChange={(e) => handleButtonChange(index, 'label', e.target.value)}
                            placeholder="Live Demo"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Button Type *
                          </label>
                          <select
                            value={btn.button_type}
                            onChange={(e) => handleButtonChange(index, 'button_type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                          >
                            <option value="demo">Live Demo</option>
                            <option value="github">Source Code</option>
                            <option value="docs">Documentation</option>
                            <option value="download">Download</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              URL *
                            </label>
                            <input
                              type="url"
                              value={btn.url}
                              onChange={(e) => handleButtonChange(index, 'url', e.target.value)}
                              placeholder="https://..."
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => handleRemoveButton(index)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {buttons.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No action buttons added yet. Click "Add Button" to create call-to-action buttons.
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 inline mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {submitting ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <Code className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No projects found. Click "Add Project" to create one.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {project.hero_image_url && (
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={project.hero_image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  {project.is_featured && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  )}
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                {project.category && (
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-2">
                    {project.category}
                  </span>
                )}
                {project.short_description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.short_description}
                  </p>
                )}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                        +{project.tech_stack.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Order: {project.display_order}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectManager;
