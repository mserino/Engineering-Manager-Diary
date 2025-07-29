import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import { ConfirmationModal } from './ConfirmationModal';

const mockOnClose = vi.fn();
const mockOnConfirm = vi.fn();

describe('ConfirmationModal', () => {
	test('renders when isOpen is true', () => {
		render(
			<ConfirmationModal
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
				title="Test Title"
				message="Test message"
			/>
		);

		expect(screen.getByText('Test Title')).toBeInTheDocument();
		expect(screen.getByText('Test message')).toBeInTheDocument();
		expect(screen.getByText('Confirm')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
	});

	test('does not render when isOpen is false', () => {
		render(
			<ConfirmationModal
				isOpen={false}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
				title="Test Title"
				message="Test message"
			/>
		);

		expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
		expect(screen.queryByText('Test message')).not.toBeInTheDocument();
	});

	test('calls onClose when cancel button is clicked', () => {
		render(
			<ConfirmationModal
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
				title="Test Title"
				message="Test message"
			/>
		);

		fireEvent.click(screen.getByText('Cancel'));
		expect(mockOnClose).toHaveBeenCalled();
	});

	test('calls onConfirm when confirm button is clicked', () => {
		render(
			<ConfirmationModal
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
				title="Test Title"
				message="Test message"
			/>
		);

		fireEvent.click(screen.getByText('Confirm'));
		expect(mockOnConfirm).toHaveBeenCalled();
	});

	test('uses custom confirm and cancel text', () => {
		render(
			<ConfirmationModal
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
				title="Test Title"
				message="Test message"
				confirmText="Delete"
				cancelText="Keep"
			/>
		);

		expect(screen.getByText('Delete')).toBeInTheDocument();
		expect(screen.getByText('Keep')).toBeInTheDocument();
	});

	test('has proper styling for confirm button', () => {
		render(
			<ConfirmationModal
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
				title="Test Title"
				message="Test message"
				confirmButtonClassName="bg-green-500 hover:bg-green-600"
			/>
		);

		const confirmButton = screen.getByText('Confirm');
		expect(confirmButton).toHaveClass('bg-green-500', 'hover:bg-green-600');
	});

	test('has default red styling for confirm button', () => {
		render(
			<ConfirmationModal
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
				title="Test Title"
				message="Test message"
			/>
		);

		const confirmButton = screen.getByText('Confirm');
		expect(confirmButton).toHaveClass('bg-red-500', 'hover:bg-red-600');
	});

	test('has proper modal overlay styling', () => {
		render(
			<ConfirmationModal
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
				title="Test Title"
				message="Test message"
			/>
		);

		const overlay = screen.getByText('Test Title').closest('.fixed');
		expect(overlay).toHaveClass('bg-black/50');
	});

	test('has proper modal content styling', () => {
		render(
			<ConfirmationModal
				isOpen={true}
				onClose={mockOnClose}
				onConfirm={mockOnConfirm}
				title="Test Title"
				message="Test message"
			/>
		);

		const modalContent = screen.getByText('Test Title').closest('.bg-white');
		expect(modalContent).toHaveClass('rounded-lg', 'shadow-xl');
	});
}); 