import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from '../components/common';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
  exp: number;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!token) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      
      if (!allowedRoles.includes(decoded.role)) {
        return (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Unauthorized</h1>
            <p>You don't have permission to access this page.</p>
          </div>
        );
      }
    } catch (error) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
