import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { mockAuth } from '@/lib/mock-auth'
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
        const user = await mockAuth.getCurrentUser()

        if (!user) {
          setIsAuthenticated(false)
          navigate('/auth/sign-in', {
            state: { redirectTo: location.pathname }
          })
          return
        }

        setIsAuthenticated(true)

        // Check if user has admin role
        const isAdmin = await mockAuth.checkAdminAccess()
        if (!isAdmin) {
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
