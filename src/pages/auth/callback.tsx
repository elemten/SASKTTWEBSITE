import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/ui/navigation'

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/admin'

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth error:', error)
          setStatus('error')
          setMessage(error.message)
          return
        }

        if (data.session) {
          // Check if user is in admin allowlist
          const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
          const userEmail = data.session.user.email

          if (!userEmail || !adminEmails.includes(userEmail)) {
            setStatus('error')
            setMessage('Access denied. Your email is not authorized for admin access.')
            return
          }

          setStatus('success')
          setMessage('Authentication successful! Redirecting...')

          // Redirect after a short delay
          setTimeout(() => {
            navigate(redirectTo)
          }, 1500)
        } else {
          setStatus('error')
          setMessage('No active session found')
        }
      } catch (error: any) {
        console.error('Callback error:', error)
        setStatus('error')
        setMessage('An error occurred during authentication')
      }
    }

    handleAuthCallback()
  }, [navigate, redirectTo])

  const handleRetry = () => {
    navigate('/auth/sign-in')
  }

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
                {status === 'loading' && (
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                )}
                {status === 'success' && (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                )}
                {status === 'error' && (
                  <XCircle className="h-12 w-12 text-red-500" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold">
                {status === 'loading' && 'Processing...'}
                {status === 'success' && 'Success!'}
                {status === 'error' && 'Authentication Failed'}
              </CardTitle>
              <CardDescription>
                {message}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center">
              {status === 'error' && (
                <Button onClick={handleRetry} className="w-full">
                  Try Again
                </Button>
              )}

              {status === 'success' && (
                <div className="space-y-4">
                  <div className="animate-pulse text-sm text-muted-foreground">
                    Redirecting to admin panel...
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/admin')}
                    className="w-full"
                  >
                    Continue to Admin
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
