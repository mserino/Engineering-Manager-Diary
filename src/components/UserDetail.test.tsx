import { describe, expect, test } from 'vitest';
import { render, screen } from '../test/test-utils';
import { UserDetail } from './UserDetail';
import type { User } from '../types/User';

const mockUser: User = {
	id: "1",
	name: 'John Doe',
	role: 'Senior Frontend Engineer',
	birthday: '1990-01-01',
	hiringDate: '2020-01-01',
	location: 'New York, NY',
};

describe('UserDetail', () => {
	test('renders user information', () => {
		render(<UserDetail user={mockUser} />);
		
		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
	});

	test('displays formatted dates', () => {
		render(<UserDetail user={mockUser} />);
		
		expect(screen.getByText('Birthday')).toBeInTheDocument();
		expect(screen.getByText('Hiring Date')).toBeInTheDocument();
	});

	test('displays location', () => {
		render(<UserDetail user={mockUser} />);
		
		expect(screen.getByText('Location')).toBeInTheDocument();
		expect(screen.getByText('New York, NY')).toBeInTheDocument();
	});

	test('displays user avatar with first letter', () => {
		render(<UserDetail user={mockUser} />);
		
		expect(screen.getByText('J')).toBeInTheDocument();
	});

	test('has back to users link', () => {
		render(<UserDetail user={mockUser} />);
		
		const backLink = screen.getByText('← Back to Users');
		expect(backLink).toBeInTheDocument();
		expect(backLink).toHaveAttribute('href', '/');
	});

	test('has proper section headers', () => {
		render(<UserDetail user={mockUser} />);
		
		expect(screen.getByText('Personal Information')).toBeInTheDocument();
		expect(screen.getByText('Employment Details')).toBeInTheDocument();
	});
}); 