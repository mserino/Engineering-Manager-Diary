import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import { OneOnOneNoteSingle } from './OneOnOneNote';
import type { OneOnOneNote } from '../types/OneOnOneNote';
import { MOODS } from '../types/Mood';

const mockNote: OneOnOneNote = {
	id: '1',
	userId: 'user1',
	date: '2024-01-15',
	talkingPoints: 'Discussed project progress and upcoming deadlines.',
	mood: MOODS.HAPPY,
	flag: true,
	flagDescription: 'Need to follow up on workload concerns',
	createdAt: '2024-01-15T10:00:00Z',
	actionItems: [{ description: 'Action item 1', done: false }, { description: 'Action item 2', done: false }],
};

describe('OneOnOneNoteSingle', () => {
	const mockOnDelete = vi.fn();
	const mockOnEdit = vi.fn();
	const mockOnUpdateFlag = vi.fn();
	const mockOnUpdateActionItems = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('renders note with basic information', () => {
		render(<OneOnOneNoteSingle note={mockNote} />);

		expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
		expect(screen.getByText('Created 1/15/2024')).toBeInTheDocument();
		expect(screen.getByText('Flagged')).toBeInTheDocument();
		expect(screen.getByLabelText('Happy mood')).toBeInTheDocument();
	});

	test('expands note on click to show details', () => {
		render(<OneOnOneNoteSingle note={mockNote} />);

		expect(screen.queryByText('Discussed project progress and upcoming deadlines.')).not.toBeInTheDocument();

		fireEvent.click(screen.getByTestId('note-card-1'));

		expect(screen.getByText('Discussed project progress and upcoming deadlines.')).toBeInTheDocument();
	});

	test('shows flag description and resolve button when expanded', () => {
		render(<OneOnOneNoteSingle note={mockNote} onUpdateFlag={mockOnUpdateFlag} />);

		fireEvent.click(screen.getByTestId('note-card-1'));

		expect(screen.getByText('Flag:')).toBeInTheDocument();
		expect(screen.getByText('Need to follow up on workload concerns')).toBeInTheDocument();

		expect(screen.getByText('Mark as Resolved')).toBeInTheDocument();
	});

	test('shows confirmation modal when clicking resolve', () => {
		render(<OneOnOneNoteSingle note={mockNote} onUpdateFlag={mockOnUpdateFlag} />);

		fireEvent.click(screen.getByTestId('note-card-1'));

		fireEvent.click(screen.getByText('Mark as Resolved'));

		expect(screen.getByText('Resolve Flag')).toBeInTheDocument();
		expect(screen.getByText('Are you sure you want to resolve the flag "Need to follow up on workload concerns"? This will remove the flag from the note.')).toBeInTheDocument();
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	test('calls onUpdateFlag when confirming flag resolution', async () => {
		render(<OneOnOneNoteSingle note={mockNote} onUpdateFlag={mockOnUpdateFlag} />);

		fireEvent.click(screen.getByTestId('note-card-1'));

		fireEvent.click(screen.getByText('Mark as Resolved'));

		fireEvent.click(screen.getByText('Confirm'));

		await waitFor(() => {
			expect(mockOnUpdateFlag).toHaveBeenCalledWith(mockNote.id, false, '');
		});
	});

	test('shows loading state during flag resolution', async () => {
		mockOnUpdateFlag.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
		
		render(<OneOnOneNoteSingle note={mockNote} onUpdateFlag={mockOnUpdateFlag} />);

		fireEvent.click(screen.getByTestId('note-card-1'));
		fireEvent.click(screen.getByText('Mark as Resolved'));

		const confirmButton = screen.getByRole('button', { name: 'Confirm' });
		fireEvent.click(confirmButton);

		const modalButtons = screen.getAllByRole('button');
		modalButtons.forEach(button => {
			expect(button).toBeDisabled();
		});

		const modalLoadingButton = screen.getByRole('button', { name: 'Resolving...' });
		expect(modalLoadingButton).toBeDisabled();
	});

	test('closes modal without resolving when clicking cancel', () => {
		render(<OneOnOneNoteSingle note={mockNote} onUpdateFlag={mockOnUpdateFlag} />);

		fireEvent.click(screen.getByTestId('note-card-1'));

		fireEvent.click(screen.getByText('Mark as Resolved'));

		fireEvent.click(screen.getByText('Cancel'));

		expect(screen.queryByText('Resolve Flag')).not.toBeInTheDocument();
		expect(mockOnUpdateFlag).not.toHaveBeenCalled();
	});

	test('calls onEdit when edit button is clicked', () => {
		render(<OneOnOneNoteSingle note={mockNote} onEdit={mockOnEdit} />);

		fireEvent.click(screen.getByTestId('note-card-1'));

		fireEvent.click(screen.getByText('Edit Note'));

		expect(mockOnEdit).toHaveBeenCalledWith(mockNote);
	});

	test('calls onDelete when delete button is clicked', () => {
		render(<OneOnOneNoteSingle note={mockNote} onDelete={mockOnDelete} />);

		fireEvent.click(screen.getByTestId('note-card-1'));

		fireEvent.click(screen.getByText('Remove Note'));

		expect(mockOnDelete).toHaveBeenCalledWith(mockNote.id);
	});

	test('shows action items when expanded', () => {
		render(<OneOnOneNoteSingle note={mockNote} />);

		fireEvent.click(screen.getByTestId('note-card-1'));

		expect(screen.getByText('Action Items')).toBeInTheDocument();
		expect(screen.getByText('Action item 1')).toBeInTheDocument();
		expect(screen.getByText('Action item 2')).toBeInTheDocument();
	});

	test('is able to check action items as done', () => {
		render(<OneOnOneNoteSingle note={mockNote} onUpdateActionItems={mockOnUpdateActionItems} />);

		fireEvent.click(screen.getByTestId('note-card-1'));

		const actionItem1 = screen.getByText('Action item 1');
		expect(actionItem1).not.toHaveClass('line-through');
	});

	test('shows due date for action items', () => {
		render(<OneOnOneNoteSingle note={mockNote} />);

		fireEvent.click(screen.getByTestId('note-card-1'));

		expect(screen.getByText('(Due: 1/20/2024)')).toBeInTheDocument();
	});
}); 