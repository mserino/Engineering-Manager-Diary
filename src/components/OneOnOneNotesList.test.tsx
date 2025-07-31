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
		flagDescription: 'Workload is too high',
		createdAt: '2024-01-10T14:30:00Z',
	},
];

describe('OneOnOneNotesList', () => {
	const mockOnDelete = vi.fn();
	const mockOnEdit = vi.fn();
	const mockOnUpdateFlag = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('renders empty state when no notes', () => {
		render(<OneOnOneNotesList notes={[]} />);
		
		expect(screen.getByText('No 1:1 notes yet. Add your first note to get started!')).toBeInTheDocument();
	});

	test('renders list of notes', () => {
		render(<OneOnOneNotesList notes={mockNotes} />);
		
		const firstNoteCard = screen.getByTestId('note-card-1');
		fireEvent.click(firstNoteCard);
		expect(screen.getByText('Discussed project progress and upcoming deadlines.')).toBeInTheDocument();

		const secondNoteCard = screen.getByTestId('note-card-2');
		fireEvent.click(secondNoteCard);
		expect(screen.getByText('Team member expressed concerns about workload.')).toBeInTheDocument();
	});

	test('displays note information correctly', () => {
		render(<OneOnOneNotesList notes={mockNotes} />);
		
		const firstNoteCardDiv = screen.getByTestId('note-card-1').parentElement;
		expect(firstNoteCardDiv).not.toBeNull();
		expect(firstNoteCardDiv).toHaveClass('border-blue-500');
		expect(screen.getByText('1/15/2024')).toBeInTheDocument();
		expect(screen.getByText('Created 1/15/2024')).toBeInTheDocument();
		
		const secondNoteCardDiv = screen.getByTestId('note-card-2').parentElement;
		expect(secondNoteCardDiv).not.toBeNull();
		expect(secondNoteCardDiv).toHaveClass('border-red-500');
		expect(screen.getByText('1/10/2024')).toBeInTheDocument();
		expect(screen.getByText('Created 1/10/2024')).toBeInTheDocument();
		expect(screen.getByText('Flagged')).toBeInTheDocument();
	});

	test('displays flagged description when flag is true', () => {
		render(<OneOnOneNotesList notes={mockNotes} />);
		
		const secondNoteCard = screen.getByTestId('note-card-2');

		fireEvent.click(secondNoteCard);

		expect(secondNoteCard.parentElement).toHaveClass('border-red-500');
		expect(screen.getByText('Flagged')).toBeInTheDocument();
		expect(screen.getByText('Workload is too high')).toBeInTheDocument();
	});

	test('calls onEdit when edit button is clicked', () => {
		const { getByTestId, getByText } = render(<OneOnOneNotesList notes={mockNotes} onEdit={mockOnEdit} />);
		
		const firstNoteCard = getByTestId('note-card-1');
		fireEvent.click(firstNoteCard);
		
		const editButton = getByText('Edit Note');
		fireEvent.click(editButton);
		
		expect(mockOnEdit).toHaveBeenCalledWith(mockNotes[0]);
	});

	test('calls onDelete when delete button is clicked', () => {
		const { getByTestId, getByText } = render(<OneOnOneNotesList notes={mockNotes} onDelete={mockOnDelete} />);
		
		const firstNoteCard = getByTestId('note-card-1');
		fireEvent.click(firstNoteCard);
		
		const deleteButton = getByText('Remove Note');
		fireEvent.click(deleteButton);
		
		expect(mockOnDelete).toHaveBeenCalledWith(mockNotes[0]?.id);
	});

	test('shows Mark as Resolved button only for flagged notes', () => {
		render(<OneOnOneNotesList notes={mockNotes} onUpdateFlag={mockOnUpdateFlag} />);
		
		const firstNoteCard = screen.getByTestId('note-card-1');
		fireEvent.click(firstNoteCard);
		expect(screen.queryByText('Mark as Resolved')).not.toBeInTheDocument();

		const secondNoteCard = screen.getByTestId('note-card-2');
		fireEvent.click(secondNoteCard);
		expect(screen.getByText('Mark as Resolved')).toBeInTheDocument();
	});

	test('calls onUpdateFlag when Mark as Resolved is confirmed in modal', () => {
		const { getByTestId, getByText } = render(<OneOnOneNotesList notes={mockNotes} onUpdateFlag={mockOnUpdateFlag} />);
		
		const secondNoteCard = getByTestId('note-card-2');
		fireEvent.click(secondNoteCard);
		
		const resolveButton = getByText('Mark as Resolved');
		fireEvent.click(resolveButton);

		const confirmButton = getByText('Confirm');
		fireEvent.click(confirmButton);
		
		expect(mockOnUpdateFlag).toHaveBeenCalledWith(mockNotes[1]?.id, false, '');
	});

	test('does not show Mark as Resolved button when onUpdateFlag is not provided', () => {
		const { getByTestId } = render(<OneOnOneNotesList notes={mockNotes} />);
		
		const secondNoteCard = getByTestId('note-card-2');
		fireEvent.click(secondNoteCard);
		
		expect(screen.queryByText('Mark as Resolved')).not.toBeInTheDocument();
	});
}); 