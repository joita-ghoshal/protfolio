import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  aboutAPI, skillsAPI, projectsAPI, certificatesAPI,
  educationAPI, experienceAPI, contactAPI, analyticsAPI
} from '../services/api';
import SectionWrapper from '../components/SectionWrapper';
import {
  HiDownload, HiExternalLink, HiCode, HiAcademicCap,
  HiBriefcase, HiBadgeCheck, HiMail, HiPhone, HiLocationMarker,
  HiFilter
} from 'react-icons/hi';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

function Spinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <motion.div
        className="w-12 h-12 border-4 border-border border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
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
      <h2 className="section-title gradient-text">{children}</h2>
    </motion.div>
  );
}

function staggerContainer(delay = 0.1) {
  return {
    hidden: {},
    show: { transition: { staggerChildren: delay } },
  };
}

function fadeUpChild() {
  return {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };
}

function FloatingShape({ className, delay = 0, duration = 6 }) {
  return (
    <motion.div
      className={`absolute rounded-full opacity-20 ${className}`}
      animate={{ y: [-20, 20, -20], rotate: [0, 10, -10, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    />
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
      aboutAPI.get().then((r) => setAbout(r.data)),
      skillsAPI.get().then((r) => setSkills(Array.isArray(r.data) ? r.data : [])),
      projectsAPI.get().then((r) => setProjects(Array.isArray(r.data) ? r.data : [])),
      certificatesAPI.get().then((r) => setCertificates(Array.isArray(r.data) ? r.data : [])),
      educationAPI.get().then((r) => setEducation(Array.isArray(r.data) ? r.data : [])),
      experienceAPI.get().then((r) => setExperience(Array.isArray(r.data) ? r.data : [])),
      contactAPI.get().then((r) => setContact(r.data)),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const filteredProjects = projectFilter === 'all'
    ? projects
    : projects.filter((p) => p.status === projectFilter);

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <main>
      {/* ───── HERO ───── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#F0F9FF] to-white"
      >
        <div className="absolute inset-0 pointer-events-none">
          <FloatingShape className="w-72 h-72 bg-primary top-10 left-[10%]" delay={0} duration={7} />
          <FloatingShape className="w-48 h-48 bg-accent top-[30%] right-[15%]" delay={1.5} duration={5} />
          <FloatingShape className="w-56 h-56 bg-primary/30 bottom-[20%] left-[20%]" delay={3} duration={8} />
          <FloatingShape className="w-40 h-40 bg-accent/30 bottom-[10%] right-[25%]" delay={2} duration={6} />
          <FloatingShape className="w-32 h-32 bg-primary/20 top-[60%] left-[5%]" delay={4} duration={9} />

          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{ y: [-15, 15, -15], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.span
              className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Welcome to my portfolio
            </motion.span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <span className="gradient-text">
              {about?.name || 'Hi, I\'m'}
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-secondary-text max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {about?.headline || 'Crafting digital experiences with code and creativity'}
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <a href="#projects" className="premium-btn text-base px-8 py-3">
              View Projects
            </a>
            <a href="#contact" className="premium-btn-outline text-base px-8 py-3">
              Get In Touch
            </a>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-3 rounded-full bg-primary"
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ───── ABOUT ───── */}
      <SectionWrapper id="about" className="bg-white">
        <SectionTitle>About Me</SectionTitle>
        <div className="grid md:grid-cols-5 gap-10 items-center">
          <motion.div
            className="md:col-span-2 flex justify-center"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-72 md:h-72 rounded-[18px] overflow-hidden border-4 border-white shadow-premium">
                {about?.profile_image_url ? (
                  <img
                    src={about.profile_image_url}
                    alt={about.name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <HiAcademicCap className="text-primary/40" size={80} />
                  </div>
                )}
              </div>
              <motion.div
                className="absolute -bottom-3 -right-3 w-20 h-20 bg-accent/20 rounded-full blur-xl"
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
            <div className="glass-card rounded-[18px] p-8 shadow-premium">
              <h3 className="text-2xl font-bold text-primary-text mb-1">
                {about?.name || 'Your Name'}
              </h3>
              <p className="text-accent font-medium mb-4">
                {about?.headline || 'Professional Title'}
              </p>
              <p className="text-secondary-text leading-relaxed mb-6">
                {about?.bio || 'No bio available yet.'}
              </p>
              {about?.resume_url && (
                <a
                  href={about.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-btn inline-flex items-center gap-2"
                >
                  <HiDownload size={18} /> Download Resume
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* ───── SKILLS ───── */}
      <SectionWrapper id="skills" className="bg-secondary-bg">
        <SectionTitle>Skills & Expertise</SectionTitle>
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {Object.entries(groupedSkills).map(([category, catSkills]) => (
            <motion.div key={category} variants={fadeUpChild()} className="card-premium p-6">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                <HiCode className="text-accent" size={20} />
                {category}
              </h3>
              <div className="space-y-4">
                {catSkills.map((skill) => {
                  const SkillBar = ({ inView }) => (
                    <div key={skill._id || skill.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-primary-text">{skill.name}</span>
                        <span className="text-secondary-text">{skill.percentage || 0}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.percentage || 0}%` } : { width: 0 }}
                          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                  return <SkillBarObserver key={skill._id || skill.name} render={SkillBar} />;
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
        {Object.keys(groupedSkills).length === 0 && (
          <p className="text-secondary-text text-center py-10">No skills added yet.</p>
        )}
      </SectionWrapper>

      {/* ───── PROJECTS ───── */}
      <SectionWrapper id="projects" className="bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <SectionTitle>Featured Projects</SectionTitle>
          <motion.div
            className="flex items-center gap-2 bg-gray-50 rounded-[18px] p-1 border border-border"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setProjectFilter('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-[14px] text-sm font-medium transition-all ${
                projectFilter === 'all' ? 'bg-white shadow-soft text-primary' : 'text-secondary-text hover:text-primary'
              }`}
            >
              <HiFilter size={14} /> All
            </button>
            <button
              onClick={() => setProjectFilter('published')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-[14px] text-sm font-medium transition-all ${
                projectFilter === 'published' ? 'bg-white shadow-soft text-primary' : 'text-secondary-text hover:text-primary'
              }`}
            >
              <HiBadgeCheck size={14} /> Published
            </button>
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project._id || project.title}
              variants={fadeUpChild()}
              className="card-premium overflow-hidden group"
            >
              <div className="relative overflow-hidden h-48">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <HiCode className="text-primary/30" size={48} />
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full shadow-lg">
                    Featured
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4 gap-2">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-primary hover:bg-white transition-colors">
                      <FiGithub size={16} />
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-primary hover:bg-white transition-colors">
                      <HiExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-primary-text mb-1 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-secondary-text line-clamp-2 mb-3">
                  {project.description || ''}
                </p>
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 bg-gray-50 text-xs text-secondary-text rounded-full border border-border">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        {filteredProjects.length === 0 && (
          <p className="text-secondary-text text-center py-10">No projects to display.</p>
        )}
      </SectionWrapper>

      {/* ───── EXPERIENCE ───── */}
      <SectionWrapper id="experience" className="bg-secondary-bg">
        <SectionTitle>Work Experience</SectionTitle>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20" />
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-10"
          >
            {experience.map((exp, index) => (
              <motion.div
                key={exp._id || index}
                variants={fadeUpChild()}
                className="relative pl-12 md:pl-16"
              >
                <motion.div
                  className="absolute left-2 md:left-6 top-1 w-5 h-5 rounded-full bg-white border-4 border-primary shadow-md"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                />
                <div className="card-premium p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-0.5 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                      {exp.type || 'Work'}
                    </span>
                    {exp.current && (
                      <span className="px-3 py-0.5 bg-green-50 text-green-600 text-xs font-semibold rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-primary-text">{exp.role || exp.title}</h3>
                  <p className="text-primary font-medium text-sm">{exp.company}</p>
                  <p className="text-secondary-text text-xs mt-1">
                    {exp.start_date && new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    {' — '}
                    {exp.current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
                  </p>
                  {exp.description && (
                    <p className="text-secondary-text text-sm mt-3 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
          {experience.length === 0 && (
            <p className="text-secondary-text text-center py-10">No experience listed yet.</p>
          )}
        </div>
      </SectionWrapper>

      {/* ───── EDUCATION ───── */}
      <SectionWrapper id="education" className="bg-white">
        <SectionTitle>Education</SectionTitle>
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {education.map((edu, index) => (
            <motion.div
              key={edu._id || index}
              variants={fadeUpChild()}
              className="card-premium p-6"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <HiAcademicCap className="text-primary" size={24} />
              </div>
              <h3 className="font-bold text-primary-text mb-1">{edu.degree}</h3>
              <p className="text-primary font-medium text-sm">{edu.institution}</p>
              {edu.field && (
                <p className="text-secondary-text text-xs mt-1">{edu.field}</p>
              )}
              <p className="text-secondary-text text-xs mt-2">
                {edu.start_date && new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                {' — '}
                {edu.end_date ? new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}
              </p>
            </motion.div>
          ))}
        </motion.div>
        {education.length === 0 && (
          <p className="text-secondary-text text-center py-10">No education entries yet.</p>
        )}
      </SectionWrapper>

      {/* ───── CERTIFICATES ───── */}
      <SectionWrapper id="certificates" className="bg-secondary-bg">
        <SectionTitle>Certificates</SectionTitle>
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {certificates.map((cert) => (
            <motion.div
              key={cert._id || cert.title}
              variants={fadeUpChild()}
              className="card-premium overflow-hidden group"
            >
              <div className="h-44 overflow-hidden bg-gray-50">
                {cert.image_url ? (
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiBadgeCheck className="text-primary/30" size={56} />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-primary-text mb-1">{cert.title}</h3>
                <p className="text-sm text-secondary-text mb-3">{cert.issuer}</p>
                {cert.pdf_url && (
                  <a
                    href={cert.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="premium-btn inline-flex items-center gap-2 text-sm px-4 py-2"
                  >
                    <HiDownload size={15} /> PDF
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        {certificates.length === 0 && (
          <p className="text-secondary-text text-center py-10">No certificates yet.</p>
        )}
      </SectionWrapper>

      {/* ───── CONTACT ───── */}
      <SectionWrapper id="contact" className="bg-white">
        <SectionTitle>Get In Touch</SectionTitle>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-card rounded-[18px] p-8 md:p-10 shadow-premium text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
              <HiMail className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-primary-text mb-2">Let's work together</h3>
            <p className="text-secondary-text mb-8">
              Have a project in mind or just want to say hi? I'd love to hear from you.
            </p>

            <div className="space-y-4 text-left">
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-4 p-4 rounded-[14px] bg-gray-50 border border-border hover:border-primary/20 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <HiMail className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-text">Email</p>
                    <p className="text-sm font-medium text-primary-text">{contact.email}</p>
                  </div>
                </a>
              )}
              {contact?.phone && (
                <a href={`tel:${contact.phone}`} className="flex items-center gap-4 p-4 rounded-[14px] bg-gray-50 border border-border hover:border-primary/20 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <HiPhone className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-text">Phone</p>
                    <p className="text-sm font-medium text-primary-text">{contact.phone}</p>
                  </div>
                </a>
              )}
              {contact?.address && (
                <div className="flex items-center gap-4 p-4 rounded-[14px] bg-gray-50 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <HiLocationMarker className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-text">Location</p>
                    <p className="text-sm font-medium text-primary-text">{contact.address}</p>
                  </div>
                </div>
              )}
            </div>

            {(contact?.github || contact?.linkedin || contact?.twitter) && (
              <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-border">
                {contact.github && (
                  <a href={contact.github} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gray-50 border border-border flex items-center justify-center text-secondary-text hover:text-primary hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                    <FiGithub size={20} />
                  </a>
                )}
                {contact.linkedin && (
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gray-50 border border-border flex items-center justify-center text-secondary-text hover:text-primary hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                    <FiLinkedin size={20} />
                  </a>
                )}
                {contact.twitter && (
                  <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gray-50 border border-border flex items-center justify-center text-secondary-text hover:text-primary hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                    <FiTwitter size={20} />
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </SectionWrapper>
    </main>
  );
}

function SkillBarObserver({ render: Render }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return <div ref={ref}>{Render({ inView })}</div>;
}
