import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import { AddUserForm } from './AddUserForm';

const mockCreateUser = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate,
}));

vi.mock('../hooks/useUserContext', () => ({
	useUserContext: () => ({
		createUser: mockCreateUser,
	}),
}));

describe('AddUserForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('renders form with all required fields', () => {
		render(<AddUserForm />);

		expect(screen.getByText('Add New Team Member')).toBeInTheDocument();
		expect(screen.getByLabelText('Full Name *')).toBeInTheDocument();
		expect(screen.getByLabelText('Role *')).toBeInTheDocument();
		expect(screen.getByLabelText('Birthday *')).toBeInTheDocument();
		expect(screen.getByLabelText('Hiring Date *')).toBeInTheDocument();
		expect(screen.getByLabelText('Location *')).toBeInTheDocument();
	});

	test('has submit and cancel buttons', () => {
		render(<AddUserForm />);

		expect(screen.getByText('Add Team Member')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
	});

	test('handles form input changes', () => {
		render(<AddUserForm />);

		const nameInput = screen.getByLabelText('Full Name *');
		const roleInput = screen.getByLabelText('Role *');

		fireEvent.change(nameInput, { target: { value: 'John Doe' } });
		fireEvent.change(roleInput, { target: { value: 'Developer' } });

		expect(nameInput).toHaveValue('John Doe');
		expect(roleInput).toHaveValue('Developer');
	});

	test('submits form with user data', async () => {
		mockCreateUser.mockResolvedValue({});

		render(<AddUserForm />);

		fireEvent.change(screen.getByLabelText('Full Name *'), { target: { value: 'John Doe' } });
		fireEvent.change(screen.getByLabelText('Role *'), { target: { value: 'Developer' } });
		fireEvent.change(screen.getByLabelText('Birthday *'), { target: { value: '1990-01-01' } });
		fireEvent.change(screen.getByLabelText('Hiring Date *'), { target: { value: '2020-01-01' } });
		fireEvent.change(screen.getByLabelText('Location *'), { target: { value: 'New York, NY' } });

		fireEvent.click(screen.getByText('Add Team Member'));

		await waitFor(() => {
			expect(mockCreateUser).toHaveBeenCalledWith({
				name: 'John Doe',
				role: 'Developer',
				birthday: '1990-01-01',
				hiringDate: '2020-01-01',
				location: 'New York, NY',
			});
		});

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/');
		});
	});

	test('shows loading state during submission', async () => {
		mockCreateUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

		render(<AddUserForm />);

		fireEvent.change(screen.getByLabelText('Full Name *'), { target: { value: 'John Doe' } });
		fireEvent.change(screen.getByLabelText('Role *'), { target: { value: 'Developer' } });
		fireEvent.change(screen.getByLabelText('Birthday *'), { target: { value: '1990-01-01' } });
		fireEvent.change(screen.getByLabelText('Hiring Date *'), { target: { value: '2020-01-01' } });
		fireEvent.change(screen.getByLabelText('Location *'), { target: { value: 'New York, NY' } });

		fireEvent.click(screen.getByText('Add Team Member'));

		expect(screen.getByText('Adding...')).toBeInTheDocument();
	});

	test('shows error message on submission failure', async () => {
		mockCreateUser.mockRejectedValue(new Error('Failed'));

		render(<AddUserForm />);

		fireEvent.change(screen.getByLabelText('Full Name *'), { target: { value: 'John Doe' } });
		fireEvent.change(screen.getByLabelText('Role *'), { target: { value: 'Developer' } });
		fireEvent.change(screen.getByLabelText('Birthday *'), { target: { value: '1990-01-01' } });
		fireEvent.change(screen.getByLabelText('Hiring Date *'), { target: { value: '2020-01-01' } });
		fireEvent.change(screen.getByLabelText('Location *'), { target: { value: 'New York, NY' } });

		fireEvent.click(screen.getByText('Add Team Member'));

		await waitFor(() => {
			expect(screen.getByText('Failed to create user. Please try again.')).toBeInTheDocument();
		});
	});

	test('cancel button navigates to home', () => {
		render(<AddUserForm />);

		const cancelButton = screen.getByText('Cancel');
		expect(cancelButton).toHaveAttribute('href', '/');
	});

	test('form has proper accessibility attributes', () => {
		render(<AddUserForm />);

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