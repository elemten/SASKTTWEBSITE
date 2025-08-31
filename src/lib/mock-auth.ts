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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (email === this.MOCK_ADMIN_EMAIL && password === this.MOCK_ADMIN_PASSWORD) {
      const user: User = {
        id: 'mock-admin-1',
        email: this.MOCK_ADMIN_EMAIL,
        name: 'Admin User',
        role: 'admin'
      }
      this.currentUser = user
      this.saveToStorage(user)
      return { user, error: null }
    }

    return { user: null, error: 'Invalid email or password' }
  }

  async signOut(): Promise<{ error: string | null }> {
    this.currentUser = null
    localStorage.removeItem('mock_auth_user')
    return { error: null }
  }

  async getCurrentUser(): Promise<User | null> {
    // Check storage first
    const stored = localStorage.getItem('mock_auth_user')
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored)
      } catch {
        this.currentUser = null
      }
    }

    return this.currentUser
  }

  private saveToStorage(user: User) {
    localStorage.setItem('mock_auth_user', JSON.stringify(user))
  }

  async checkAdminAccess(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user?.role === 'admin' || false
  }
}

export const mockAuth = new MockAuth()
