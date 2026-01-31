import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, ExternalLink } from 'lucide-react';
import { getCertifications } from '../../lib/api';
import type { Certification } from '../../types';
import { formatDateShort } from '../../utils/dateFormatter';

const Certifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const data = await getCertifications();
        setCertifications(data);
      } catch (error) {
        console.error('Error fetching certifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
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

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <section
      id="certifications"
      className="py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-amber-50 dark:from-gray-800 dark:via-gray-900 dark:to-amber-900/20"
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
            Certifications
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Professional certifications and achievements
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
          </div>
        ) : certifications.length === 0 ? (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No certifications to display yet.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {certifications.map((cert) => (
              <motion.div
                key={cert.id}
                variants={itemVariants}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 flex flex-col h-full">
                  {/* Certificate Image */}
                  <div className="relative h-40 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 overflow-hidden">
                    {cert.certificate_image_url ? (
                      <img
                        src={cert.certificate_image_url}
                        alt={cert.certificate_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Award className="w-16 h-16 text-amber-300 dark:text-amber-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    
                    {/* Expiry Badge */}
                    {cert.expiry_date && (
                      <div
                        className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${
                          isExpired(cert.expiry_date)
                            ? 'bg-red-500/90 text-white'
                            : 'bg-green-500/90 text-white'
                        }`}
                      >
                        {isExpired(cert.expiry_date) ? 'Expired' : 'Valid'}
                      </div>
                    )}
                  </div>

                  {/* Certificate Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Provider Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                        {cert.provider}
                      </span>
                    </div>

                    {/* Certificate Name */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 flex-1">
                      {cert.certificate_name}
                    </h3>

                    {/* Dates */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Issued: {formatDateShort(cert.issue_date)}</span>
                      </div>
                      {cert.expiry_date && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>Valid until: {formatDateShort(cert.expiry_date)}</span>
                        </div>
                      )}
                    </div>

                    {/* View Certificate Button */}
                    {cert.certificate_url && (
                      <a
                        href={cert.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg group/button"
                      >
                        <span className="font-medium text-sm">View Certificate</span>
                        <ExternalLink className="w-4 h-4 group-hover/button:translate-x-1 group-hover/button:-translate-y-1 transition-transform duration-300" />
                      </a>
                    )}
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

export default Certifications;
