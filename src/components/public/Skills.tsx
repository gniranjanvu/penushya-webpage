import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Code, Cpu, Wrench } from 'lucide-react';
import { getSkills } from '../../lib/api';
import type { Skill } from '../../types';

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('frontend') || categoryLower.includes('front-end')) {
      return Code;
    }
    if (categoryLower.includes('backend') || categoryLower.includes('back-end')) {
      return Cpu;
    }
    if (categoryLower.includes('robot')) {
      return Cpu;
    }
    if (categoryLower.includes('tool')) {
      return Wrench;
    }
    return Star;
  };

  const getProficiencyColor = (level: number) => {
    if (level >= 5) return 'from-green-500 to-emerald-500';
    if (level >= 3) return 'from-blue-500 to-cyan-500';
    return 'from-yellow-500 to-orange-500';
  };

  const getProficiencyTextColor = (level: number) => {
    if (level >= 5) return 'text-green-600 dark:text-green-400';
    if (level >= 3) return 'text-blue-600 dark:text-blue-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

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

  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="skills"
      className="py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900/20"
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
            Skills & Expertise
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Technologies and tools I work with
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-20">
            <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No skills to display yet.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => {
              const CategoryIcon = getCategoryIcon(category);
              return (
                <motion.div
                  key={category}
                  variants={categoryVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg">
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {category}
                    </h3>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500/20 to-transparent"></div>
                  </div>

                  {/* Skills Grid */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {categorySkills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        variants={itemVariants}
                        transition={{ duration: 0.5 }}
                        whileHover={{ y: -5, scale: 1.03 }}
                        className="group relative"
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${getProficiencyColor(
                            skill.proficiency_level
                          )} rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300`}
                        ></div>
                        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
                          {/* Skill Icon/Logo */}
                          {skill.icon_url ? (
                            <div className="mb-4">
                              <img
                                src={skill.icon_url}
                                alt={skill.skill_name}
                                className="h-12 w-12 object-contain"
                              />
                            </div>
                          ) : (
                            <div className="mb-4">
                              <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg flex items-center justify-center">
                                <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                          )}

                          {/* Skill Name */}
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                            {skill.skill_name}
                          </h4>

                          {/* Proficiency Level Circles */}
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                  level <= skill.proficiency_level
                                    ? `bg-gradient-to-r ${getProficiencyColor(
                                        skill.proficiency_level
                                      )} shadow-md`
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                              ></div>
                            ))}
                            <span
                              className={`ml-2 text-xs font-semibold ${getProficiencyTextColor(
                                skill.proficiency_level
                              )}`}
                            >
                              {skill.proficiency_level}/5
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(skill.proficiency_level / 5) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className={`h-full bg-gradient-to-r ${getProficiencyColor(
                                skill.proficiency_level
                              )} rounded-full shadow-lg`}
                            ></motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
