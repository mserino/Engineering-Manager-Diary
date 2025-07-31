import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import { UserDetail } from './UserDetail';
import type { User } from '../types/User';
import type { OneOnOneNote } from '../types/OneOnOneNote';
import { MOODS } from '../types/Mood';

const mockUser: User = {
	id: '1',
	name: 'John Doe',
	role: 'Senior Frontend Engineer',
	birthday: '1990-01-01',
	hiringDate: '2020-01-01',
	location: 'New York, NY',
};

const mockNotes: OneOnOneNote[] = [
	{
		id: '1',
		userId: '1',
		date: '2024-01-15',
		talkingPoints: 'Discussed project progress and upcoming deadlines.',
		mood: MOODS.HAPPY,
		flag: false,
		createdAt: '2024-01-15T10:00:00Z',
	},
	{
		id: '2',
		userId: '1',
		date: '2024-01-10',
		talkingPoints: 'Team member expressed concerns about workload.',
		mood: MOODS.SAD,
		flag: true,
		flagDescription: 'Workload is too high',
		createdAt: '2024-01-10T14:30:00Z',
	},
];

const mockUseUserContext = {
	deleteUser: vi.fn(),
};

const baseMockState = {
	notes: mockNotes,
	loading: false,
	error: null as string | null,
	createNote: vi.fn(),
	updateNote: vi.fn(),
	deleteNote: vi.fn(),
};

const mockUseOneOnOneNotes = vi.fn();

beforeEach(() => {
	vi.clearAllMocks();
	// Ensure a clean state for basic rendering tests
	mockUseOneOnOneNotes.mockReturnValue({
		...baseMockState,
		loading: false,
		error: null,
	});
});

vi.mock('../hooks/useUserContext', () => ({
	useUserContext: () => mockUseUserContext,
}));

vi.mock('../hooks/useOneOnOneNotes', () => ({
	useOneOnOneNotes: () => mockUseOneOnOneNotes(),
}));

vi.mock('react-router-dom', () => ({
	useNavigate: () => vi.fn(),
}));

