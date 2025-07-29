import { describe, expect, test, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUser } from './useUser';

const mockUser = {
	id: 'test-id',
	name: 'John Doe',
	role: 'Senior Frontend Engineer',
	birthday: '1990-01-01',
	hiringDate: '2020-01-01',
	location: 'New York, NY',
};

const mockUsers = [mockUser];

vi.mock('../services/userService', () => ({
	userService: {
		getUserById: vi.fn(),
	},
}));

vi.mock('./useUserContext', () => ({
	useUserContext: () => ({
		users: mockUsers,
	}),
}));

describe('useUser', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('returns user data from context when available', async () => {
		const { result } = renderHook(() => useUser('test-id'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.user).toEqual(mockUser);
		expect(result.current.error).toBe(null);
	});

	test('returns correct user structure', async () => {
		const { result } = renderHook(() => useUser('test-id'));

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

	test('handles user not found in context', async () => {
		const { userService } = await import('../services/userService');
		vi.mocked(userService.getUserById).mockResolvedValue(null);

		const { result } = renderHook(() => useUser('non-existent-id'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.user).toBe(null);
		expect(result.current.error).toBe('User not found');
	});

	test('handles service error', async () => {
		const { userService } = await import('../services/userService');
		vi.mocked(userService.getUserById).mockRejectedValue(new Error('Service error'));

		const { result } = renderHook(() => useUser('error-id'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.user).toBe(null);
		expect(result.current.error).toBe('Failed to load user');
	});
}); 