import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check Supabase session first
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // Fallback to mock auth for local testing
      if (auth.isAuthenticated()) {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // Not authenticated - redirect to sign-in
      navigate('/sign-in', {
        state: { redirectTo: location.pathname }
      });
      setIsChecking(false);
    };

    checkAuth();
  }, [navigate, location.pathname]);

  // Show nothing while checking
  if (isChecking) {
    return null;
  }

  // Only render children if authorized
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
