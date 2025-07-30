import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider } from './AuthProvider';
import { useAuth } from '../../hooks/useAuth';
import type { User, NextOrObserver } from 'firebase/auth';

// Mock Firebase auth
vi.mock('../../config/firebase', () => ({
    auth: {
        onAuthStateChanged: vi.fn((callback: NextOrObserver<User | null>) => {
            if (typeof callback === 'function') {
                callback(null);
            }
            return () => {};
        }),
        signOut: vi.fn(),
    },
}));

// Helper to render with auth context
const renderWithAuth = (ui: React.ReactElement) => {
    return render(
        <AuthProvider>
            {ui}
        </AuthProvider>
    );
};

// Test component that uses auth context
const TestComponent = () => {
    const { currentUser, loading, signOut } = useAuth();
    return (
        <div>
            {loading && <div>Loading...</div>}
            {currentUser && <div>User: {currentUser.email}</div>}
            {!loading && !currentUser && <div>Not authenticated</div>}
            <button onClick={signOut}>Sign Out</button>
        </div>
    );
};

describe('AuthProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('updates state when user authenticates', async () => {
        const mockUser = { email: 'test@example.com' } as User;
        const auth = (await import('../../config/firebase')).auth;
        
        vi.mocked(auth.onAuthStateChanged).mockImplementation((callback: NextOrObserver<User | null>) => {
            if (typeof callback === 'function') {
                callback(mockUser);
            }
            return () => {};
        });

        await act(async () => {
            renderWithAuth(<TestComponent />);
        });

        expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument();
    });

    test('updates state when user is not authenticated', async () => {
        const auth = (await import('../../config/firebase')).auth;
        
        vi.mocked(auth.onAuthStateChanged).mockImplementation((callback: NextOrObserver<User | null>) => {
            if (typeof callback === 'function') {
                callback(null);
            }
            return () => {};
        });

        await act(async () => {
            renderWithAuth(<TestComponent />);
        });

        expect(screen.getByText('Not authenticated')).toBeInTheDocument();
    });

    test('handles sign out', async () => {
        const mockUser = { email: 'test@example.com' } as User;
        const auth = (await import('../../config/firebase')).auth;
        
        vi.mocked(auth.onAuthStateChanged).mockImplementation((callback: NextOrObserver<User | null>) => {
            if (typeof callback === 'function') {
                callback(mockUser);
            }
            return () => {};
        });

        await act(async () => {
            renderWithAuth(<TestComponent />);
        });

        const signOutButton = screen.getByText('Sign Out');
        await act(async () => {
            signOutButton.click();
        });

        expect(vi.mocked(auth.signOut)).toHaveBeenCalled();
    });

    test('cleans up auth listener on unmount', async () => {
        const cleanup = vi.fn();
        const auth = (await import('../../config/firebase')).auth;
        
        vi.mocked(auth.onAuthStateChanged).mockImplementation(() => cleanup);

        const { unmount } = renderWithAuth(<TestComponent />);
        unmount();

        expect(cleanup).toHaveBeenCalled();
    });
}); 