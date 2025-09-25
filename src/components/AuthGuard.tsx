import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      // Redirect to sign-in page, but remember where they wanted to go
      navigate('/sign-in', {
        state: { redirectTo: location.pathname }
      });
    }
  }, [navigate, location.pathname]);

  // Only render children if authenticated
  if (!auth.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}
