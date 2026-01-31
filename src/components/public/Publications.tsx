import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, ExternalLink, Calendar, Users } from 'lucide-react';
import { getPublications } from '../../lib/api';
import type { Publication } from '../../types';
import { formatPublicationDate } from '../../utils/dateFormatter';

const Publications = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const data = await getPublications();
        setPublications(data);
      } catch (error) {
        console.error('Error fetching publications:', error);
      } finally {
        setLoading(false);
      }
    };

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
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section
      id="publications"
      className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20"
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
            Publications
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Research papers and academic contributions
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
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
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
                  {/* Publication Number Badge */}
                  <div className="absolute -left-4 -top-4 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Icon Section */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
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
                            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                              {publication.publication_venue}
                            </span>
                          </div>
                        )}
                        {publication.publication_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
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
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium group/button"
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
      </div>
    </section>
  );
};

export default Publications;
