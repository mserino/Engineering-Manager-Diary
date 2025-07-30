vi.mock('../services/oneOnOneService', () => ({
	oneOnOneService: {
		getNotesByUserId: vi.fn(),
		createNote: vi.fn(),
		updateNote: vi.fn(),
		deleteNote: vi.fn(),
	},
}));

import { describe, expect, test, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useOneOnOneNotes } from './useOneOnOneNotes';
import type { OneOnOneNote } from '../types/OneOnOneNote';
import { MOODS } from '../types/Mood';
import { oneOnOneService } from '../services/oneOnOneService';

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

const mockOneOnOneService = vi.mocked(oneOnOneService);

describe('useOneOnOneNotes', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockOneOnOneService.getNotesByUserId.mockReset();
		mockOneOnOneService.createNote.mockReset();
		mockOneOnOneService.updateNote.mockReset();
		mockOneOnOneService.deleteNote.mockReset();
	});

	test('returns initial state', async () => {
		mockOneOnOneService.getNotesByUserId.mockResolvedValue([]);

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.notes).toEqual([]);
		expect(result.current.error).toBe(null);
		expect(typeof result.current.fetchNotes).toBe('function');
		expect(typeof result.current.createNote).toBe('function');
		expect(typeof result.current.updateNote).toBe('function');
		expect(typeof result.current.deleteNote).toBe('function');
	});

	test('fetches notes on mount', async () => {
		mockOneOnOneService.getNotesByUserId.mockResolvedValue(mockNotes);

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
			expect(result.current.notes).toEqual(mockNotes);
		});

		expect(mockOneOnOneService.getNotesByUserId).toHaveBeenCalledWith('user1');
		expect(result.current.error).toBe(null);
	});

	test('handles fetch error', async () => {
		mockOneOnOneService.getNotesByUserId.mockRejectedValue(new Error('Fetch failed'));

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
			expect(result.current.error).toBe('Failed to fetch notes');
		});

		expect(result.current.notes).toEqual([]);
	});

	test('creates note successfully', async () => {
		mockOneOnOneService.getNotesByUserId.mockResolvedValue([]);
		const newNote: OneOnOneNote = {
			id: '3',
			userId: 'user1',
			date: '2024-01-20',
			talkingPoints: 'New note content',
			mood: MOODS.HAPPY,
			flag: false,
			createdAt: '2024-01-20T10:00:00Z',
		};
		mockOneOnOneService.createNote.mockResolvedValue(newNote);

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const noteData = {
			userId: 'user1',
			date: '2024-01-20',
			talkingPoints: 'New note content',
			mood: MOODS.HAPPY,
			flag: false,
		};

		await act(async () => {
			await result.current.createNote(noteData);
		});

		expect(mockOneOnOneService.createNote).toHaveBeenCalledWith(noteData);
		expect(result.current.notes).toEqual([newNote]);
	});

	test('handles create note error', async () => {
		mockOneOnOneService.getNotesByUserId.mockResolvedValue([]);
		mockOneOnOneService.createNote.mockRejectedValue(new Error('Create failed'));

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const noteData = {
			userId: 'user1',
			date: '2024-01-20',
			talkingPoints: 'New note content',
			mood: MOODS.HAPPY,
			flag: false,
		};

		await expect(result.current.createNote(noteData)).rejects.toThrow('Failed to create note');
	});

	test('updates note successfully', async () => {
		mockOneOnOneService.getNotesByUserId.mockResolvedValue(mockNotes);
		mockOneOnOneService.updateNote.mockResolvedValue(undefined);

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
			expect(result.current.notes).toEqual(mockNotes);
		});

		const updateData = {
			talkingPoints: 'Updated content',
			mood: MOODS.SAD,
		};

		await act(async () => {
			await result.current.updateNote('1', updateData);
		});

		expect(mockOneOnOneService.updateNote).toHaveBeenCalledWith('1', updateData);
		expect(result.current.notes[0]).toEqual({
			...mockNotes[0],
			...updateData,
		});
	});

	test('handles update note error', async () => {
		mockOneOnOneService.getNotesByUserId.mockResolvedValue(mockNotes);
		mockOneOnOneService.updateNote.mockRejectedValue(new Error('Update failed'));

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const updateData = {
			talkingPoints: 'Updated content',
			mood: MOODS.SAD,
		};

		await expect(result.current.updateNote('1', updateData)).rejects.toThrow('Failed to update note');
	});

	test('deletes note successfully', async () => {
		mockOneOnOneService.getNotesByUserId.mockResolvedValue(mockNotes);
		mockOneOnOneService.deleteNote.mockResolvedValue(undefined);

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
			expect(result.current.notes).toEqual(mockNotes);
		});

		await act(async () => {
			await result.current.deleteNote('1');
		});

		expect(mockOneOnOneService.deleteNote).toHaveBeenCalledWith('1');
		expect(result.current.notes).toHaveLength(1);
		expect(result.current.notes[0]).toBeDefined();
		expect(result.current.notes[0]!.id).toBe('2');
	});

	test('handles delete note error', async () => {
		mockOneOnOneService.getNotesByUserId.mockResolvedValue(mockNotes);
		mockOneOnOneService.deleteNote.mockRejectedValue(new Error('Delete failed'));

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		await expect(result.current.deleteNote('1')).rejects.toThrow('Failed to delete note');
	});

	test('refetches notes when fetchNotes is called', async () => {
		mockOneOnOneService.getNotesByUserId.mockResolvedValue([]);

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		// Change the mock to return different data
		mockOneOnOneService.getNotesByUserId.mockResolvedValue(mockNotes);

		await act(async () => {
			await result.current.fetchNotes();
		});

		expect(mockOneOnOneService.getNotesByUserId).toHaveBeenCalledTimes(2);
		expect(result.current.notes).toEqual(mockNotes);
	});

	test('handles fetch error when manually called', async () => {
		mockOneOnOneService.getNotesByUserId.mockResolvedValue([]);

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		// Change the mock to reject
		mockOneOnOneService.getNotesByUserId.mockRejectedValue(new Error('Fetch failed'));

		await act(async () => {
			await result.current.fetchNotes();
		});

		expect(result.current.error).toBe('Failed to fetch notes');
		expect(result.current.notes).toEqual([]);
	});

	test('optimistically updates notes on create', async () => {
		mockOneOnOneService.getNotesByUserId.mockResolvedValue([]);
		const newNote: OneOnOneNote = {
			id: '3',
			userId: 'user1',
			date: '2024-01-20',
			talkingPoints: 'New note content',
			mood: MOODS.HAPPY,
			flag: false,
			createdAt: '2024-01-20T10:00:00Z',
		};
		mockOneOnOneService.createNote.mockResolvedValue(newNote);

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const noteData = {
			userId: 'user1',
			date: '2024-01-20',
			talkingPoints: 'New note content',
			mood: MOODS.HAPPY,
			flag: false,
		};

		let createdNote;
		await act(async () => {
			createdNote = await result.current.createNote(noteData);
		});

		expect(createdNote).toEqual(newNote);
		expect(result.current.notes).toEqual([newNote]);
	});

	test('optimistically updates notes on update', async () => {
		mockOneOnOneService.getNotesByUserId.mockResolvedValue(mockNotes);
		mockOneOnOneService.updateNote.mockResolvedValue(undefined);

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
			expect(result.current.notes).toEqual(mockNotes);
		});

		const updateData = {
			talkingPoints: 'Updated content',
			mood: MOODS.SAD,
		};

		await act(async () => {
			await result.current.updateNote('1', updateData);
		});

		expect(result.current.notes).toHaveLength(2);
		expect(result.current.notes[0]).toBeDefined();
		expect(result.current.notes[0]).toEqual({
			...mockNotes[0],
			...updateData,
		});
	});

	test('optimistically removes notes on delete', async () => {
		mockOneOnOneService.getNotesByUserId.mockResolvedValue(mockNotes);
		mockOneOnOneService.deleteNote.mockResolvedValue(undefined);

		const { result } = renderHook(() => useOneOnOneNotes('user1'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
			expect(result.current.notes).toEqual(mockNotes);
		});

		await act(async () => {
			await result.current.deleteNote('1');
		});

		expect(result.current.notes).toHaveLength(1);
		expect(result.current.notes[0]?.id).toBe('2');
	});
}); 