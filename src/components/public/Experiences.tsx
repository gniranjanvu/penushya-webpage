import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, ExternalLink } from 'lucide-react';
import { getExperiences } from '../../lib/api';
import type { Experience } from '../../types';

const Experiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const formatDate = (startDate: string, endDate?: string, isCurrent?: boolean) => {
    const start = new Date(startDate).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    const end = isCurrent
      ? 'Present'
      : endDate
      ? new Date(endDate).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
      : 'Present';
    return `${start} - ${end}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="experiences"
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
            Professional Experience
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            My journey through various roles and companies
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No experiences to display yet.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="relative"
          >
            {/* Center line for desktop */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  variants={itemVariants}
                  transition={{ duration: 0.6 }}
                  className={`relative flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full border-4 border-white dark:border-gray-800 z-10 shadow-lg"></div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className={`w-full md:w-[calc(50%-3rem)] ${
                      index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                    }`}
                  >
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                        {/* Company Logo */}
                        {experience.logo_url && (
                          <div className="mb-4">
                            <img
                              src={experience.logo_url}
                              alt={`${experience.company_name} logo`}
                              className="h-12 w-12 object-contain rounded-lg"
                            />
                          </div>
                        )}

                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                              {experience.role}
                            </h3>
                            <p className="text-lg text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-2">
                              <Briefcase className="w-5 h-5" />
                              {experience.company_name}
                            </p>
                          </div>
                          {experience.is_current && (
                            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-md">
                              Current
                            </span>
                          )}
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {formatDate(
                              experience.start_date,
                              experience.end_date,
                              experience.is_current
                            )}
                          </span>
                        </div>

                        {/* Description */}
                        {experience.description && (
                          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            {experience.description}
                          </p>
                        )}

                        {/* Certificate Button */}
                        {experience.certificate_url && (
                          <a
                            href={experience.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            <span>View Certificate</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Experiences;
