import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import { OneOnOneNotesList } from './OneOnOneNotesList';
import type { OneOnOneNote } from '../types/OneOnOneNote';
import { MOODS } from '../types/Mood';

const mockNotes: OneOnOneNote[] = [
	{
		id: '1',
		userId: 'user1',
		date: '2024-01-15',
		talkingPoints: 'Discussed project progress and upcoming deadlines.',
		mood: MOODS.HAPPY,
		flag: false,
		createdAt: '2024-01-15T10:00:00Z',
	},
	{
		id: '2',
		userId: 'user1',
		date: '2024-01-10',
		talkingPoints: 'Team member expressed concerns about workload.',
		mood: MOODS.SAD,
		flag: true,
		createdAt: '2024-01-10T14:30:00Z',
	},
];

describe('OneOnOneNotesList', () => {
	const mockOnDelete = vi.fn();
	const mockOnEdit = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('renders empty state when no notes', () => {
		render(<OneOnOneNotesList notes={[]} />);
		
		expect(screen.getByText('No 1:1 notes yet. Add your first note to get started!')).toBeInTheDocument();
	});

	test('renders list of notes', () => {
		render(<OneOnOneNotesList notes={mockNotes} />);
		
		// Find and expand the first note
		const firstNoteCard = screen.getByTestId('note-card-1');
		fireEvent.click(firstNoteCard);
		expect(screen.getByText('Discussed project progress and upcoming deadlines.')).toBeInTheDocument();

		// Find and expand the second note
		const secondNoteCard = screen.getByTestId('note-card-2');
		fireEvent.click(secondNoteCard);
		expect(screen.getByText('Team member expressed concerns about workload.')).toBeInTheDocument();
	});

	test('displays note information correctly', () => {
		render(<OneOnOneNotesList notes={mockNotes} />);
		
		// Check dates are displayed
		expect(screen.getByText('1/15/2024')).toBeInTheDocument();
		expect(screen.getByText('1/10/2024')).toBeInTheDocument();
		
		// Check creation dates
		expect(screen.getByText('Created 1/15/2024')).toBeInTheDocument();
		expect(screen.getByText('Created 1/10/2024')).toBeInTheDocument();
		
		// Check moods
		expect(screen.getByText('😊')).toBeInTheDocument();
		expect(screen.getByText('😔')).toBeInTheDocument();
		
		// Check flag
		expect(screen.getByText('Flagged')).toBeInTheDocument();
	});

	test('expands note when card is clicked', () => {
		render(<OneOnOneNotesList notes={mockNotes} />);
		
		const firstNoteCard = screen.getByTestId('note-card-1');
		expect(firstNoteCard).toBeInTheDocument();
		
		fireEvent.click(firstNoteCard);
		
		// Should show talking points
		expect(screen.getByText('Discussed project progress and upcoming deadlines.')).toBeInTheDocument();
	});

	test('collapses note when card is clicked again', () => {
		render(<OneOnOneNotesList notes={mockNotes} />);
		
		const firstNoteCard = screen.getByTestId('note-card-1');
		expect(firstNoteCard).toBeInTheDocument();
		
		// First click to expand
		fireEvent.click(firstNoteCard);
		expect(screen.getByText('Discussed project progress and upcoming deadlines.')).toBeInTheDocument();
		
		// Second click to collapse
		fireEvent.click(firstNoteCard);
		expect(screen.queryByText('Discussed project progress and upcoming deadlines.')).not.toBeInTheDocument();
	});

	test('shows edit and delete buttons when note is expanded', () => {
		render(<OneOnOneNotesList notes={mockNotes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
		
		const firstNoteCard = screen.getByTestId('note-card-1');
		fireEvent.click(firstNoteCard);
		
		expect(screen.getByText('Edit Note')).toBeInTheDocument();
		expect(screen.getByText('Remove Note')).toBeInTheDocument();
	});

	test('calls onEdit when edit button is clicked', () => {
		render(<OneOnOneNotesList notes={mockNotes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
		
		const firstNoteCard = screen.getByTestId('note-card-1');
		fireEvent.click(firstNoteCard);
		
		const editButton = screen.getByText('Edit Note');
		fireEvent.click(editButton);
		
		expect(mockOnEdit).toHaveBeenCalledWith(mockNotes[0]);
	});

	test('calls onDelete when remove button is clicked', () => {
		render(<OneOnOneNotesList notes={mockNotes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
		
		const firstNoteCard = screen.getByTestId('note-card-1');
		fireEvent.click(firstNoteCard);
		
		const removeButton = screen.getByText('Remove Note');
		fireEvent.click(removeButton);
		
		expect(mockOnDelete).toHaveBeenCalledWith('1');
	});

	test('does not expand note when clicking on action buttons', () => {
		render(<OneOnOneNotesList notes={mockNotes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
		
		const firstNoteCard = screen.getByTestId('note-card-1');
		fireEvent.click(firstNoteCard);
		
		const editButton = screen.getByText('Edit Note');
		fireEvent.click(editButton);
		
		// Should still be expanded (not collapsed by button click)
		expect(screen.getByText('Discussed project progress and upcoming deadlines.')).toBeInTheDocument();
	});

	test('does not show action buttons when onEdit and onDelete are not provided', () => {
		render(<OneOnOneNotesList notes={mockNotes} />);
		
		const firstNoteCard = screen.getByTestId('note-card-1');
		fireEvent.click(firstNoteCard);
		
		expect(screen.queryByText('Edit Note')).not.toBeInTheDocument();
		expect(screen.queryByText('Remove Note')).not.toBeInTheDocument();
	});

	test('shows only edit button when only onEdit is provided', () => {
		render(<OneOnOneNotesList notes={mockNotes} onEdit={mockOnEdit} />);
		
		const firstNoteCard = screen.getByTestId('note-card-1');
		fireEvent.click(firstNoteCard);
		
		expect(screen.getByText('Edit Note')).toBeInTheDocument();
		expect(screen.queryByText('Remove Note')).not.toBeInTheDocument();
	});

	test('shows only delete button when only onDelete is provided', () => {
		render(<OneOnOneNotesList notes={mockNotes} onDelete={mockOnDelete} />);
		
		const firstNoteCard = screen.getByTestId('note-card-1');
		fireEvent.click(firstNoteCard);
		
		expect(screen.queryByText('Edit Note')).not.toBeInTheDocument();
		expect(screen.getByText('Remove Note')).toBeInTheDocument();
	});

	test('applies correct border color based on flag status', () => {
		render(<OneOnOneNotesList notes={mockNotes} />);
		
		const flaggedNote = screen.getByTestId('note-card-2');
		const unflaggedNote = screen.getByTestId('note-card-1');
		
		expect(flaggedNote).toHaveClass('border-red-500');
		expect(unflaggedNote).toHaveClass('border-blue-500');
	});

	test('shows chevron icon that rotates when expanded', () => {
		render(<OneOnOneNotesList notes={mockNotes} />);
		
		const firstNoteCard = screen.getByTestId('note-card-1');
		const chevron = firstNoteCard.querySelector('svg');
		
		expect(chevron).toBeInTheDocument();
		expect(chevron).not.toHaveClass('rotate-180');
		
		fireEvent.click(firstNoteCard);
		
		expect(chevron).toHaveClass('rotate-180');
	});
}); 