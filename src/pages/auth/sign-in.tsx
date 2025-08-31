import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { mockAuth } from '@/lib/mock-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Lock, Eye, EyeOff, Github, Loader2, CheckCircle } from 'lucide-react'
import { Navigation } from '@/components/ui/navigation'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/admin'

  // Check if user is already authenticated on page load
  useEffect(() => {
    const checkAuth = async () => {
      const user = await mockAuth.getCurrentUser()
      if (user) {
        navigate(redirectTo)
      }
    }
    checkAuth()
  }, [navigate, redirectTo])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const { user, error: authError } = await mockAuth.signIn(email, password)

      if (authError) {
        setError(authError)
        return
      }

      if (user) {
        setSuccess('Sign in successful! Redirecting...')
        setTimeout(() => {
          navigate(redirectTo)
        }, 1500)
      }
    } catch (err: any) {
      setError('An unexpected error occurred')
      console.error('Sign in error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const { user, error: authError } = await mockAuth.signIn('admin@tts.ca', 'admin123')

      if (authError) {
        setError(authError)
        return
      }

      if (user) {
        setSuccess('Demo login successful! Redirecting...')
        setTimeout(() => {
          navigate(redirectTo)
        }, 1500)
      }
    } catch (err: any) {
      setError('Demo login failed')
      console.error('Demo login error:', err)
    } finally {
      setIsLoading(false)
    }
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
              <CardTitle className="text-2xl font-bold">Admin Sign In</CardTitle>
              <CardDescription>
                Sign in to access the admin panel
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@tts.ca"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:bg-gradient-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Demo login for development */}
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Development Mode
                    </span>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground mb-3">
                  Use <strong>admin@tts.ca</strong> / <strong>admin123</strong> or click demo login
                </div>

                <Button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Demo Login (Admin Access)'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
