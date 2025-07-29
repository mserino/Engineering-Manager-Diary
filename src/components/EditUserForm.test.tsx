import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import { EditUserForm } from './EditUserForm';
import type { User } from '../types/User';

const mockUpdateUser = vi.fn();
const mockOnCancel = vi.fn();

vi.mock('../hooks/useUserContext', () => ({
	useUserContext: () => ({
		updateUser: mockUpdateUser,
	}),
}));

const mockUser: User = {
	id: 'test-id',
	name: 'John Doe',
	role: 'Senior Frontend Engineer',
	birthday: '1990-01-01',
	hiringDate: '2020-01-01',
	location: 'New York, NY',
};

describe('EditUserForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('renders form with user data pre-filled', () => {
		render(<EditUserForm user={mockUser} onCancel={mockOnCancel} />);

		expect(screen.getByText('Edit Team Member')).toBeInTheDocument();
		expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
		expect(screen.getByDisplayValue('Senior Frontend Engineer')).toBeInTheDocument();
		expect(screen.getByDisplayValue('1990-01-01')).toBeInTheDocument();
		expect(screen.getByDisplayValue('2020-01-01')).toBeInTheDocument();
		expect(screen.getByDisplayValue('New York, NY')).toBeInTheDocument();
	});

	test('has submit and cancel buttons', () => {
		render(<EditUserForm user={mockUser} onCancel={mockOnCancel} />);

		expect(screen.getByText('Update Team Member')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
	});

	test('handles form input changes', () => {
		render(<EditUserForm user={mockUser} onCancel={mockOnCancel} />);

		const nameInput = screen.getByLabelText('Full Name *');
		const roleInput = screen.getByLabelText('Role *');

		fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
		fireEvent.change(roleInput, { target: { value: 'Developer' } });

		expect(nameInput).toHaveValue('Jane Doe');
		expect(roleInput).toHaveValue('Developer');
	});

	test('submits form with updated user data', async () => {
		mockUpdateUser.mockResolvedValue(undefined);

		render(<EditUserForm user={mockUser} onCancel={mockOnCancel} />);

		fireEvent.change(screen.getByLabelText('Full Name *'), { target: { value: 'Jane Doe' } });
		fireEvent.change(screen.getByLabelText('Role *'), { target: { value: 'Developer' } });
		fireEvent.change(screen.getByLabelText('Birthday *'), { target: { value: '1995-05-15' } });
		fireEvent.change(screen.getByLabelText('Hiring Date *'), { target: { value: '2021-03-15' } });
		fireEvent.change(screen.getByLabelText('Location *'), { target: { value: 'San Francisco, CA' } });

		fireEvent.click(screen.getByText('Update Team Member'));

		await waitFor(() => {
			expect(mockUpdateUser).toHaveBeenCalledWith('test-id', {
				name: 'Jane Doe',
				role: 'Developer',
				birthday: '1995-05-15',
				hiringDate: '2021-03-15',
				location: 'San Francisco, CA',
			});
		});

		await waitFor(() => {
			expect(mockOnCancel).toHaveBeenCalled();
		});
	});

	test('shows loading state during submission', async () => {
		mockUpdateUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

		render(<EditUserForm user={mockUser} onCancel={mockOnCancel} />);

		fireEvent.change(screen.getByLabelText('Full Name *'), { target: { value: 'Jane Doe' } });
		fireEvent.click(screen.getByText('Update Team Member'));

		expect(screen.getByText('Updating...')).toBeInTheDocument();
	});

	test('shows error message on submission failure', async () => {
		mockUpdateUser.mockRejectedValue(new Error('Failed'));

		render(<EditUserForm user={mockUser} onCancel={mockOnCancel} />);

		fireEvent.change(screen.getByLabelText('Full Name *'), { target: { value: 'Jane Doe' } });
		fireEvent.click(screen.getByText('Update Team Member'));

		await waitFor(() => {
			expect(screen.getByText('Failed to update user. Please try again.')).toBeInTheDocument();
		});
	});

	test('calls onCancel when cancel button is clicked', () => {
		render(<EditUserForm user={mockUser} onCancel={mockOnCancel} />);

		fireEvent.click(screen.getByText('Cancel'));

		expect(mockOnCancel).toHaveBeenCalled();
	});

	test('form has proper accessibility attributes', () => {
		render(<EditUserForm user={mockUser} onCancel={mockOnCancel} />);

		const nameInput = screen.getByLabelText('Full Name *');
		expect(nameInput).toHaveAttribute('required');
		expect(nameInput).toHaveAttribute('placeholder', 'Enter full name');

		const roleInput = screen.getByLabelText('Role *');
		expect(roleInput).toHaveAttribute('required');
		expect(roleInput).toHaveAttribute('placeholder', 'Enter job role');

		const locationInput = screen.getByLabelText('Location *');
		expect(locationInput).toHaveAttribute('required');
		expect(locationInput).toHaveAttribute('placeholder', 'Enter location (e.g., New York, NY)');
	});
}); 