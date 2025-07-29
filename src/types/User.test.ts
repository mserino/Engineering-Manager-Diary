import { describe, expect, test } from 'vitest';
import type { User } from './User';

describe('User type', () => {
	test('has correct structure', () => {
		const user: User = {
			id: "1",
			name: 'John Doe',
			role: 'Senior Frontend Engineer',
			birthday: '1990-01-01',
			hiringDate: '2020-01-01',
			location: 'New York, NY',
		};

		expect(user.id).toBe("1");
		expect(user.name).toBe('John Doe');
		expect(user.role).toBe('Senior Frontend Engineer');
		expect(user.birthday).toBe('1990-01-01');
		expect(user.hiringDate).toBe('2020-01-01');
		expect(user.location).toBe('New York, NY');
	});

	test('enforces required properties', () => {
		const user: User = {
			id: "1",
			name: 'John Doe',
			role: 'Senior Frontend Engineer',
			birthday: '1990-01-01',
			hiringDate: '2020-01-01',
			location: 'New York, NY',
		};

		expect(user).toHaveProperty('id');
		expect(user).toHaveProperty('name');
		expect(user).toHaveProperty('role');
		expect(user).toHaveProperty('birthday');
		expect(user).toHaveProperty('hiringDate');
		expect(user).toHaveProperty('location');
	});

	test('enforces correct types', () => {
		const user: User = {
			id: "1",
			name: 'John Doe',
			role: 'Senior Frontend Engineer',
			birthday: '1990-01-01',
			hiringDate: '2020-01-01',
			location: 'New York, NY',
		};

		expect(typeof user.id).toBe('string');
		expect(typeof user.name).toBe('string');
		expect(typeof user.role).toBe('string');
		expect(typeof user.birthday).toBe('string');
		expect(typeof user.hiringDate).toBe('string');
		expect(typeof user.location).toBe('string');
	});
}); 