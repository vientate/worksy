import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children, roles = [] }) {
  const { user } = useAuth();  // тут должно быть user, а не currentUser

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
