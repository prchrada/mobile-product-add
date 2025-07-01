
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, isSeller, isBuyer } from '@/utils/userAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredUserType?: 'buyer' | 'seller';
}

const AuthGuard = ({ children, requiredUserType }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // If specific user type is required and user doesn't match
    if (requiredUserType) {
      if (requiredUserType === 'seller' && !isSeller()) {
        navigate('/');
        return;
      }
      if (requiredUserType === 'buyer' && !isBuyer()) {
        navigate('/');
        return;
      }
    }
  }, [currentUser, requiredUserType, navigate, location.pathname]);

  // Don't render children if user is not authenticated or doesn't have required permissions
  if (!currentUser) {
    return null;
  }

  if (requiredUserType && requiredUserType === 'seller' && !isSeller()) {
    return null;
  }

  if (requiredUserType && requiredUserType === 'buyer' && !isBuyer()) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
