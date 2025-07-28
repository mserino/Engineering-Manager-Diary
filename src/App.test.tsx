import { beforeEach, describe, expect, test, vi } from 'vitest';
import App from './App';
import { render, screen } from './test/test-utils';

vi.mock('./hooks/useUsers', () => ({
	useUsers: vi.fn(),
}));

const mockUseUsers = vi.mocked(await import('./hooks/useUsers')).useUsers;

describe('App', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('displays loading state initially', () => {
		mockUseUsers.mockReturnValue({
			users: [],
			loading: true,
			error: null,
		});

		render(<App />);
		expect(screen.getByText(/Loading users/i)).toBeInTheDocument();
	});

	test('displays error state when data fails to load', () => {
		mockUseUsers.mockReturnValue({
			users: [],
			loading: false,
			error: 'Failed to load users',
		});

		render(<App />);
		expect(screen.getByText('Failed to load users')).toBeInTheDocument();
	});

	test('displays users when data loads successfully', async () => {
		const mockUsers = [
			{
				id: 1,
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

		render(<App />);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
	});
});
