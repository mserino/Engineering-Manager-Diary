import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { OneOnOneNote } from '../types/OneOnOneNote';

interface UserNotesSummary {
	[userId: string]: {
		totalNotes: number;
		flaggedNotes: number;
		lastNoteMood: string | null;
	};
}

export const useUserNotesSummary = (userIds: string[]) => {
	const [summary, setSummary] = useState<UserNotesSummary>({});

	useEffect(() => {
		const fetchSummary = async () => {
			if (!userIds.length) return;

			try {
				const q = query(
					collection(db, 'oneOnOneNotes'),
					where('userId', 'in', userIds)
				);
				const querySnapshot = await getDocs(q);
				const notes = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as OneOnOneNote[];

				const newSummary = notes.reduce((acc, note) => {
					if (!acc[note.userId]) {
						acc[note.userId] = {
							totalNotes: 0,
							flaggedNotes: 0,
							lastNoteMood: null,
						};
					}
					acc[note.userId]!.totalNotes++;
					if (note.flag) {
						acc[note.userId]!.flaggedNotes++;
					}
					if (
						!acc[note.userId]!.lastNoteMood ||
						new Date(note.date) < new Date((acc[note.userId] as unknown as { date: string })?.date ?? 0)
					) {
						acc[note.userId]!.lastNoteMood = note.mood;
					}
					return acc;
				}, {} as UserNotesSummary);

				// Initialize summary for users with no notes
				userIds.forEach((userId) => {
					if (!newSummary[userId]) {
						newSummary[userId] = {
							totalNotes: 0,
							flaggedNotes: 0,
							lastNoteMood: null,
						};
					}
				});

				setSummary(newSummary);
			} catch (error) {
				console.error('Error fetching notes summary:', error);
			}
		};

		fetchSummary();
	}, [userIds]);

	return summary;
}; 