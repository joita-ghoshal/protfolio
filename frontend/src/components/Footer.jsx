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
    <footer className="bg-[#0D0D1A] border-t border-white/[0.06] relative" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold gradient-text">JG</h3>
            <p className="text-[#94A3B8] text-sm mt-2 tracking-wide">
              Built with <span className="text-[#00E5FF]">precision</span> &amp; <span className="text-[#7C3AED]">passion</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {contact?.github && (
              <a href={contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 transition-all duration-300 hover:-translate-y-1">
                <FiGithub size={18} />
              </a>
            )}
            {contact?.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 transition-all duration-300 hover:-translate-y-1">
                <FiLinkedin size={18} />
              </a>
            )}
            {contact?.twitter && (
              <a href={contact.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 transition-all duration-300 hover:-translate-y-1">
                <FiTwitter size={18} />
              </a>
            )}
            {contact?.email && (
              <a href={`mailto:${contact.email}`} aria-label="Email" className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 transition-all duration-300 hover:-translate-y-1">
                <FiMail size={18} />
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-10 pt-8 text-center">
          <p className="text-[#94A3B8]/60 text-sm">
            &copy; {new Date().getFullYear()} JG. All rights reserved.
          </p>
        </div>
      </div>

      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#7C3AED] text-white shadow-lg shadow-[#00E5FF]/20 flex items-center justify-center hover:shadow-[#00E5FF]/40 transition-all"
          aria-label="Back to top"
        >
          <HiArrowUp size={20} />
        </motion.button>
      )}
    </footer>
  );
}
