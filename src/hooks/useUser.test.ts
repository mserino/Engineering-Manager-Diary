import { describe, expect, test, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUser } from './useUser';
import type { User } from '../types/User';

const mockUser: User = {
	id: "1",
	name: 'John Doe',
	role: 'Senior Frontend Engineer',
	birthday: '1990-01-01',
	hiringDate: '2020-01-01',
	location: 'New York, NY',
};

vi.mock('../services/userService', () => ({
	userService: {
		getUserById: vi.fn(),
	},
}));

describe('useUser', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('returns user data successfully', async () => {
		const { userService } = await import('../services/userService');
		vi.mocked(userService.getUserById).mockResolvedValue(mockUser);

		const { result } = renderHook(() => useUser("1"));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.user?.name).toBe('John Doe');
		expect(result.current.user?.role).toBe('Senior Frontend Engineer');
		expect(result.current.error).toBe(null);
	});

	test('returns error when user not found', async () => {
		const { userService } = await import('../services/userService');
		vi.mocked(userService.getUserById).mockResolvedValue(null);

		const { result } = renderHook(() => useUser("999"));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.user).toBe(null);
		expect(result.current.error).toBe('User not found');
	});

	test('returns correct user structure', async () => {
		const { userService } = await import('../services/userService');
		vi.mocked(userService.getUserById).mockResolvedValue(mockUser);

		const { result } = renderHook(() => useUser("1"));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const user = result.current.user;
		expect(user).toHaveProperty('id');
		expect(user).toHaveProperty('name');
		expect(user).toHaveProperty('role');
		expect(user).toHaveProperty('birthday');
		expect(user).toHaveProperty('hiringDate');
		expect(user).toHaveProperty('location');
	});

	test('initially returns loading state', () => {
		const { result } = renderHook(() => useUser("1"));

		expect(result.current.loading).toBe(true);
		expect(result.current.user).toBe(null);
		expect(result.current.error).toBe(null);
	});

	test('handles error when service fails', async () => {
		const { userService } = await import('../services/userService');
		vi.mocked(userService.getUserById).mockRejectedValue(new Error('Service error'));

		const { result } = renderHook(() => useUser("1"));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.error).toBe('Failed to load user');
		expect(result.current.user).toBe(null);
	});
}); 