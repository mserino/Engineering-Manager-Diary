import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import { OneOnOneNoteForm } from './OneOnOneNoteForm';
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
	actionItems: [{ description: 'Action item 1', done: false, dueDate: '2024-01-20' }, { description: 'Action item 2', done: false, dueDate: '2024-01-20' }],
};

describe('OneOnOneNoteForm', () => {
	const mockOnSubmit = vi.fn();
	const mockOnCancel = vi.fn();
	const userId = 'user1';

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock current date for consistent testing
		vi.setSystemTime(new Date('2024-01-20'));
	});

	test('renders empty form in create mode', () => {
		render(
			<OneOnOneNoteForm
				userId={userId}
				onSubmit={mockOnSubmit}
				onCancel={mockOnCancel}
			/>
		);

		expect(screen.getByText('Record today\'s conversation and observations.')).toBeInTheDocument();

		expect(screen.getByLabelText('Date')).toHaveValue('2024-01-20');
		expect(screen.getByLabelText('Talking Points *')).toHaveValue('');
		expect(screen.getByLabelText('Happy mood')).toBeInTheDocument();
		expect(screen.getByText('Flag for follow-up')).toBeInTheDocument();
		expect(screen.queryByLabelText('Flag Description *')).not.toBeInTheDocument();

		expect(screen.getByText('Save Note')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
	});

	test('renders form with note data in edit mode', () => {
		render( 
			<OneOnOneNoteForm
				userId={userId}
				onSubmit={mockOnSubmit}
				onCancel={mockOnCancel}
				note={mockNote}
			/>
		);

		expect(screen.getByText('Update the conversation details below.')).toBeInTheDocument();

		expect(screen.getByLabelText('Date')).toHaveValue('2024-01-15');
		expect(screen.getByLabelText('Talking Points *')).toHaveValue('Discussed project progress and upcoming deadlines.');
		expect(screen.getByLabelText('Happy mood')).toBeInTheDocument();
		
		const flagCheckbox = screen.getByRole('checkbox', { name: 'Flag for follow-up' });
		expect(flagCheckbox).toBeChecked();
		expect(screen.getByLabelText('Flag Description *')).toHaveValue('Need to follow up on workload concerns');

		expect(screen.getByText('Update Note')).toBeInTheDocument();
	});

	test('shows flag description field when flag is checked', () => {
		render(
			<OneOnOneNoteForm
				userId={userId}
				onSubmit={mockOnSubmit}
				onCancel={mockOnCancel}
			/>
		);

		expect(screen.queryByLabelText('Flag Description *')).not.toBeInTheDocument();

		const flagCheckbox = screen.getByRole('checkbox', { name: 'Flag for follow-up' });
		fireEvent.click(flagCheckbox);

		expect(screen.getByLabelText('Flag Description *')).toBeInTheDocument();
	});

	test('handles mood selection', () => {
		render(
			<OneOnOneNoteForm
				userId={userId}
				onSubmit={mockOnSubmit}
				onCancel={mockOnCancel}
			/>
		);

		const neutralMood = screen.getByLabelText('Neutral mood');
		fireEvent.click(neutralMood);

		expect(neutralMood.closest('div')).toHaveClass('border-blue-500');
	});

	test('calls onSubmit with form data when submitted', async () => {
		render(
			<OneOnOneNoteForm
				userId={userId}
				onSubmit={mockOnSubmit}
				onCancel={mockOnCancel}
			/>
		);

		fireEvent.change(screen.getByLabelText('Date'), {
			target: { value: '2024-01-20' },
		});
		fireEvent.change(screen.getByLabelText('Talking Points *'), {
			target: { value: 'New talking points' },
		});
		fireEvent.click(screen.getByLabelText('Neutral mood'));
		fireEvent.click(screen.getByRole('checkbox', { name: 'Flag for follow-up' }));
		fireEvent.change(screen.getByLabelText('Flag Description *'), {
			target: { value: 'Follow up needed' },
		});

		fireEvent.click(screen.getByText('Save Note'));

		await waitFor(() => {
			expect(mockOnSubmit).toHaveBeenCalledWith({
				userId,
				date: '2024-01-20',
				talkingPoints: 'New talking points',
				mood: MOODS.NEUTRAL,
				flag: true,
				flagDescription: 'Follow up needed',
				actionItems: [],
			});
		});
	});

	test('shows error message when submission fails', async () => {
		mockOnSubmit.mockRejectedValueOnce(new Error('Submission failed'));

		render(
			<OneOnOneNoteForm
				userId={userId}
				onSubmit={mockOnSubmit}
				onCancel={mockOnCancel}
			/>
		);

		fireEvent.change(screen.getByLabelText('Talking Points *'), {
			target: { value: 'Test points' },
		});

		fireEvent.click(screen.getByText('Save Note'));

		await waitFor(() => {
			expect(screen.getByText('Failed to save note. Please try again.')).toBeInTheDocument();
		});
	});

	test('shows loading state during submission', async () => {
		mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

		render(
			<OneOnOneNoteForm
				userId={userId}
				onSubmit={mockOnSubmit}
				onCancel={mockOnCancel}
			/>
		);

		fireEvent.change(screen.getByLabelText('Talking Points *'), {
			target: { value: 'Test points' },
		});

		fireEvent.click(screen.getByText('Save Note'));

		expect(screen.getByText('Saving...')).toBeInTheDocument();
		expect(screen.getByText('Saving...')).toBeDisabled();
	});

	test('calls onCancel when cancel button is clicked', () => {
		render(
			<OneOnOneNoteForm
				userId={userId}
				onSubmit={mockOnSubmit}
				onCancel={mockOnCancel}
			/>
		);

		fireEvent.click(screen.getByText('Cancel'));
		expect(mockOnCancel).toHaveBeenCalled();
	});

	test('updates form when note prop changes', () => {
		const { rerender } = render(
			<OneOnOneNoteForm
				userId={userId}
				onSubmit={mockOnSubmit}
				onCancel={mockOnCancel}
			/>
		);

		expect(screen.getByLabelText('Talking Points *')).toHaveValue('');

		rerender(
			<OneOnOneNoteForm
				userId={userId}
				onSubmit={mockOnSubmit}
				onCancel={mockOnCancel}
				note={mockNote}
			/>
		);

		expect(screen.getByLabelText('Talking Points *')).toHaveValue(mockNote.talkingPoints);
		expect(screen.getByLabelText('Date')).toHaveValue(mockNote.date);
		expect(screen.getByRole('checkbox', { name: 'Flag for follow-up' })).toBeChecked();
		expect(screen.getByLabelText('Flag Description *')).toHaveValue(mockNote.flagDescription);
	});

	test('can add action items to the note', () => {
		render(
			<OneOnOneNoteForm
				userId={userId}
				onSubmit={mockOnSubmit}
				onCancel={mockOnCancel}
			/>
		);

		// Verify no action items initially
		expect(screen.queryByText('Action item Test')).not.toBeInTheDocument();

		// Add an action item
		fireEvent.change(screen.getByPlaceholderText('Add a new action item...'), {
			target: { value: 'Action item Test' },
		});
		fireEvent.click(screen.getByText('Add'));

		// Verify action item appears
		expect(screen.getByText('Action item Test')).toBeInTheDocument();

		// Fill in required fields and submit
		fireEvent.change(screen.getByLabelText('Talking Points *'), {
			target: { value: 'Test talking points' },
		});

		fireEvent.click(screen.getByText('Save Note'));

		expect(mockOnSubmit).toHaveBeenCalledWith({
			userId,
			date: '2024-01-20',
			talkingPoints: 'Test talking points',
			mood: MOODS.HAPPY,
			flag: false,
			flagDescription: '',
			actionItems: [{ description: 'Action item Test', done: false, dueDate: '' }],
		});
	});

	test('action items have a due date', () => {
		render(
			<OneOnOneNoteForm
				userId={userId}
				onSubmit={mockOnSubmit}
				onCancel={mockOnCancel}
			/>
		);

		fireEvent.change(screen.getByPlaceholderText('Add a new action item...'), {
			target: { value: 'Action item Test' },
		});
		fireEvent.change(screen.getByLabelText('Due date'), {
			target: { value: '2024-01-20' },
		});
		fireEvent.click(screen.getByText('Add'));

		expect(screen.getByText('Action item Test')).toBeInTheDocument();
		expect(screen.getByText('(Due: 1/20/2024)')).toBeInTheDocument();
	});
}); 