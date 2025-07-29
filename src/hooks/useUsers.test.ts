import { describe, expect, test, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from './useUsers';

const mockUsers = [
	{
		id: "1",
		name: 'John Doe',
		role: 'Senior Frontend Engineer',
		birthday: '1990-01-01',
		hiringDate: '2020-01-01',
		location: 'New York, NY',
	},
	{
		id: "2",
		name: 'Jane Smith',
		role: 'Senior Backend Engineer',
		birthday: '1985-05-15',
		hiringDate: '2019-03-15',
		location: 'San Francisco, CA',
	},
];

const mockFetchUsers = vi.fn();

vi.mock('./useUserContext', () => ({
	useUserContext: () => ({
		users: mockUsers,
		loading: false,
		error: null,
		fetchUsers: mockFetchUsers,
	}),
}));

describe('useUsers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('returns users data successfully', async () => {
		const { result } = renderHook(() => useUsers());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.users).toHaveLength(2);
		expect(result.current.users[0]?.name).toBe('John Doe');
		expect(result.current.users[1]?.name).toBe('Jane Smith');
		expect(result.current.error).toBe(null);
	});

	test('returns correct user structure', async () => {
		const { result } = renderHook(() => useUsers());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const user = result.current.users[0];
		expect(user).toHaveProperty('id');
		expect(user).toHaveProperty('name');
		expect(user).toHaveProperty('role');
		expect(user).toHaveProperty('birthday');
		expect(user).toHaveProperty('hiringDate');
		expect(user).toHaveProperty('location');
	});

	test('calls fetchUsers on mount', () => {
		renderHook(() => useUsers());

		expect(mockFetchUsers).toHaveBeenCalled();
	});
}); 