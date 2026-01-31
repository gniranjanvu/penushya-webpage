import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Heart, Linkedin, Github, Mail, Send } from 'lucide-react';
import { subscribe } from '../../lib/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await subscribe({ email });
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    {
      icon: <Linkedin className="w-5 h-5" />,
      url: 'https://www.linkedin.com/in/penushya/',
      label: 'LinkedIn',
      color: 'hover:text-blue-500',
    },
    {
      icon: <Github className="w-5 h-5" />,
      url: 'https://github.com/Penushya',
      label: 'GitHub',
      color: 'hover:text-gray-400',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      url: 'mailto:varripenushya9573@gmail.com',
      label: 'Email',
      color: 'hover:text-red-500',
    },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      {/* Gradient Divider */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left Section - About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Penushya Varri
            </h3>
            <p className="text-gray-400 mb-4">
              Robotics & Automation Engineer passionate about creating innovative solutions
              and pushing the boundaries of technology.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`p-2 bg-gray-800 rounded-lg text-gray-400 ${social.color} transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Middle Section - Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Section - Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              Stay Updated
            </h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get the latest updates and news.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  aria-label="Subscribe"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Bottom Section - Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              © 2026 Penushya Varri. Made with Passion{' '}
              <Heart className="w-4 h-4 text-red-500 fill-current inline-block animate-pulse" />
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#home"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#home"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
