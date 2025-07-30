import { useState, useEffect, useCallback } from 'react';
import { oneOnOneService } from '../services/oneOnOneService';
import type { OneOnOneNote } from '../types/OneOnOneNote';

export const useOneOnOneNotes = (userId: string) => {
	const [notes, setNotes] = useState<OneOnOneNote[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchNotes = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const fetchedNotes = await oneOnOneService.getNotesByUserId(userId);
			setNotes(fetchedNotes);
		} catch {
			setError('Failed to fetch notes');
		} finally {
			setLoading(false);
		}
	}, [userId]);

	const createNote = useCallback(async (noteData: Omit<OneOnOneNote, 'id' | 'createdAt'>) => {
		try {
			const newNote = await oneOnOneService.createNote(noteData);
			setNotes(prevNotes => [newNote, ...prevNotes]);
			return newNote;
		} catch {
			throw new Error('Failed to create note');
		}
	}, []);

	const updateNote = useCallback(async (id: string, noteData: Partial<OneOnOneNote>) => {
		try {
			await oneOnOneService.updateNote(id, noteData);
			setNotes(prevNotes => 
				prevNotes.map(note => 
					note.id === id ? { ...note, ...noteData } : note
				)
			);
		} catch {
			throw new Error('Failed to update note');
		}
	}, []);

	const deleteNote = useCallback(async (id: string) => {
		try {
			await oneOnOneService.deleteNote(id);
			setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
		} catch {
			throw new Error('Failed to delete note');
		}
	}, []);

	useEffect(() => {
		fetchNotes();
	}, [fetchNotes]);

	return {
		notes,
		loading,
		error,
		fetchNotes,
		createNote,
		updateNote,
		deleteNote,
	};
}; 