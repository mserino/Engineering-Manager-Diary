import { describe, expect, test, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUser } from './useUser';

vi.mock('../data/users.json', () => ({
	default: [
		{
			id: 1,
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
	],
}));

describe('useUser', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('returns user data successfully', async () => {
		const { result } = renderHook(() => useUser(1));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.user?.name).toBe('John Doe');
		expect(result.current.user?.role).toBe('Senior Frontend Engineer');
		expect(result.current.error).toBe(null);
	});

	test('returns error when user not found', async () => {
		const { result } = renderHook(() => useUser(999));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.user).toBe(null);
		expect(result.current.error).toBe('User not found');
	});

	test('returns correct user structure', async () => {
		const { result } = renderHook(() => useUser(1));

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

	test('returns loading as false and user data after processing', () => {
		const { result } = renderHook(() => useUser(1));

		expect(result.current.loading).toBe(false);
		expect(result.current.user?.name).toBe('John Doe');
		expect(result.current.error).toBe(null);
	});
}); 