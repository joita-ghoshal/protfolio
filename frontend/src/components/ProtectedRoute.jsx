import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A12]">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#00E5FF]/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00E5FF] animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#7C3AED] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          </div>
          <p className="text-[#94A3B8] text-sm">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/jg-admin/login" state={{ from: location }} replace />;
  }

  return children;
}
