import React, { createContext, useReducer, useCallback } from 'react';
import type { User, AuthError, LoginCredentials, RegisterData, AuthState } from '../hooks/useAuth';

interface AuthContextState extends AuthState {}

type AuthAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: AuthError | null }
  | { type: 'LOGOUT' };

interface AuthContextValue {
  state: AuthContextState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const initialState: AuthContextState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const authReducer = (state: AuthContextState, action: AuthAction): AuthContextState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: AuthError | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Implement your login logic here
      // For example:
      // const user = await authService.login(credentials);
      // dispatch({ type: 'SET_USER', payload: user });
      
    } catch (error) {
      setError({
        code: 'auth/login-failed',
        message: error instanceof Error ? error.message : 'Login failed'
      });
      throw error;
    }
  }, [setLoading, setError]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Implement your registration logic here
      // For example:
      // const user = await authService.register(data);
      // dispatch({ type: 'SET_USER', payload: user });
      
    } catch (error) {
      setError({
        code: 'auth/registration-failed',
        message: error instanceof Error ? error.message : 'Registration failed'
      });
      throw error;
    }
  }, [setLoading, setError]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Implement your logout logic here
      // For example:
      // await authService.logout();
      dispatch({ type: 'LOGOUT' });
      
    } catch (error) {
      setError({
        code: 'auth/logout-failed',
        message: error instanceof Error ? error.message : 'Logout failed'
      });
      throw error;
    }
  }, [setLoading, setError]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Implement your password reset logic here
      // For example:
      // await authService.resetPassword(email);
      
    } catch (error) {
      setError({
        code: 'auth/reset-password-failed',
        message: error instanceof Error ? error.message : 'Password reset failed'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Implement your profile update logic here
      // For example:
      // const updatedUser = await authService.updateProfile(data);
      // dispatch({ type: 'SET_USER', payload: updatedUser });
      
    } catch (error) {
      setError({
        code: 'auth/update-profile-failed',
        message: error instanceof Error ? error.message : 'Profile update failed'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const verifyEmail = useCallback(async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Implement your email verification logic here
      // For example:
      // await authService.verifyEmail(token);
      
    } catch (error) {
      setError({
        code: 'auth/verify-email-failed',
        message: error instanceof Error ? error.message : 'Email verification failed'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const sendVerificationEmail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Implement your verification email sending logic here
      // For example:
      // await authService.sendVerificationEmail();
      
    } catch (error) {
      setError({
        code: 'auth/send-verification-email-failed',
        message: error instanceof Error ? error.message : 'Failed to send verification email'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Implement your auth check logic here
      // For example:
      // const user = await authService.getCurrentUser();
      // if (user) {
      //   dispatch({ type: 'SET_USER', payload: user });
      // } else {
      //   dispatch({ type: 'LOGOUT' });
      // }
      
    } catch (error) {
      setError({
        code: 'auth/check-auth-failed',
        message: error instanceof Error ? error.message : 'Auth check failed'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const value: AuthContextValue = {
    state,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    verifyEmail,
    sendVerificationEmail,
    checkAuth,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
