import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiUser, FiFolder, FiCode, FiAward, FiBook, FiBriefcase, FiMail, FiBarChart2, FiSettings, FiArrowRight } from 'react-icons/fi';
import { analyticsAPI } from '../../services/api';

const quickLinks = [
  { path: 'profile', label: 'Profile', icon: FiUser, desc: 'Manage your personal info' },
  { path: 'projects', label: 'Projects', icon: FiFolder, desc: 'Manage your projects' },
  { path: 'skills', label: 'Skills', icon: FiCode, desc: 'Manage your skills' },
  { path: 'certificates', label: 'Certificates', icon: FiAward, desc: 'Manage certificates' },
  { path: 'education', label: 'Education', icon: FiBook, desc: 'Manage education' },
  { path: 'experience', label: 'Experience', icon: FiBriefcase, desc: 'Manage experience' },
  { path: 'contact', label: 'Contact', icon: FiMail, desc: 'Manage contact info' },
  { path: 'analytics', label: 'Analytics', icon: FiBarChart2, desc: 'View analytics' },
  { path: 'settings', label: 'Settings', icon: FiSettings, desc: 'Configure settings' },
];

const defaultStats = [
  { label: 'Total Visitors', count: '—', icon: FiBarChart2, color: 'text-blue-600 bg-blue-100' },
  { label: 'Total Views', count: '—', icon: FiBarChart2, color: 'text-green-600 bg-green-100' },
  { label: 'Monthly Visitors', count: '—', icon: FiBarChart2, color: 'text-purple-600 bg-purple-100' },
  { label: 'Projects', count: '—', icon: FiFolder, color: 'text-amber-600 bg-amber-100' },
  { label: 'Skills', count: '—', icon: FiCode, color: 'text-cyan-600 bg-cyan-100' },
  { label: 'Messages', count: '—', icon: FiMail, color: 'text-rose-600 bg-rose-100' },
];

export default function OverviewPanel() {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await analyticsAPI.summary();
      const s = data?.summary || data?.data || data;
      if (s) {
        setStats([
          { label: 'Total Visitors', count: s.totalVisitors ?? s.total_visitors ?? '—', icon: FiUsers || FiBarChart2, color: 'text-blue-600 bg-blue-100' },
          { label: 'Total Views', count: s.totalViews ?? s.total_views ?? '—', icon: FiEye || FiBarChart2, color: 'text-green-600 bg-green-100' },
          { label: 'Monthly Visitors', count: s.monthlyVisitors ?? s.monthly_visitors ?? '—', icon: FiGlobe || FiBarChart2, color: 'text-purple-600 bg-purple-100' },
          ...stats.slice(3),
        ]);
      }
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const cont = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const child = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="admin-card p-8 md:p-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"><FiGrid className="w-7 h-7 text-primary" /></div>
          <div>
            <h2 className="text-2xl font-bold text-primary-text">Welcome back, {admin?.username || 'Admin'}!</h2>
            <p className="text-secondary-text text-sm">Here's an overview of your portfolio</p>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <motion.div variants={cont} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label + i} variants={child} className="flex items-center gap-4 p-5 rounded-xl bg-secondary-bg">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-text">{stat.count}</p>
                  <p className="text-secondary-text text-sm">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="admin-card p-8 md:p-10">
        <h3 className="text-lg font-semibold text-primary-text mb-6">Quick Links</h3>
        <motion.div variants={cont} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <motion.button
              key={link.path}
              variants={child}
              onClick={() => navigate(`/jg-admin/${link.path}`)}
              className="flex items-center gap-4 p-4 rounded-xl bg-secondary-bg hover:bg-primary/5 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <link.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-primary-text text-sm">{link.label}</p>
                <p className="text-xs text-secondary-text truncate">{link.desc}</p>
              </div>
              <FiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
