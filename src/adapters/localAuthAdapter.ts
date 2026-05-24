import type { IAuthRepository } from '../repositories/types';
import type { AuthResult, AuthSession } from '../types';

const STORAGE_KEY = 'huinanzi:session:v1';

export class LocalAuthAdapter implements IAuthRepository {
  private read(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.email === 'string') return parsed as AuthSession;
      return null;
    } catch {
      return null;
    }
  }

  private write(session: AuthSession | null): void {
    if (typeof window === 'undefined') return;
    if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(STORAGE_KEY);
  }

  async login(email: string, password: string): Promise<AuthResult> {
    await new Promise((r) => setTimeout(r, 200));
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }
    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    const session: AuthSession = { email, loggedInAt: new Date().toISOString() };
    this.write(session);
    return { success: true, email };
  }

  async register(email: string, password: string): Promise<AuthResult> {
    return this.login(email, password);
  }

  logout(): void {
    this.write(null);
  }

  getSession(): AuthSession | null {
    return this.read();
  }
}
