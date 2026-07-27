import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useInView, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  aboutAPI, skillsAPI, projectsAPI, certificatesAPI,
  educationAPI, experienceAPI, contactAPI, analyticsAPI
} from '../services/api';
import SectionWrapper from '../components/SectionWrapper';
import SectionBackground from '../components/SectionBackground';
import {
  HiDownload, HiExternalLink, HiCode, HiAcademicCap,
  HiBadgeCheck, HiMail, HiPhone, HiLocationMarker,
  HiFilter, HiChevronDown
} from 'react-icons/hi';
import { FiGithub, FiLinkedin, FiTwitter, FiArrowUpRight, FiAward } from 'react-icons/fi';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A12]">
      <div className="relative">
        <motion.div
          className="w-20 h-20 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: '#00E5FF',
            borderRightColor: '#7C3AED',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{
            borderBottomColor: '#00E5FF',
            borderLeftColor: '#7C3AED',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <motion.p
        className="absolute mt-32 text-sm text-gray-500 tracking-widest uppercase"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading
      </motion.p>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <h2 className="section-title gradient-text text-3xl md:text-4xl">{children}</h2>
    </motion.div>
  );
}


function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
    >
      <motion.span
        className="text-xs text-gray-500 tracking-widest uppercase"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scroll
      </motion.span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <HiChevronDown className="text-accent/50" size={20} />
      </motion.div>
    </motion.div>
  );
}

function TypewriterText({ text, className }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <motion.span
          className="inline-block w-[3px] h-[1em] bg-accent ml-1 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </span>
  );
}

