import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import { UserDetail } from './UserDetail';
import type { User } from '../types/User';

const mockDeleteUser = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate,
}));

vi.mock('../hooks/useUserContext', () => ({
	useUserContext: () => ({
		deleteUser: mockDeleteUser,
	}),
}));

const mockUser: User = {
	id: "1",
	name: 'John Doe',
	role: 'Senior Frontend Engineer',
	birthday: '1990-01-01',
	hiringDate: '2020-01-01',
	location: 'New York, NY',
};

describe('UserDetail', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

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

	test('has edit and remove buttons', () => {
		render(<UserDetail user={mockUser} />);
		
		expect(screen.getByText('Edit')).toBeInTheDocument();
		expect(screen.getByText('Remove User')).toBeInTheDocument();
	});

	test('shows confirmation modal when remove button is clicked', () => {
		render(<UserDetail user={mockUser} />);
		
		fireEvent.click(screen.getByText('Remove User'));
		
		expect(screen.getByText('Remove Team Member')).toBeInTheDocument();
		expect(screen.getByText('Are you sure you want to remove John Doe? This action cannot be undone.')).toBeInTheDocument();
	});

	test('calls deleteUser when confirmation is confirmed', async () => {
		mockDeleteUser.mockResolvedValue(undefined);
		
		render(<UserDetail user={mockUser} />);
		
		fireEvent.click(screen.getByText('Remove User'));
		fireEvent.click(screen.getByText('Confirm'));
		
		await waitFor(() => {
			expect(mockDeleteUser).toHaveBeenCalledWith('1');
		});
	});

	test('shows loading state during deletion', async () => {
		mockDeleteUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
		
		render(<UserDetail user={mockUser} />);
		
		fireEvent.click(screen.getByText('Remove User'));
		fireEvent.click(screen.getByText('Confirm'));
		
		expect(screen.getByText('Removing...')).toBeInTheDocument();
	});

	test('closes modal when cancel is clicked', () => {
		render(<UserDetail user={mockUser} />);
		
		fireEvent.click(screen.getByText('Remove User'));
		fireEvent.click(screen.getByText('Cancel'));
		
		expect(screen.queryByText('Remove Team Member')).not.toBeInTheDocument();
	});

	test('switches to edit mode when edit button is clicked', () => {
		render(<UserDetail user={mockUser} />);
		
		fireEvent.click(screen.getByText('Edit'));
		
		expect(screen.getByText('Edit Team Member')).toBeInTheDocument();
		expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
		expect(screen.getByDisplayValue('Senior Frontend Engineer')).toBeInTheDocument();
	});
}); 