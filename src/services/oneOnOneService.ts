import {
	collection,
	doc,
	getDocs,
	getDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
	orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { OneOnOneNote } from '../types/OneOnOneNote';

const COLLECTION_NAME = 'oneOnOneNotes';

export const oneOnOneService = {
	async getNotesByUserId(userId: string): Promise<OneOnOneNote[]> {
		try {
			const q = query(
				collection(db, COLLECTION_NAME),
				where('userId', '==', userId),
				orderBy('date', 'desc')
			);
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as OneOnOneNote[];
		} catch (error) {
			console.error('Error fetching notes:', error);
			throw new Error('Failed to fetch notes');
		}
	},

	async getNoteById(id: string): Promise<OneOnOneNote | null> {
		try {
			const docRef = doc(db, COLLECTION_NAME, id);
			const docSnap = await getDoc(docRef);
			
			if (docSnap.exists()) {
				return {
					id: docSnap.id,
					...docSnap.data(),
				} as OneOnOneNote;
			}
			return null;
		} catch (error) {
			console.error('Error fetching note:', error);
			throw new Error('Failed to fetch note');
		}
	},

	async createNote(noteData: Omit<OneOnOneNote, 'id' | 'createdAt'>): Promise<OneOnOneNote> {
		try {
			const docRef = await addDoc(collection(db, COLLECTION_NAME), {
				...noteData,
				createdAt: new Date().toISOString(),
			});
			return {
				id: docRef.id,
				...noteData,
				createdAt: new Date().toISOString(),
			} as OneOnOneNote;
		} catch (error) {
			console.error('Error creating note:', error);
			throw new Error('Failed to create note');
		}
	},

	async updateNote(id: string, noteData: Partial<OneOnOneNote>): Promise<void> {
		try {
			const docRef = doc(db, COLLECTION_NAME, id);
			await updateDoc(docRef, noteData);
		} catch (error) {
			console.error('Error updating note:', error);
			throw new Error('Failed to update note');
		}
	},

	async deleteNote(id: string): Promise<void> {
		try {
			const docRef = doc(db, COLLECTION_NAME, id);
			await deleteDoc(docRef);
		} catch (error) {
			console.error('Error deleting note:', error);
			throw new Error('Failed to delete note');
		}
	},
}; 