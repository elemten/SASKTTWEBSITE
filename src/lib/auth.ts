// Simple authentication system for Table Tennis Saskatchewan Admin
const ADMIN_EMAIL = 'info@ttsask.ca';
const ADMIN_PASSWORD = 'ttsask2025';
const AUTH_KEY = 'tts_admin_auth';

export class SimpleAuth {
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return localStorage.getItem(AUTH_KEY) === 'authenticated';
  }

  // Sign in with credentials
  signIn(email: string, password: string): boolean {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'authenticated');
      return true;
    }
    return false;
  }

  // Sign out
  signOut(): void {
    localStorage.removeItem(AUTH_KEY);
  }
}

export const auth = new SimpleAuth();
