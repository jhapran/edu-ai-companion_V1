import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'educator' | 'admin';
  avatar?: string;
  permissions?: string[];
  metadata?: Record<string, any>;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: User['role'];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

export interface UseAuthReturn extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: User['role']) => boolean;
}

const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const {
    state,
    login: contextLogin,
    register: contextRegister,
    logout: contextLogout,
    resetPassword: contextResetPassword,
    updateProfile: contextUpdateProfile,
    verifyEmail: contextVerifyEmail,
    sendVerificationEmail: contextSendVerificationEmail,
    checkAuth: contextCheckAuth,
    clearError: contextClearError
  } = context;

  const [localState, setLocalState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    setLocalState(state);
  }, [state]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      await contextLogin(credentials);
    } catch (error) {
      // Error handling is managed by the context
    }
  }, [contextLogin]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      await contextRegister(data);
    } catch (error) {
      // Error handling is managed by the context
    }
  }, [contextRegister]);

  const logout = useCallback(async () => {
    try {
      await contextLogout();
    } catch (error) {
      // Error handling is managed by the context
    }
  }, [contextLogout]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await contextResetPassword(email);
    } catch (error) {
      // Error handling is managed by the context
    }
  }, [contextResetPassword]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      await contextUpdateProfile(data);
    } catch (error) {
      // Error handling is managed by the context
    }
  }, [contextUpdateProfile]);

  const verifyEmail = useCallback(async (token: string) => {
    try {
      await contextVerifyEmail(token);
    } catch (error) {
      // Error handling is managed by the context
    }
  }, [contextVerifyEmail]);

  const sendVerificationEmail = useCallback(async () => {
    try {
      await contextSendVerificationEmail();
    } catch (error) {
      // Error handling is managed by the context
    }
  }, [contextSendVerificationEmail]);

  const checkAuth = useCallback(async () => {
    try {
      await contextCheckAuth();
    } catch (error) {
      // Error handling is managed by the context
    }
  }, [contextCheckAuth]);

  // Utility functions
  const hasPermission = useCallback((permission: string): boolean => {
    return localState.user?.permissions?.includes(permission) || false;
  }, [localState.user]);

  const hasRole = useCallback((role: User['role']): boolean => {
    return localState.user?.role === role;
  }, [localState.user]);

  return {
    ...localState,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    verifyEmail,
    sendVerificationEmail,
    checkAuth,
    clearError: contextClearError,
    hasPermission,
    hasRole
  };
};

export default useAuth;