describe('UserDetail', () => {
	test('renders user information', () => {
		render(<UserDetail user={mockUser} />);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
		expect(screen.getByText('1/1/1990')).toBeInTheDocument();
		expect(screen.getByText('New York, NY')).toBeInTheDocument();
		expect(screen.getByText('1/1/2020')).toBeInTheDocument();
	});

	test('renders edit and remove user buttons', () => {
		render(<UserDetail user={mockUser} />);

		expect(screen.getByText('Edit')).toBeInTheDocument();
		expect(screen.getByText('Remove User')).toBeInTheDocument();
	});

	test('renders 1:1 notes section', () => {
		render(<UserDetail user={mockUser} />);

		expect(screen.getByText('1:1 Notes')).toBeInTheDocument();
		expect(screen.getByText('Add Note')).toBeInTheDocument();
	});

	test('displays notes when available', () => {
		render(<UserDetail user={mockUser} />);

		const firstNoteCard = screen.getByTestId('note-card-1');
		fireEvent.click(firstNoteCard);

		expect(screen.getByText('Discussed project progress and upcoming deadlines.')).toBeInTheDocument();

		const secondNoteCard = screen.getByTestId('note-card-2');
		fireEvent.click(secondNoteCard);

		expect(screen.getByText('Team member expressed concerns about workload.')).toBeInTheDocument();
		expect(screen.getByText('Flagged')).toBeInTheDocument();
	});

	test('opens note modal when add note button is clicked', () => {
		render(<UserDetail user={mockUser} />);

		const addNoteButton = screen.getByText('Add Note');
		fireEvent.click(addNoteButton);

		expect(screen.getByText('Add 1:1 Note')).toBeInTheDocument();
	});

	test('opens note modal for editing when edit note is clicked', async () => {
		render(<UserDetail user={mockUser} />);

		const firstNoteCard = screen.getByTestId('note-card-1');
		expect(firstNoteCard).toBeInTheDocument();
		
		fireEvent.click(firstNoteCard);

		const editButton = screen.getByText('Edit Note');
		fireEvent.click(editButton);

		expect(screen.getByText('Edit 1:1 Note')).toBeInTheDocument();
	});

	test('opens delete confirmation modal when remove note is clicked', async () => {
		render(<UserDetail user={mockUser} />);

		const firstNoteCard = screen.getByTestId('note-card-1');
		expect(firstNoteCard).toBeInTheDocument();
		
		fireEvent.click(firstNoteCard);

		const removeButton = screen.getByText('Remove Note');
		fireEvent.click(removeButton);

		expect(screen.getByText('Delete Note')).toBeInTheDocument();
		expect(screen.getByText('Are you sure you want to delete this note? This action cannot be undone.')).toBeInTheDocument();
	});

	test('closes note modal when cancel is clicked', () => {
		render(<UserDetail user={mockUser} />);

		const addNoteButton = screen.getByText('Add Note');
		fireEvent.click(addNoteButton);

		const cancelButton = screen.getByText('Cancel');
		fireEvent.click(cancelButton);

		expect(screen.queryByText('Add 1:1 Note')).not.toBeInTheDocument();
	});

	test('shows loading spinner when notes are loading', () => {
		mockUseOneOnOneNotes.mockReturnValue({
			...baseMockState,
			loading: true,
			error: null,
		});
		render(<UserDetail user={mockUser} />);

		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	test('shows error message when notes fail to load', () => {
		mockUseOneOnOneNotes.mockReturnValue({
			...baseMockState,
			loading: false,
			error: 'Failed to fetch notes',
		});
		render(<UserDetail user={mockUser} />);

		expect(screen.getByText('Failed to fetch notes')).toBeInTheDocument();
	});

	test('calls deleteNote when confirming note deletion', async () => {
		const deleteNote = vi.fn().mockResolvedValue(undefined);
		mockUseOneOnOneNotes.mockReturnValue({
			...baseMockState,
			deleteNote,
		});

		render(<UserDetail user={mockUser} />);

		const firstNoteCard = screen.getByTestId('note-card-1');
		expect(firstNoteCard).toBeInTheDocument();
		
		fireEvent.click(firstNoteCard);

		const removeButton = screen.getByText('Remove Note');
		fireEvent.click(removeButton);

		const confirmButton = screen.getByText('Confirm');
		fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(deleteNote).toHaveBeenCalledWith('1');
		});
	});

	test('calls createNote when submitting new note', async () => {
		const createNote = vi.fn().mockResolvedValue(undefined);
		mockUseOneOnOneNotes.mockReturnValue({
			...baseMockState,
			createNote,
		});

		render(<UserDetail user={mockUser} />);

		const addNoteButton = screen.getByText('Add Note');
		fireEvent.click(addNoteButton);

		const dateInput = screen.getByLabelText('Date');
		const talkingPointsInput = screen.getByLabelText('Talking Points *');

		fireEvent.change(dateInput, { target: { value: '2024-01-20' } });
		fireEvent.change(talkingPointsInput, { target: { value: 'New note content' } });

		const submitButton = screen.getByText('Save Note');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(createNote).toHaveBeenCalledWith({
				userId: '1',
				date: '2024-01-20',
				talkingPoints: 'New note content',
				mood: MOODS.HAPPY,
				flag: false,
				flagDescription: '',
			});
		});
	});

	test('calls updateNote when submitting edited note', async () => {
		const updateNote = vi.fn().mockResolvedValue(undefined);
		mockUseOneOnOneNotes.mockReturnValue({
			...baseMockState,
			updateNote,
		});

		render(<UserDetail user={mockUser} />);

		const firstNoteCard = screen.getByTestId('note-card-1');
		expect(firstNoteCard).toBeInTheDocument();
		
		fireEvent.click(firstNoteCard);

		const editButton = screen.getByText('Edit Note');
		fireEvent.click(editButton);

		const submitButton = screen.getByText('Update Note');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(updateNote).toHaveBeenCalledWith('1', {
				userId: '1',
				date: '2024-01-15',
				talkingPoints: 'Discussed project progress and upcoming deadlines.',
				mood: MOODS.HAPPY,
				flag: false,
				flagDescription: '',
			});
		});
	});

	test('shows loading state during note deletion', async () => {
		const deleteNote = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
		mockUseOneOnOneNotes.mockReturnValue({
			...baseMockState,
			deleteNote,
		});

		render(<UserDetail user={mockUser} />);

		const firstNoteCard = screen.getByTestId('note-card-1');
		expect(firstNoteCard).toBeInTheDocument();
		
		fireEvent.click(firstNoteCard);

		const removeButton = screen.getByText('Remove Note');
		fireEvent.click(removeButton);

		const confirmButton = screen.getByText('Confirm');
		fireEvent.click(confirmButton);

		expect(screen.getByText('Deleting...')).toBeInTheDocument();
	});

	test('closes delete confirmation modal when cancel is clicked', async () => {
		mockUseOneOnOneNotes.mockReturnValue({
			...baseMockState,
		});

		render(<UserDetail user={mockUser} />);

		const firstNoteCard = screen.getByTestId('note-card-1');
		expect(firstNoteCard).toBeInTheDocument();
		
		fireEvent.click(firstNoteCard);

		const removeButton = screen.getByText('Remove Note');
		fireEvent.click(removeButton);

		const cancelButton = screen.getByText('Cancel');
		fireEvent.click(cancelButton);

		expect(screen.queryByText('Delete Note')).not.toBeInTheDocument();
	});

	test('calls updateNote when resolving a flagged note', async () => {
		const updateNote = vi.fn().mockResolvedValue(undefined);
		mockUseOneOnOneNotes.mockReturnValue({
			...baseMockState,
			updateNote,
		});

		render(<UserDetail user={mockUser} />);

		const flaggedNoteCard = screen.getByTestId('note-card-2');
		fireEvent.click(flaggedNoteCard);

		const resolveButton = screen.getByText('Mark as Resolved');
		fireEvent.click(resolveButton);

		await waitFor(() => {
			expect(updateNote).toHaveBeenCalledWith('2', { flag: false, flagDescription: '' });
		});
	});

	test('keeps flagged note visible after failed resolve attempt', async () => {
		const updateNote = vi.fn().mockRejectedValue(new Error('Failed to update note'));
		mockUseOneOnOneNotes.mockReturnValue({
			...baseMockState,
			updateNote,
		});

		render(<UserDetail user={mockUser} />);

		const flaggedNoteCard = screen.getByTestId('note-card-2');
		fireEvent.click(flaggedNoteCard);

		const resolveButton = screen.getByText('Mark as Resolved');
		fireEvent.click(resolveButton);

		await waitFor(() => {
			expect(updateNote).toHaveBeenCalledWith('2', { flag: false, flagDescription: '' });
			expect(screen.getByText('Flagged')).toBeInTheDocument();
			expect(resolveButton).toBeInTheDocument();
		});
	});
}); 