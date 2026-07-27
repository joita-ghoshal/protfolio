import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollExperience from './components/ScrollExperience';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/jg-admin');
  const isHome = location.pathname === '/';

  return (
    <ErrorBoundary>
      {!isAdmin && <Navbar />}
      {isHome && <ScrollExperience />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/jg-admin/login" element={<AdminLogin />} />
          <Route
            path="/jg-admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Home />} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && <Footer />}
    </ErrorBoundary>
  );
}
