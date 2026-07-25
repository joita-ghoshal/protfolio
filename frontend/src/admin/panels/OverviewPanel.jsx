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
  { label: 'Total Visitors', count: '—', icon: FiBarChart2, color: 'text-[#00E5FF] bg-[#00E5FF]/10' },
  { label: 'Total Views', count: '—', icon: FiBarChart2, color: 'text-[#10B981] bg-[#10B981]/10' },
  { label: 'Monthly Visitors', count: '—', icon: FiBarChart2, color: 'text-[#7C3AED] bg-[#7C3AED]/10' },
  { label: 'Projects', count: '—', icon: FiFolder, color: 'text-[#F59E0B] bg-[#F59E0B]/10' },
  { label: 'Skills', count: '—', icon: FiCode, color: 'text-[#00E5FF] bg-[#00E5FF]/10' },
  { label: 'Messages', count: '—', icon: FiMail, color: 'text-[#EF4444] bg-[#EF4444]/10' },
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
          { label: 'Total Visitors', count: s.totalVisitors ?? s.total_visitors ?? '—', icon: FiUsers || FiBarChart2, color: 'text-[#00E5FF] bg-[#00E5FF]/10' },
          { label: 'Total Views', count: s.totalViews ?? s.total_views ?? '—', icon: FiEye || FiBarChart2, color: 'text-[#10B981] bg-[#10B981]/10' },
          { label: 'Monthly Visitors', count: s.monthlyVisitors ?? s.monthly_visitors ?? '—', icon: FiGlobe || FiBarChart2, color: 'text-[#7C3AED] bg-[#7C3AED]/10' },
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
          <div className="w-14 h-14 rounded-2xl bg-[#00E5FF]/10 flex items-center justify-center"><FiGrid className="w-7 h-7 text-[#00E5FF]" /></div>
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back, {admin?.username || 'Admin'}!</h2>
            <p className="text-[#94A3B8] text-sm">Here's an overview of your portfolio</p>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <motion.div variants={cont} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label + i} variants={child} className="flex items-center gap-4 p-5 rounded-xl bg-[#0D0D1A]">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.count}</p>
                  <p className="text-[#94A3B8] text-sm">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="admin-card p-8 md:p-10">
        <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
        <motion.div variants={cont} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <motion.button
              key={link.path}
              variants={child}
              onClick={() => navigate(`/jg-admin/${link.path}`)}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#0D0D1A] hover:bg-[#00E5FF]/5 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center shrink-0">
                <link.icon className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{link.label}</p>
                <p className="text-xs text-[#94A3B8] truncate">{link.desc}</p>
              </div>
              <FiArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#00E5FF] transition-colors shrink-0" />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
