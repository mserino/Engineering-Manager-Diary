import type { OneOnOneNote } from '../types/OneOnOneNote';
import { OneOnOneNoteSingle } from './OneOnOneNote';

interface OneOnOneNotesListProps {
	notes: OneOnOneNote[];
	onDelete?: (noteId: string) => Promise<void>;
	onEdit?: (note: OneOnOneNote) => void;
	onUpdateFlag?: (noteId: string, flag: boolean) => Promise<void>;
}

export const OneOnOneNotesList = ({ notes, onDelete, onEdit, onUpdateFlag }: OneOnOneNotesListProps) => {

	if (notes.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">
				<p>No 1:1 notes yet. Add your first note to get started!</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{notes.map((note) => (
				<OneOnOneNoteSingle key={note.id} note={note} onDelete={onDelete} onEdit={onEdit} onUpdateFlag={onUpdateFlag} />
			))}
		</div>
	);
}; 