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
        console.log('AuthGuard: Checking authentication for path:', location.pathname)
        const user = await mockAuth.getCurrentUser()
        console.log('AuthGuard: User check result:', user)

        if (!user) {
          console.log('AuthGuard: No user found, redirecting to sign-in')
          setIsAuthenticated(false)
          navigate('/auth/sign-in', {
            state: { redirectTo: location.pathname }
          })
          return
        }

        setIsAuthenticated(true)
        console.log('AuthGuard: User authenticated, checking admin access')

        // Check if user has admin role
        const isAdmin = await mockAuth.checkAdminAccess()
        console.log('AuthGuard: Admin check result:', isAdmin)

        if (!isAdmin) {
          console.log('AuthGuard: User is not admin, redirecting to forbidden')
          setIsAuthorized(false)
          navigate('/auth/forbidden')
          return
        }

        console.log('AuthGuard: User is authorized admin')
        setIsAuthorized(true)
      } catch (error) {
        console.error('AuthGuard: Auth check failed:', error)
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
