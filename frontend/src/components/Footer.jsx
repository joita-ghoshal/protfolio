import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiArrowUp } from 'react-icons/hi';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import { contactAPI } from '../services/api';

function FooterParticles({ count = 20 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 5 + Math.random() * 8,
      delay: Math.random() * 6,
    })), [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.size > 1.5 ? 'rgba(0, 229, 255, 0.25)' : 'rgba(124, 58, 237, 0.2)',
          }}
          animate={{
            y: [-8, 8, -8],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

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
    <footer className="bg-[#0D0D1A] border-t border-white/[0.06] relative overflow-hidden" role="contentinfo">
      <FooterParticles />

      {/* Soft gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-20 left-1/4 w-64 h-64 rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #00E5FF 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 right-1/4 w-48 h-48 rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ x: [0, -20, 30, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Glowing line accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <motion.h3
              className="text-2xl font-bold gradient-text"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              JG
            </motion.h3>
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

        <div className="border-t border-white/[0.06] mt-10 pt-8 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent" />
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