function SkillBar({ name, percentage }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const springWidth = useSpring(0, { stiffness: 80, damping: 15 });
  const count = useSpring(0, { stiffness: 80, damping: 15 });

  useEffect(() => {
    if (inView) {
      springWidth.set(percentage);
      count.set(percentage);
    }
  }, [inView, percentage, springWidth, count]);

  const displayPercentage = useTransform(count, (v) => Math.round(v));

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-white/80">{name}</span>
        <motion.span className="text-accent text-xs font-mono">{displayPercentage}%</motion.span>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: useTransform(springWidth, (v) => `${v}%`),
            background: 'linear-gradient(90deg, #00E5FF, #7C3AED)',
          }}
        />
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -y * 12, rotateY: x * 12 });
  }, []);

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={index === 0 ? fadeLeft : index === 1 ? fadeRight : fadeUp}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      className="card-premium group cursor-pointer"
    >
      <motion.div
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: 'preserve-3d',
          transition: hovered ? 'none' : 'all 0.5s ease',
        }}
      >
        <div className="relative overflow-hidden h-48">
          {project.thumbnail ? (
            <motion.img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
              style={{ transformStyle: 'preserve-3d' }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/5 to-accent-alt/5 flex items-center justify-center">
              <HiCode className="text-white/20" size={48} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4 gap-2">
            {project.github_link && (
              <motion.a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiGithub size={16} />
              </motion.a>
            )}
            {project.live_demo && (
              <motion.a
                href={project.live_demo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <HiExternalLink size={16} />
              </motion.a>
            )}
          </div>
          {project.featured && (
            <motion.div
              className="absolute top-3 left-3"
              initial={{ scale: 0 }}
              animate={hovered ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent text-white shadow-lg shadow-accent/30">
                Featured
              </span>
            </motion.div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-white mb-1 group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {project.description || ''}
          </p>
          {(() => {
            const techs = Array.isArray(project.technologies) ? project.technologies : 
                         (project.technologies ? project.technologies.split(',').map(t => t.trim()) : []);
            return techs.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {techs.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs rounded-full border border-white/10 text-gray-400 bg-white/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : null;
          })()}
        </div>
      </motion.div>
    </motion.div>
  );
}

function TimelineItem({ exp, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      className="relative pl-12 md:pl-16"
    >
      <motion.div
        className="absolute left-2 md:left-6 top-1 w-5 h-5 rounded-full"
        style={{
          background: '#00E5FF',
          boxShadow: '0 0 20px rgba(0,229,255,0.4), 0 0 40px rgba(0,229,255,0.15)',
        }}
        initial={{ scale: 0 }}
        animate={inView ? { scale: [0, 1.5, 1] } : {}}
        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
      />
      <div className="card-premium p-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-3 py-0.5 bg-accent/10 text-accent text-xs font-semibold rounded-full border border-accent/20">
            {exp.type || 'Work'}
          </span>
          {exp.current && (
            <span className="px-3 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
              Current
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-white">{exp.role || exp.title}</h3>
        <p className="text-accent font-medium text-sm">{exp.company}</p>
        <p className="text-gray-500 text-xs mt-1">
          {exp.start_date && new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
          {' — '}
          {exp.current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
        </p>
        {exp.description && (
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">{exp.description}</p>
        )}
      </div>
    </motion.div>
  );
}

function CertificateCard({ cert, onView }) {
  return (
    <motion.div
      variants={fadeUp}
      className="card-premium overflow-hidden group cursor-pointer"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      onClick={() => onView(cert)}
    >
      <div className="h-44 overflow-hidden relative">
        {cert.image_url ? (
          <motion.img
            src={cert.image_url}
            alt={cert.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/5 to-accent-alt/5">
            <FiAward className="text-white/20" size={56} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button
            className="px-4 py-2 rounded-full bg-accent text-white text-sm font-medium flex items-center gap-1.5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View <FiArrowUpRight size={14} />
          </motion.button>
          {cert.pdf_url && (
            <motion.a
              href={cert.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium flex items-center gap-1.5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <HiDownload size={14} /> PDF
            </motion.a>
          )}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-white mb-1">{cert.title}</h3>
        <p className="text-sm text-gray-400">{cert.issuer}</p>
      </div>
    </motion.div>
  );
}

function CertificateLightbox({ cert, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-3xl w-full max-h-[90vh] overflow-auto rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {cert.image_url && (
          <img
            src={cert.image_url}
            alt={cert.title}
            className="w-full h-auto rounded-2xl"
          />
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          {cert.pdf_url && (
            <a
              href={cert.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-accent transition-colors"
            >
              <HiDownload size={18} />
            </a>
          )}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-red-500/50 transition-colors text-lg"
          >
            &times;
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-xl font-bold text-white">{cert.title}</h3>
          <p className="text-gray-300">{cert.issuer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ParticleField({ count = 40 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 5,
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
            background: p.size > 2 ? 'rgba(0, 229, 255, 0.4)' : 'rgba(124, 58, 237, 0.3)',
            boxShadow: p.size > 2 ? '0 0 6px rgba(0, 229, 255, 0.3)' : 'none',
          }}
          animate={{
            y: [-12, 12, -12],
            opacity: [0.15, 0.6, 0.15],
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

function HeroSection({ about }) {
  const heroRef = useRef(null);

  const entrance = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const fadeSlideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A12]"
    >
      {/* Aurora gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-1/3 -left-1/4 w-2/3 h-2/3 rounded-full opacity-[0.12]"
          style={{
            background: 'radial-gradient(circle, #00E5FF 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-3/5 h-3/5 rounded-full opacity-[0.10]"
          style={{
            background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
          animate={{ x: [0, -60, 50, 0], y: [0, 70, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/4 left-1/3 w-1/3 h-1/3 rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, #FF6B9D 0%, transparent 70%)',
            filter: 'blur(90px)',
          }}
          animate={{ x: [0, 50, -60, 0], y: [0, -40, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-1/4 h-1/4 rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #00E5FF 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ x: [0, -40, 30, 0], y: [0, 50, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating glowing orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-64 h-64 rounded-full border border-[#00E5FF]/20"
          style={{ top: '15%', left: '8%' }}
          animate={{
            y: [0, -25, 0, 25, 0],
            x: [0, 15, -10, -15, 0],
            rotate: 360,
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-4 rounded-full bg-[#00E5FF]/5 blur-[40px]" />
        </motion.div>
        <motion.div
          className="absolute w-48 h-48 rounded-full border border-[#7C3AED]/20"
          style={{ bottom: '20%', right: '10%' }}
          animate={{
            y: [0, 20, -15, 0],
            x: [0, -20, 10, 0],
            rotate: -360,
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-3 rounded-full bg-[#7C3AED]/5 blur-[30px]" />
        </motion.div>
        <motion.div
          className="absolute w-32 h-32 rounded-full border border-[#FF6B9D]/15"
          style={{ top: '60%', left: '15%' }}
          animate={{
            y: [0, -15, 10, 0],
            x: [0, 10, -15, 0],
            rotate: 180,
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-2 rounded-full bg-[#FF6B9D]/5 blur-[20px]" />
        </motion.div>
      </div>

      {/* Energy rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full border border-[#00E5FF]/10"
          animate={{ rotate: 360, scale: [1, 1.02, 0.98, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-[#00E5FF]/30 to-transparent" />
        </motion.div>
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full border border-[#7C3AED]/8"
          animate={{ rotate: -360, scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-12 bg-gradient-to-t from-[#7C3AED]/30 to-transparent" />
        </motion.div>
        <motion.div
          className="absolute w-[200px] h-[200px] rounded-full border border-[#FF6B9D]/8"
          animate={{ rotate: 180, scale: [1, 0.96, 1.04, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full bg-[#FF6B9D]/30 blur-[4px]" />
        </motion.div>
      </div>

      {/* Holographic wave */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
        <motion.div
          className="absolute -left-1/4 top-0 w-[150%] h-full"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,229,255,0.3) 40px, rgba(0,229,255,0.3) 41px)',
            transform: 'skewX(-10deg)',
          }}
          animate={{ x: [0, 80, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Light rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-transparent via-[#00E5FF]/15 to-transparent"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-0 left-[35%] w-px h-full bg-gradient-to-b from-transparent via-[#7C3AED]/12 to-transparent"
          animate={{ opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.div
          className="absolute top-0 left-[55%] w-px h-full bg-gradient-to-b from-transparent via-[#00E5FF]/10 to-transparent"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-0 left-[75%] w-px h-full bg-gradient-to-b from-transparent via-[#7C3AED]/12 to-transparent"
          animate={{ opacity: [0.2, 0.55, 0.2] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
        <motion.div
          className="absolute top-0 left-[92%] w-px h-full bg-gradient-to-b from-transparent via-[#FF6B9D]/10 to-transparent"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Floating particles */}
      <ParticleField count={60} />

      {/* Grid overlay */}
      <div className="hero-grid-overlay animate-breathe opacity-[0.03]" />

      <motion.div variants={entrance} initial="hidden" animate="visible" className="relative z-10 text-center max-w-5xl mx-auto px-4">
        <motion.div variants={fadeSlideUp}>
          <motion.span
            className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-accent text-sm font-medium mb-6 backdrop-blur-sm"
            whileHover={{ borderColor: 'rgba(0,229,255,0.4)', scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-2"
            />
            Welcome to my portfolio
          </motion.span>
        </motion.div>

        <motion.h1 variants={fadeSlideUp} className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
          <TypewriterText text={about?.name || "Hi, I'm a Developer"} className="gradient-text" />
        </motion.h1>

        <motion.p variants={fadeSlideUp} className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          {about?.headline || 'Crafting digital experiences with code and creativity'}
        </motion.p>

        <motion.div variants={fadeSlideUp} className="flex flex-wrap justify-center gap-4">
          <motion.a
            href="#projects"
            className="premium-btn text-base px-8 py-3 inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Projects <FiArrowUpRight size={18} />
          </motion.a>
          <motion.a
            href="#contact"
            className="premium-btn-outline text-base px-8 py-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Me
          </motion.a>
        </motion.div>

        {about?.resume_url && (
          <motion.div variants={fadeSlideUp}>
            <a
              href={about.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors mt-8"
            >
              <HiDownload size={16} /> Download Resume
            </a>
          </motion.div>
        )}
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}

function AboutSection({ about, stats }) {
  return (
    <SectionWrapper id="about" bgClass="section-bg-about" background={<SectionBackground variant="about" />}>
      <SectionTitle>About Me</SectionTitle>
      <div className="grid md:grid-cols-5 gap-10 items-center">
        <motion.div
          className="md:col-span-2 flex justify-center"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative group">
            <div className="w-64 h-64 md:w-72 md:h-72 rounded-[18px] overflow-hidden relative">
              <div
                className="absolute -inset-[3px] rounded-[20px] z-0"
                style={{
                  background: 'linear-gradient(135deg, #00E5FF, #7C3AED, #00E5FF)',
                  backgroundSize: '300% 300%',
                  animation: 'shimmer 3s ease-in-out infinite',
                }}
              />
              <div className="absolute inset-[3px] rounded-[16px] bg-[#0A0A12] z-[1]" />
              {about?.profile_image ? (
                <img
                  src={about.profile_image}
                  alt={about.name || 'Profile'}
                  className="absolute inset-[3px] z-[2] w-[calc(100%-6px)] h-[calc(100%-6px)] object-cover rounded-[16px]"
                />
              ) : (
                <div className="absolute inset-[3px] z-[2] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-[16px] bg-gradient-to-br from-accent/10 to-accent-alt/10 flex items-center justify-center">
                  <HiAcademicCap className="text-white/20" size={80} />
                </div>
              )}
            </div>
            <motion.div
              className="absolute -bottom-2 -right-2 w-24 h-24 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.div
          className="md:col-span-3"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-card rounded-[18px] p-8 shadow-glow">
            <h3 className="text-2xl font-bold text-white mb-1">
              {about?.name || 'Your Name'}
            </h3>
            <p className="text-accent font-medium mb-4">
              {about?.headline || 'Professional Title'}
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              {about?.bio || 'No bio available yet.'}
            </p>

            {stats && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-2xl font-bold gradient-text">{stats.years}+</p>
                  <p className="text-xs text-gray-500">Years Exp</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-2xl font-bold gradient-text">{stats.projects}+</p>
                  <p className="text-xs text-gray-500">Projects</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-2xl font-bold gradient-text">{stats.certificates}+</p>
                  <p className="text-xs text-gray-500">Certificates</p>
                </div>
              </div>
            )}

            {about?.resume_url && (
              <motion.a
                href={about.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-btn inline-flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <HiDownload size={18} /> Download Resume
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

function SkillsSection({ skills }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const grouped = useMemo(() => {
    const g = skills.reduce((acc, skill) => {
      const cat = skill.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {});
    return g;
  }, [skills]);

  const categories = useMemo(() => Object.keys(grouped), [grouped]);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  return (
    <SectionWrapper id="skills" className="section-bg-alt" bgClass="section-bg-skills" background={<SectionBackground variant="skills" />}>
      <SectionTitle>Skills & Expertise</SectionTitle>
      {categories.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No skills added yet.</p>
      ) : (
        <div>
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-accent/30 hover:text-white'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {activeCategory && grouped[activeCategory] && (
                <motion.div variants={fadeUp} className="md:col-span-2 card-premium p-8">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <HiCode className="text-accent" size={20} />
                    {activeCategory}
                  </h3>
                  {grouped[activeCategory].map((skill, i) => (
                    <SkillBar
                      key={skill.id || skill.name}
                      name={skill.name}
                      percentage={skill.percentage || 0}
                      index={i}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </SectionWrapper>
  );
}

function ProjectsSection({ projects, projectFilter, setProjectFilter }) {
  const filtered = projectFilter === 'all'
    ? projects
    : projects.filter((p) => p.status === projectFilter);

  return (
    <SectionWrapper id="projects" bgClass="section-bg-projects" background={<SectionBackground variant="projects" />}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <SectionTitle>Featured Projects</SectionTitle>
        <motion.div
          className="flex items-center gap-2 bg-white/5 rounded-[18px] p-1 border border-white/10"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          {['all', 'published'].map((f) => (
            <button
              key={f}
              onClick={() => setProjectFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-[14px] text-sm font-medium transition-all ${
                projectFilter === f
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? <HiFilter size={14} /> : <HiBadgeCheck size={14} />}
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 text-center py-10"
          >
            No projects to display.
          </motion.p>
        ) : (
          <motion.div
            key={projectFilter}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id || project.title} project={project} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}

function ExperienceSection({ experience }) {
  return (
    <SectionWrapper id="experience" className="section-bg-alt" bgClass="section-bg-experience" background={<SectionBackground variant="experience" />}>
      <SectionTitle>Work Experience</SectionTitle>
      {experience.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No experience listed yet.</p>
      ) : (
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent" />
          <div className="space-y-10">
            {experience.map((exp, i) => (
              <TimelineItem key={exp.id || i} exp={exp} index={i} />
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}

function EducationSection({ education }) {
  return (
    <SectionWrapper id="education" bgClass="section-bg-education" background={<SectionBackground variant="education" />}>
      <SectionTitle>Education</SectionTitle>
      {education.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No education entries yet.</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {education.map((edu, i) => (
            <motion.div
              key={edu.id || i}
              variants={fadeUp}
              className="card-premium p-6"
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <HiAcademicCap className="text-accent" size={24} />
              </div>
              <h3 className="font-bold text-white mb-1">{edu.degree}</h3>
              <p className="text-accent font-medium text-sm">{edu.institution}</p>
              {edu.field && (
                <p className="text-gray-500 text-xs mt-1">{edu.field}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                {edu.start_date && new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                {' — '}
                {edu.end_date ? new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </SectionWrapper>
  );
}

function CertificatesSection({ certificates }) {
  const [lightboxCert, setLightboxCert] = useState(null);

  return (
    <SectionWrapper id="certificates" className="section-bg-alt" bgClass="section-bg-certificates" background={<SectionBackground variant="certificates" />}>
      <SectionTitle>Certificates</SectionTitle>
      {certificates.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No certificates yet.</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.id || cert.title}
              cert={cert}
              onView={setLightboxCert}
            />
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {lightboxCert && (
          <CertificateLightbox cert={lightboxCert} onClose={() => setLightboxCert(null)} />
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}

function ContactSection({ contact }) {
  return (
    <SectionWrapper id="contact" bgClass="section-bg-contact" background={<SectionBackground variant="contact" />}>
      <SectionTitle>Get In Touch</SectionTitle>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative rounded-[18px] p-[2px] overflow-hidden">
          <motion.div
            className="absolute inset-0 rounded-[18px]"
            style={{
              background: 'linear-gradient(135deg, #00E5FF, #7C3AED, #00E5FF)',
              backgroundSize: '300% 300%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          <div className="relative glass-card rounded-[16px] p-8 md:p-10 text-center" style={{ background: 'rgba(26,26,46,0.9)' }}>
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent-alt flex items-center justify-center mx-auto mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <HiMail className="text-white" size={28} />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">Let's work together</h3>
            <p className="text-gray-400 mb-8">
              Have a project in mind or just want to say hi? I'd love to hear from you.
            </p>

            <div className="space-y-4 text-left">
              {contact?.email && (
                <motion.a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-4 p-4 rounded-[14px] bg-white/5 border border-white/10 hover:border-accent/30 transition-all group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <HiMail className="text-accent" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-white">{contact.email}</p>
                  </div>
                </motion.a>
              )}
              {contact?.phone && (
                <motion.a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-4 p-4 rounded-[14px] bg-white/5 border border-white/10 hover:border-accent/30 transition-all group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <HiPhone className="text-accent" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-white">{contact.phone}</p>
                  </div>
                </motion.a>
              )}
              {contact?.address && (
                <div className="flex items-center gap-4 p-4 rounded-[14px] bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <HiLocationMarker className="text-accent" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-white">{contact.address}</p>
                  </div>
                </div>
              )}
            </div>

            {(contact?.github || contact?.linkedin || contact?.twitter) && (
              <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-white/10">
                {contact.github && (
                  <motion.a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/30"
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiGithub size={20} />
                  </motion.a>
                )}
                {contact.linkedin && (
                  <motion.a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/30"
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiLinkedin size={20} />
                  </motion.a>
                )}
                {contact.twitter && (
                  <motion.a
                    href={contact.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/30"
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiTwitter size={20} />
                  </motion.a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}

export default function Home() {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectFilter, setProjectFilter] = useState('all');

  useEffect(() => {
    analyticsAPI.track().catch(() => {});
    Promise.all([
      aboutAPI.get().then((r) => setAbout(Array.isArray(r.data) ? r.data[0] : r.data)),
      skillsAPI.get().then((r) => setSkills(Array.isArray(r.data) ? r.data : [])),
      projectsAPI.get().then((r) => setProjects(Array.isArray(r.data) ? r.data : [])),
      certificatesAPI.get().then((r) => setCertificates(Array.isArray(r.data) ? r.data : [])),
      educationAPI.get().then((r) => setEducation(Array.isArray(r.data) ? r.data : [])),
      experienceAPI.get().then((r) => setExperience(Array.isArray(r.data) ? r.data : [])),
      contactAPI.get().then((r) => setContact(r.data)),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const years = about?.start_year ? new Date().getFullYear() - about.start_year : 0;
    return {
      years: years || Math.floor(Math.random() * 5) + 2,
      projects: projects.length,
      certificates: certificates.length,
    };
  }, [about, projects, certificates]);

  if (loading) return <LoadingScreen />;

  return (
    <main>
      <HeroSection about={about} />

      <AboutSection about={about} stats={stats} />

      <SkillsSection skills={skills} />

      <ProjectsSection
        projects={projects}
        projectFilter={projectFilter}
        setProjectFilter={setProjectFilter}
      />

      <ExperienceSection experience={experience} />

      <EducationSection education={education} />

      <CertificatesSection certificates={certificates} />

      <ContactSection contact={contact} />
    </main>
  );
}
