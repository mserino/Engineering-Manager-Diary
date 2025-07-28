import { describe, expect, test } from 'vitest';
import { render, screen } from '../test/test-utils';
import { UserList } from './UserList';
import type { User } from '../types/User';

const mockUsers: User[] = [
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
		name: 'Alice Smith',
		role: 'Senior Backend Engineer',
		birthday: '1985-05-15',
		hiringDate: '2019-03-15',
		location: 'San Francisco, CA',
	},
];

describe('UserList', () => {
	test('renders all users', () => {
		render(<UserList users={mockUsers} />);
		
		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('Alice Smith')).toBeInTheDocument();
	});

	test('displays user roles', () => {
		render(<UserList users={mockUsers} />);
		
		expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
		expect(screen.getByText('Senior Backend Engineer')).toBeInTheDocument();
	});


	test('renders correct number of user cards', () => {
		render(<UserList users={mockUsers} />);
		
		const userCards = screen.getAllByRole('article');
		expect(userCards).toHaveLength(2);
	});

	test('handles empty users array', () => {
		render(<UserList users={[]} />);
		
		expect(screen.queryByRole('article')).not.toBeInTheDocument();
	});

	test('has proper accessibility attributes', () => {
		render(<UserList users={mockUsers} />);
		
		const userCards = screen.getAllByRole('article');
		expect(userCards).toHaveLength(2);
	});
}); 