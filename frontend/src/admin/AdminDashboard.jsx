import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiUser, FiFolder, FiCode, FiAward, FiBook,
  FiBriefcase, FiMail, FiBarChart2, FiSettings, FiLogOut,
  FiMenu, FiX
} from 'react-icons/fi';
import OverviewPanel from './panels/OverviewPanel';
import ProfilePanel from './panels/ProfilePanel';
import ProjectsPanel from './panels/ProjectsPanel';
import SkillsPanel from './panels/SkillsPanel';
import CertificatesPanel from './panels/CertificatesPanel';
import EducationPanel from './panels/EducationPanel';
import ExperiencePanel from './panels/ExperiencePanel';
import ContactPanel from './panels/ContactPanel';
import AnalyticsPanel from './panels/AnalyticsPanel';
import SettingsPanel from './panels/SettingsPanel';

const panels = [
  { path: '', label: 'Overview', icon: FiGrid },
  { path: 'profile', label: 'Profile', icon: FiUser },
  { path: 'projects', label: 'Projects', icon: FiFolder },
  { path: 'skills', label: 'Skills', icon: FiCode },
  { path: 'certificates', label: 'Certificates', icon: FiAward },
  { path: 'education', label: 'Education', icon: FiBook },
  { path: 'experience', label: 'Experience', icon: FiBriefcase },
  { path: 'contact', label: 'Contact', icon: FiMail },
  { path: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  { path: 'settings', label: 'Settings', icon: FiSettings },
];

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/jg-admin/login');
  };

  const isActive = (path) => {
    if (!path) return location.pathname === '/jg-admin' || location.pathname === '/jg-admin/';
    return location.pathname.startsWith(`/jg-admin/${path}`);
  };

  const handleNav = (path) => {
    navigate(`/jg-admin/${path}`);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-secondary-bg flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar fixed lg:static inset-y-0 left-0 z-50 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
          <h1 className="text-xl font-bold text-white tracking-tight">JG Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white/60 hover:text-white lg:hidden transition-colors"
          >
            <FiX size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {panels.map(({ path, label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => handleNav(path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive(path)
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
            >
              <Icon size={18} className="shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
              text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <FiLogOut size={18} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#12121E] border-b border-white/[0.06] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
            >
              <FiMenu size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-[#94A3B8]">
              <span className="hidden md:inline">Dashboard</span>
              <span className="hidden md:inline">/</span>
              <span className="text-white font-medium">
                {panels.find((p) => isActive(p.path))?.label || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 flex items-center justify-center">
                <FiUser className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <span className="text-sm font-medium text-white hidden sm:block">
                {admin?.username || 'Admin'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="premium-btn-outline !py-2 !px-4 text-sm flex items-center gap-2"
            >
              <FiLogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 bg-[#0A0A12] overflow-y-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route index element={<OverviewPanel />} />
              <Route path="profile" element={<ProfilePanel />} />
              <Route path="projects" element={<ProjectsPanel />} />
              <Route path="skills" element={<SkillsPanel />} />
              <Route path="certificates" element={<CertificatesPanel />} />
              <Route path="education" element={<EducationPanel />} />
              <Route path="experience" element={<ExperiencePanel />} />
              <Route path="contact" element={<ContactPanel />} />
              <Route path="analytics" element={<AnalyticsPanel />} />
              <Route path="settings" element={<SettingsPanel />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
