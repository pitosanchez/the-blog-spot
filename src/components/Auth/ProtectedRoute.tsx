import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'reader' | 'contributor' | 'moderator' | 'admin';
  requireContributor?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  requireContributor = false 
}: ProtectedRouteProps) {
  const { state } = useApp();
  const location = useLocation();

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && state.user) {
    const roleHierarchy = {
      reader: 0,
      contributor: 1,
      moderator: 2,
      admin: 3,
    };

    const userRoleLevel = roleHierarchy[state.user.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredRoleLevel) {
      return <Navigate to="/" replace />;
    }
  }

  if (requireContributor && state.user?.role === 'reader') {
    return <Navigate to="/become-creator" replace />;
  }

  return <>{children}</>;
}