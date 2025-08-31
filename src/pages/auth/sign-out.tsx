import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { LogOut, CheckCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/ui/navigation'

export default function SignOut() {
  const [isSigningOut, setIsSigningOut] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const signOut = async () => {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        // Clear any local storage or session data
        localStorage.clear()
        sessionStorage.clear()

        // Redirect to home after a short delay
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } catch (error: any) {
        setError(error.message || 'An error occurred during sign out')
      } finally {
        setIsSigningOut(false)
      }
    }

    signOut()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <Card className="glass">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {isSigningOut ? (
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                ) : error ? (
                  <LogOut className="h-12 w-12 text-red-500" />
                ) : (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold">
                {isSigningOut ? 'Signing Out...' : error ? 'Sign Out Failed' : 'Signed Out Successfully'}
              </CardTitle>
              <CardDescription>
                {isSigningOut
                  ? 'Please wait while we sign you out...'
                  : error
                    ? error
                    : 'You have been successfully signed out. Redirecting to home...'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center">
              {!isSigningOut && !error && (
                <div className="space-y-4">
                  <div className="animate-pulse text-sm text-muted-foreground">
                    Redirecting to home page...
                  </div>
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Go to Home
                  </Button>
                </div>
              )}

              {error && (
                <div className="space-y-4">
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Go to Home
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
