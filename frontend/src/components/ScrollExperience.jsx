import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useLenis } from '../context/LenisContext';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
];

export default function ScrollExperience() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredSection, setHoveredSection] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const lenis = useLenis();
  const progressRef = useRef(null);

  useEffect(() => {
    const observers = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      );

      observer.observe(el);
      return observer;
    });

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setPercentage(docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0);
    };

    if (lenis) {
      lenis.on('scroll', updateProgress);
    } else {
      window.addEventListener('scroll', updateProgress, { passive: true });
    }
    updateProgress();

    return () => {
      observers.forEach((obs) => obs?.disconnect());
      if (lenis) {
        lenis.off('scroll', updateProgress);
      } else {
        window.removeEventListener('scroll', updateProgress);
      }
    };
  }, [lenis]);

  const scrollTo = (id) => {
    if (lenis) {
      lenis.scrollTo(`#${id}`, { offset: -60, duration: 1.4 });
    } else {
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3 select-none"
    >
      <div className="relative w-px h-[120px] bg-gradient-to-b from-transparent via-[rgba(0,229,255,0.12)] to-transparent rounded-full overflow-hidden">
        <motion.div
          ref={progressRef}
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#00E5FF] to-[#7C3AED] rounded-full"
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex flex-col items-center justify-between h-[120px]">
        {sections.map((section, i) => {
          const isActive = activeSection === section.id;
          const isHovered = hoveredSection === section.id;

          return (
            <div key={section.id} className="relative flex items-center justify-center">
              <button
                onClick={() => scrollTo(section.id)}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
                className="relative flex items-center justify-center focus:outline-none"
                aria-label={`Scroll to ${section.label}`}
              >
                {isActive ? (
                  <motion.div
                    layoutId="activeDot"
                    className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-glow cursor-pointer"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.3)] transition-colors cursor-pointer" />
                )}
              </button>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-full mr-3 glass-card text-xs px-2 py-1 whitespace-nowrap text-white pointer-events-none"
                  >
                    {section.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <motion.div
        className="text-[11px] font-mono text-[#00E5FF] mt-1 tabular-nums"
        initial={{ opacity: 0 }}
        animate={{ opacity: percentage > 0 ? 1 : 0 }}
      >
        {percentage}%
      </motion.div>
    </div>
  );
}
