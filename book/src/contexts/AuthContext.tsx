import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';

// Interfaces to match your FastAPI backend's response
interface User {
  id: string;
  email?: string;
  user_metadata?: {
    is_technical: boolean;
    experience_level: string;
    [key: string]: any;
  };
}

interface Session {
  access_token: string;
  refresh_token: string;
  user: User;
}

// Custom error type for better error handling in the frontend
interface AuthError {
  message: string;
  status?: number;
}

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, isTechnical: boolean, experienceLevel: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  checkSession: () => Promise<boolean>;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Base URL for your FastAPI backend
// Prefer a global override (set by env-plugin) and fall back to the Vercel deployment URL.
const API_BASE_URL =
  (typeof window !== 'undefined' && (window as any).__API_BASE_URL) ||
  'https://panaversity-robotics-hackathon.vercel.app';

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to wrap your application
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // Start loading to check session on mount

  // Effect to check session on component mount
  useEffect(() => {
    checkSession();
  }, []);

  const saveSessionToLocalStorage = (sessionData: Session) => {
    localStorage.setItem('session', JSON.stringify(sessionData));
  };

  const getSessionFromLocalStorage = (): Session | null => {
    const sessionString = localStorage.getItem('session');
    return sessionString ? JSON.parse(sessionString) : null;
  };

  const clearSessionFromLocalStorage = () => {
    localStorage.removeItem('session');
  };

  const checkSession = async (): Promise<boolean> => {
    setLoading(true);
    const storedSession = getSessionFromLocalStorage();
    if (storedSession && storedSession.access_token) {
      try {
        // Validate the token with the backend
        const response: AxiosResponse<{ message: string; user_metadata: any }> = await axios.get(
          `${API_BASE_URL}/protected-route`,
          {
            headers: {
              Authorization: `Bearer ${storedSession.access_token}`,
            },
          }
        );
        setUser({ ...storedSession.user, user_metadata: response.data.user_metadata });
        setSession(storedSession);
        setLoading(false);
        return true;
      } catch (error) {
        console.error('Session validation failed:', error);
        clearSessionFromLocalStorage();
        setUser(null);
        setSession(null);
        setLoading(false);
        return false;
      }
    }
    setLoading(false);
    return false;
  };

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    setLoading(true);
    try {
      const response: AxiosResponse<{ message: string; session: Session; user: User }> = await axios.post(
        `${API_BASE_URL}/auth/signin`,
        { email, password }
      );
      const newSession = { ...response.data.session, user: response.data.user };
      setSession(newSession);
      setUser(response.data.user);
      saveSessionToLocalStorage(newSession);
      setLoading(false);
      return { error: null };
    } catch (error: any) {
      setLoading(false);
      const axiosError = error as AxiosError;
      console.error('Sign-in error:', axiosError.response?.data || axiosError.message);
      
      // Type-safe error message extraction
      let errorMessage = 'Sign-in failed';
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { detail?: string; message?: string };
        errorMessage = errorData.detail || errorData.message || errorMessage;
      }
      
      return {
        error: {
          message: errorMessage,
          status: axiosError.response?.status,
        },
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    isTechnical: boolean,
    experienceLevel: string
  ): Promise<{ error: AuthError | null }> => {
    setLoading(true);
    try {
      const response: AxiosResponse<{ message: string; user: User; session: { access_token: string; refresh_token: string; expires_at: string } }> = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        { email, password, is_technical: isTechnical, experience_level: experienceLevel }
      );
      // Backend now returns a session on signup, so we can immediately log the user in
      const newSession: Session = {
        access_token: response.data.session.access_token,
        refresh_token: response.data.session.refresh_token,
        user: response.data.user,
      };
      setSession(newSession);
      setUser(response.data.user);
      saveSessionToLocalStorage(newSession);
      setLoading(false);
      return { error: null };
    } catch (error: any) {
      setLoading(false);
      const axiosError = error as AxiosError;
      console.error('Sign-up error:', axiosError.response?.data || axiosError.message);
      
      // Type-safe error message extraction
      let errorMessage = 'Sign-up failed';
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { detail?: string; message?: string };
        errorMessage = errorData.detail || errorData.message || errorMessage;
      }
      
      return {
        error: {
          message: errorMessage,
          status: axiosError.response?.status,
        },
      };
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    setLoading(true);
    try {
      // Assuming no backend /auth/signout endpoint for now, just clear local state
      // If there was a backend endpoint, it would be called here:
      // await axios.post(`${API_BASE_URL}/auth/signout`);
      clearSessionFromLocalStorage();
      setSession(null);
      setUser(null);
      setLoading(false);
      return { error: null };
    } catch (error: any) {
      setLoading(false);
      const axiosError = error as AxiosError;
      console.error('Sign-out error:', axiosError.response?.data || axiosError.message);
      
      // Type-safe error message extraction
      let errorMessage = 'Sign-out failed';
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { detail?: string; message?: string };
        errorMessage = errorData.detail || errorData.message || errorMessage;
      }
      
      return {
        error: {
          message: errorMessage,
          status: axiosError.response?.status,
        },
      };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
