import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import {
  Code,
  Calendar,
  ArrowLeft,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Navbar, Footer } from '../components/public';
import {
  getProjectById,
  getProjectImages,
  getProjectVideos,
  getProjectButtons,
  getProjects,
} from '../lib/api';
import type { Project, ProjectImage, ProjectVideo, ProjectButton } from '../types';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [videos, setVideos] = useState<ProjectVideo[]>([]);
  const [buttons, setButtons] = useState<ProjectButton[]>([]);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [projectData, imagesData, videosData, buttonsData, allProjects] =
          await Promise.all([
            getProjectById(id),
            getProjectImages(id),
            getProjectVideos(id),
            getProjectButtons(id),
            getProjects(true),
          ]);

        if (!projectData) {
          setNotFound(true);
          return;
        }

        setProject(projectData);
        setImages(imagesData);
        setVideos(videosData);
        setButtons(buttonsData);

        // Get related projects (featured projects excluding current one)
        const related = allProjects.filter((p) => p.id !== id).slice(0, 3);
        setRelatedProjects(related);
      } catch (error) {
        console.error('Error fetching project details:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    )?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-screen px-4">
          <Code className="w-24 h-24 text-gray-400 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Project Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 overflow-hidden">
          {project.hero_image_url ? (
            <>
              <img
                src={project.hero_image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Code className="w-32 h-32 text-purple-300 dark:text-purple-600" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-white hover:text-purple-200 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Projects</span>
              </Link>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                {project.title}
              </motion.h1>
              {project.category && (
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium">
                  {project.category}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    About This Project
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                    {parse(DOMPurify.sanitize(project.full_description || project.short_description || 'No description available'))}
                  </div>
                </motion.div>

                {/* Image Gallery */}
                {images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Gallery
                    </h2>
                    <div className="relative">
                      <div className="relative h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
                        <img
                          src={images[currentImageIndex].image_url}
                          alt={`${project.title} - Image ${currentImageIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </button>
                          </>
                        )}
                      </div>
                      {images.length > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? 'bg-purple-500 w-8'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Videos */}
                {videos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Videos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {videos.map((video) => (
                        <div
                          key={video.id}
                          className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden"
                        >
                          <iframe
                            src={getYouTubeEmbedUrl(video.video_url)}
                            title={`${project.title} video`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Tech Stack */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-lg border border-purple-200 dark:border-purple-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                {buttons.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Quick Links
                    </h3>
                    <div className="space-y-3">
                      {buttons.map((button) => (
                        <a
                          key={button.id}
                          href={button.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group"
                        >
                          <span className="font-medium">{button.label}</span>
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Project Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Project Info
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    {project.is_featured && (
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
                          ⭐ Featured Project
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-20"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Related Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedProjects.map((relatedProject) => (
                    <Link
                      key={relatedProject.id}
                      to={`/projects/${relatedProject.id}`}
                      className="group"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                        <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 overflow-hidden">
                          {relatedProject.hero_image_url ? (
                            <img
                              src={relatedProject.hero_image_url}
                              alt={relatedProject.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Code className="w-20 h-20 text-purple-300 dark:text-purple-600" />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                            {relatedProject.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                            {relatedProject.short_description || 'No description available'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
