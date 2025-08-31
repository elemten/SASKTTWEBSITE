// Mock authentication system for development
export interface User {
  id: string
  email: string
  name?: string
  role: 'admin' | 'user'
}

class MockAuth {
  private currentUser: User | null = null
  private readonly MOCK_ADMIN_EMAIL = 'admin@tts.ca'
  private readonly MOCK_ADMIN_PASSWORD = 'admin123'

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    console.log('MockAuth: Sign in attempt for:', email)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (email === this.MOCK_ADMIN_EMAIL && password === this.MOCK_ADMIN_PASSWORD) {
      console.log('MockAuth: Valid credentials, creating user')
      const user: User = {
        id: 'mock-admin-1',
        email: this.MOCK_ADMIN_EMAIL,
        name: 'Admin User',
        role: 'admin'
      }
      this.currentUser = user
      this.saveToStorage(user)
      console.log('MockAuth: User signed in successfully:', user)
      return { user, error: null }
    }

    console.log('MockAuth: Invalid credentials')
    return { user: null, error: 'Invalid email or password' }
  }

  async signOut(): Promise<{ error: string | null }> {
    this.currentUser = null
    localStorage.removeItem('mock_auth_user')
    return { error: null }
  }

  async getCurrentUser(): Promise<User | null> {
    console.log('MockAuth: Getting current user')
    // Check storage first
    const stored = localStorage.getItem('mock_auth_user')
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored)
        console.log('MockAuth: Found user in storage:', this.currentUser)
      } catch {
        console.log('MockAuth: Failed to parse stored user data')
        this.currentUser = null
      }
    } else {
      console.log('MockAuth: No user found in storage')
    }

    console.log('MockAuth: Returning current user:', this.currentUser)
    return this.currentUser
  }

  private saveToStorage(user: User) {
    localStorage.setItem('mock_auth_user', JSON.stringify(user))
  }

  async checkAdminAccess(): Promise<boolean> {
    console.log('MockAuth: Checking admin access')
    const user = await this.getCurrentUser()
    const isAdmin = user?.role === 'admin' || false
    console.log('MockAuth: Admin access result:', isAdmin, 'for user:', user)
    return isAdmin
  }
}

export const mockAuth = new MockAuth()
