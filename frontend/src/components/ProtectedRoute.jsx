import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary-text">Loading...</p>
        </div>
      </div>
    );
  }
  if (!admin) return <Navigate to="/jg-admin/login" replace />;
  return children;
}
