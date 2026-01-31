import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Medal, BookOpen, FileText, ExternalLink, Calendar, Users } from 'lucide-react';
import { getAchievements, getPublications } from '../../lib/api';
import type { Achievement, Publication } from '../../types';
import { formatDateLong, formatPublicationDate } from '../../utils/dateFormatter';

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const [loadingPublications, setLoadingPublications] = useState(true);
  const [activeTab, setActiveTab] = useState<'achievements' | 'publications'>('achievements');

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await getAchievements();
        setAchievements(data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoadingAchievements(false);
      }
    };

    const fetchPublications = async () => {
      try {
        const data = await getPublications();
        setPublications(data);
      } catch (error) {
        console.error('Error fetching publications:', error);
      } finally {
        setLoadingPublications(false);
      }
    };

    fetchAchievements();
    fetchPublications();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const getAchievementIcon = (index: number) => {
    const icons = [Trophy, Star, Medal];
    return icons[index % icons.length];
  };

  return (
    <section
      id="achievements"
      className="py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-rose-50 dark:from-gray-800 dark:via-gray-900 dark:to-rose-900/20"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Achievements & Publications
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Notable accomplishments and research contributions
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'achievements'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>Achievements</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'publications'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Publications</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Achievements Tab Content */}
        {activeTab === 'achievements' && (
          <>
            {loadingAchievements ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500"></div>
              </div>
            ) : achievements.length === 0 ? (
              <div className="text-center py-20">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No achievements to display yet.
                </p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {achievements.map((achievement, index) => {
                  const IconComponent = getAchievementIcon(index);
                  return (
                    <motion.div
                      key={achievement.id}
                      variants={itemVariants}
                      transition={{ duration: 0.5 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 flex flex-col h-full">
                        {/* Achievement Image */}
                        <div className="relative h-48 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 overflow-hidden">
                          {achievement.image_url ? (
                            <img
                              src={achievement.image_url}
                              alt={achievement.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <IconComponent className="w-20 h-20 text-rose-300 dark:text-rose-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          
                          {/* Icon Badge */}
                          <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        {/* Achievement Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                            {achievement.title}
                          </h3>

                          {/* Description */}
                          {achievement.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                              {achievement.description}
                            </p>
                          )}

                          {/* Date */}
                          {achievement.date && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-auto">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDateLong(achievement.date)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </>
        )}

        {/* Publications Tab Content */}
        {activeTab === 'publications' && (
          <>
            {loadingPublications ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500"></div>
              </div>
            ) : publications.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No publications to display yet.
                </p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="space-y-6"
              >
                {publications.map((publication, index) => (
                  <motion.div
                    key={publication.id}
                    variants={itemVariants}
                    transition={{ duration: 0.5 }}
                    whileHover={{ x: 10, scale: 1.01 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
                      {/* Publication Number Badge */}
                      <div className="absolute -left-4 -top-4 w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Icon Section */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1">
                          {/* Title */}
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                            {publication.title}
                          </h3>

                          {/* Authors */}
                          <div className="flex items-start gap-2 mb-3">
                            <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                              {publication.authors}
                            </p>
                          </div>

                          {/* Venue & Date */}
                          <div className="flex flex-wrap items-center gap-4 mb-4">
                            {publication.publication_venue && (
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                  {publication.publication_venue}
                                </span>
                              </div>
                            )}
                            {publication.publication_date && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {formatPublicationDate(publication.publication_date)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Abstract Preview */}
                          {publication.abstract && (
                            <div className="mb-4">
                              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                                {publication.abstract}
                              </p>
                            </div>
                          )}

                          {/* Read More Link */}
                          {publication.url && (
                            <a
                              href={publication.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium group/button"
                            >
                              <span>Read More</span>
                              <ExternalLink className="w-4 h-4 group-hover/button:translate-x-1 group-hover/button:-translate-y-1 transition-transform duration-300" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Achievements;
