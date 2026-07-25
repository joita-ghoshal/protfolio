import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiArrowUp } from 'react-icons/hi';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import { contactAPI } from '../services/api';

export default function Footer() {
  const [contact, setContact] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    contactAPI.get().then((res) => setContact(res.data)).catch(() => {});
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#F8FAFC] border-t border-border/50 relative" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold gradient-text">Portfolio</h3>
            <p className="text-secondary-text text-sm mt-1">
              Built with precision & passion
            </p>
          </div>

          <div className="flex items-center gap-4">
            {contact?.github && (
              <a href={contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-secondary-text hover:text-primary hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <FiGithub size={18} />
              </a>
            )}
            {contact?.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-secondary-text hover:text-primary hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <FiLinkedin size={18} />
              </a>
            )}
            {contact?.twitter && (
              <a href={contact.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-secondary-text hover:text-primary hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <FiTwitter size={18} />
              </a>
            )}
            {contact?.email && (
              <a href={`mailto:${contact.email}`} aria-label="Email" className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-secondary-text hover:text-primary hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <FiMail size={18} />
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center">
          <p className="text-secondary-text text-sm">
            &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
        </div>
      </div>

      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all z-40"
          aria-label="Back to top"
        >
          <HiArrowUp size={20} />
        </motion.button>
      )}
    </footer>
  );
}
