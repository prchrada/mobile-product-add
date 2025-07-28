
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, getCurrentSession, isSeller, isBuyer, initializeAuth } from '@/utils/userAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredUserType?: 'buyer' | 'seller';
}

const AuthGuard = ({ children, requiredUserType }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await initializeAuth();
      setCurrentUser(getCurrentUser());
      setIsLoading(false);
    };
    
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;

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
  }, [currentUser, requiredUserType, navigate, location.pathname, isLoading]);

  // Show loading while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="text-white text-lg">กำลังโหลด...</div>
      </div>
    );
  }

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
