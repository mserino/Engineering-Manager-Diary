import { describe, expect, test, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from './useUsers';
import type { User } from '../types/User';

const mockUsers: User[] = [
	{
		id: "1",
		name: 'John Doe',
		role: 'Senior Frontend Engineer',
		birthday: '1990-01-01',
		hiringDate: '2020-01-01',
		location: 'New York, NY',
	},
	{
		id: 2,
		name: 'Jane Smith',
		role: 'Senior Backend Engineer',
		birthday: '1985-05-15',
		hiringDate: '2019-03-15',
		location: 'San Francisco, CA',
	},
];

vi.mock('../services/userService', () => ({
	userService: {
		getAllUsers: vi.fn(),
	},
}));

describe('useUsers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('returns users data successfully', async () => {
		const { userService } = await import('../services/userService');
		vi.mocked(userService.getAllUsers).mockResolvedValue(mockUsers);

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
		const { userService } = await import('../services/userService');
		vi.mocked(userService.getAllUsers).mockResolvedValue(mockUsers);

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

	test('initially returns loading state', () => {
		const { result } = renderHook(() => useUsers());

		expect(result.current.loading).toBe(true);
		expect(result.current.users).toHaveLength(0);
		expect(result.current.error).toBe(null);
	});

	test('handles error when service fails', async () => {
		const { userService } = await import('../services/userService');
		vi.mocked(userService.getAllUsers).mockRejectedValue(new Error('Service error'));

		const { result } = renderHook(() => useUsers());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.error).toBe('Failed to load users');
		expect(result.current.users).toHaveLength(0);
	});
}); 