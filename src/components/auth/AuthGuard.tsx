import { type FC, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: ReactNode;
  isAuthenticated: boolean;
  redirectTo?: string;
}

const AuthGuard: FC<AuthGuardProps> = ({
  children,
  isAuthenticated,
  redirectTo = '/login'
}) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
