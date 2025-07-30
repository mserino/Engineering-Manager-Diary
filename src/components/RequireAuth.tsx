import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from './Spinner';

interface RequireAuthProps {
    children: ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}; 