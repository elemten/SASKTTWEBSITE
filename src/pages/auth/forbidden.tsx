import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldX, ArrowLeft } from 'lucide-react'
import { Navigation } from '@/components/ui/navigation'

export default function Forbidden() {
  const navigate = useNavigate()

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
                <ShieldX className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-600">
                Access Denied
              </CardTitle>
              <CardDescription className="text-base">
                You don't have permission to access the admin panel.
                Only authorized administrators can access this area.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground text-center">
                If you believe this is an error, please contact the system administrator.
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
                <Button
                  onClick={() => navigate('/auth/sign-in')}
                  className="flex-1"
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
