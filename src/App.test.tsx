import { beforeEach, describe, expect, test, vi } from 'vitest';
import { act } from '@testing-library/react';
import App from './App';
import { render, screen } from './test/test-utils';
import type { User } from './types/User';

// Mock components
vi.mock('./components/RequireAuth', () => ({
    RequireAuth: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('./components/NavBar', () => ({
    NavBar: () => null,
}));

// Mock useUsers first
vi.mock('./hooks/useUsers', () => ({
    useUsers: vi.fn(),
}));

const mockUseUsers = vi.mocked(await import('./hooks/useUsers')).useUsers;

// Then mock HomePage using the same mock
vi.mock('./pages/HomePage', () => ({
    default: () => {
        const { users, loading, error } = mockUseUsers();

        if (loading) {
            return <div role="status">Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        return (
            <div>
                <h1>Team Members</h1>
                {users.map((user: User) => (
                    <div key={user.id}>
                        <h3>{user.name}</h3>
                        <p>{user.role}</p>
                    </div>
                ))}
                <a href="/add-user">Add a new team member</a>
            </div>
        );
    },
}));

describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('displays loading state initially', async () => {
        mockUseUsers.mockReturnValue({
            users: [],
            loading: true,
            error: null,
        });

        await act(async () => {
            render(<App />);
        });
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('displays error state when data fails to load', async () => {
        mockUseUsers.mockReturnValue({
            users: [],
            loading: false,
            error: 'Failed to load users',
        });

        await act(async () => {
            render(<App />);
        });
        expect(screen.getByText('Failed to load users')).toBeInTheDocument();
    });

    test('displays users when data loads successfully', async () => {
        const mockUsers = [
            {
                id: "1",
                name: 'John Doe',
                role: 'Senior Frontend Engineer',
                birthday: '1990-01-01',
                hiringDate: '2020-01-01',
                location: 'New York, NY',
            },
        ];

        mockUseUsers.mockReturnValue({
            users: mockUsers,
            loading: false,
            error: null,
        });

        await act(async () => {
            render(<App />);
        });
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
    });

    test('displays add team member link on homepage', async () => {
        mockUseUsers.mockReturnValue({
            users: [],
            loading: false,
            error: null,
        });

        await act(async () => {
            render(<App />);
        });
        expect(screen.getByText('Team Members')).toBeInTheDocument();
        expect(screen.getByText('Add a new team member')).toBeInTheDocument();
        expect(screen.getByText('Add a new team member')).toHaveAttribute('href', '/add-user');
    });
});
