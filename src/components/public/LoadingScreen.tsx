import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const generateParticles = () =>
  [...Array(20)].map(() => ({
    initialX: Math.random() * 400 - 200,
    initialY: Math.random() * 400 - 200,
    initialScale: Math.random() * 0.5 + 0.5,
    animateX: Math.random() * 400 - 200,
    animateY: Math.random() * 400 - 200,
    animateScale: Math.random() * 1 + 0.5,
    duration: Math.random() * 3 + 2,
  }));

const particles = generateParticles();

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900"
    >
      {/* Glassmorphism Container */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-white/30"
              initial={{
                x: particle.initialX,
                y: particle.initialY,
                scale: particle.initialScale,
              }}
              animate={{
                x: particle.animateX,
                y: particle.animateY,
                scale: particle.animateScale,
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>

        {/* Main Spinner with Glassmorphism */}
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="h-32 w-32 rounded-full border-8 border-white/20 border-t-white backdrop-blur-md"></div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 backdrop-blur-md bg-white/10 px-8 py-4 rounded-2xl border border-white/20"
        >
          <p className="text-2xl font-semibold text-white">Loading...</p>
        </motion.div>

        {/* Orbiting Particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orbit-${i}`}
            className="absolute h-4 w-4 rounded-full bg-white"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3 - i * 0.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              left: '50%',
              top: '50%',
              marginLeft: -8,
              marginTop: -8,
              transformOrigin: `${50 + i * 20}px 0px`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
