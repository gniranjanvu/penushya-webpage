import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award, ExternalLink } from 'lucide-react';
import { getEducation } from '../../lib/api';
import type { Education } from '../../types';

const EducationComponent = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const data = await getEducation();
        setEducation(data);
      } catch (error) {
        console.error('Error fetching education:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
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
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section
      id="education"
      className="py-20 px-4 bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-gray-900"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Education
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            My academic journey and qualifications
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          </div>
        ) : education.length === 0 ? (
          <div className="text-center py-20">
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No education records to display yet.
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
            {/* Vertical timeline line */}
            <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500"></div>

            {/* Timeline items */}
            <div className="space-y-8">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  variants={itemVariants}
                  transition={{ duration: 0.6 }}
                  className="relative pl-20 md:pl-28"
                >
                  {/* Timeline node */}
                  <div className="absolute left-6 md:left-10 top-6 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg z-10"></div>

                  {/* Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-purple-500">
                        {/* Logo Placeholder */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0">
                            {edu.logo_url ? (
                              <img
                                src={edu.logo_url}
                                alt={`${edu.institution} logo`}
                                className="h-16 w-16 object-contain rounded-lg bg-gray-100 dark:bg-gray-700 p-2"
                              />
                            ) : (
                              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-8 h-8 text-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                              {edu.degree}
                            </h3>
                            <p className="text-lg text-purple-600 dark:text-purple-400 font-semibold">
                              {edu.institution}
                            </p>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {formatDate(edu.start_date, edu.end_date, edu.is_current)}
                          </span>
                          {edu.is_current && (
                            <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full">
                              Current
                            </span>
                          )}
                        </div>

                        {/* Grade */}
                        {edu.grade && (
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4">
                            <Award className="w-5 h-5 text-yellow-500" />
                            <span className="font-semibold">Grade: {edu.grade}</span>
                          </div>
                        )}

                        {/* Certificate Button */}
                        {edu.certificate_url && (
                          <a
                            href={edu.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
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

export default EducationComponent;
