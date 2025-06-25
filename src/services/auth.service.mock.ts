import type { User } from '../contexts/AppContext';
import type { LoginCredentials, SignupData, AuthResponse } from './auth.service';

// Mock implementation for development
export class MockAuthService {
  private mockUsers: Map<string, { password: string; user: User }> = new Map();
  private currentToken: string | null = null;

  constructor() {
    // Add a test user
    this.mockUsers.set('test@example.com', {
      password: 'password123',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'contributor',
        membershipTier: 'free'
      }
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userData = this.mockUsers.get(credentials.email);
    
    if (!userData || userData.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    const token = `mock-token-${Date.now()}`;
    this.currentToken = token;
    localStorage.setItem('authToken', token);

    return {
      user: userData.user,
      token
    };
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (this.mockUsers.has(data.email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: data.role || 'reader',
      membershipTier: 'free'
    };

    this.mockUsers.set(data.email, {
      password: data.password,
      user: newUser
    });

    const token = `mock-token-${Date.now()}`;
    this.currentToken = token;
    localStorage.setItem('authToken', token);

    return {
      user: newUser,
      token
    };
  }

  async logout(): Promise<void> {
    this.currentToken = null;
    localStorage.removeItem('authToken');
  }

  async verifyToken(): Promise<User | null> {
    const token = localStorage.getItem('authToken');
    
    if (!token || !token.startsWith('mock-token-')) {
      return null;
    }

    // For mock, just return the first user if token exists
    const firstUser = Array.from(this.mockUsers.values())[0];
    return firstUser ? firstUser.user : null;
  }

  async forgotPassword(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!this.mockUsers.has(email)) {
      throw new Error('Email not found');
    }

    console.log(`Mock: Password reset email sent to ${email}`);
  }

  async resetPassword(token: string, _newPassword: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Mock: Password reset with token ${token}`);
  }

  getToken() {
    return this.currentToken;
  }

  private setToken(token: string) {
    this.currentToken = token;
    localStorage.setItem('authToken', token);
  }

  private clearToken() {
    this.currentToken = null;
    localStorage.removeItem('authToken');
  }
}