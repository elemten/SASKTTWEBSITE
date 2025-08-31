import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          setIsAuthenticated(false)
          navigate('/auth/sign-in', {
            state: { redirectTo: location.pathname }
          })
          return
        }

        setIsAuthenticated(true)

        // Check if user is in admin allowlist
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
        const userEmail = user.email

        if (!userEmail || !adminEmails.includes(userEmail)) {
          setIsAuthorized(false)
          navigate('/auth/forbidden')
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
        navigate('/auth/sign-in', {
          state: { redirectTo: location.pathname }
        })
      }
    }

    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false)
        navigate('/auth/sign-in', {
          state: { redirectTo: location.pathname }
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate, location.pathname])

  // Show loading spinner while checking authentication
  if (isAuthenticated === null || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Show children if authenticated and authorized
  if (isAuthenticated && isAuthorized) {
    return <>{children}</>
  }

  // This shouldn't be reached, but just in case
  return null
}
