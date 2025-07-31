import { useState } from 'react';
import type { OneOnOneNote } from '../types/OneOnOneNote';
import { MOOD_LABELS } from '../types/Mood';

interface OneOnOneNotesListProps {
	notes: OneOnOneNote[];
	onDelete?: (noteId: string) => Promise<void>;
	onEdit?: (note: OneOnOneNote) => void;
	onUpdateFlag?: (noteId: string, flag: boolean) => Promise<void>;
}

export const OneOnOneNotesList = ({ notes, onDelete, onEdit, onUpdateFlag }: OneOnOneNotesListProps) => {
	const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

	const toggleNote = (noteId: string) => {
		const newExpanded = new Set(expandedNotes);
		if (newExpanded.has(noteId)) {
			newExpanded.delete(noteId);
		} else {
			newExpanded.add(noteId);
		}
		setExpandedNotes(newExpanded);
	};

	const handleCardClick = (noteId: string, event: React.MouseEvent) => {
		// Don't toggle if clicking on action buttons
		if ((event.target as HTMLElement).closest('button')) {
			return;
		}
		toggleNote(noteId);
	};

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
				<div
					key={note.id}
					className={`bg-white rounded-lg shadow-md border-l-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 ${
						note.flag ? 'border-red-500' : 'border-blue-500'
					}`}
					onClick={(e) => handleCardClick(note.id, e)}
					data-testid={`note-card-${note.id}`}
					role="article"
					aria-label={`Note from ${new Date(note.date).toLocaleDateString()}`}
				>
					<div className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4 flex-1">
								<span className="text-2xl" aria-label={MOOD_LABELS[note.mood].ariaLabel}>
									{note.mood}
								</span>
								<div className="flex-1">
									<div className="flex items-center space-x-3">
										<span className="text-sm font-medium text-gray-900">
											{new Date(note.date).toLocaleDateString()}
										</span>
										<span className="text-xs text-gray-500">
											Created {new Date(note.createdAt).toLocaleDateString()}
										</span>
										{note.flag && (
											<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
												Flagged
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="flex items-center">
								<svg 
									className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
										expandedNotes.has(note.id) ? 'rotate-180' : ''
									}`} 
									fill="none" 
									stroke="currentColor" 
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						</div>
						
						{expandedNotes.has(note.id) && (
							<div className="border-t border-gray-100 mt-4 pt-4">
								<div className="prose prose-sm max-w-none mb-4">
									<div className="whitespace-pre-wrap text-gray-700">{note.talkingPoints}</div>
								</div>

								{note.flagDescription && note.flag && (
									<div className="mt-4 bg-red-50 rounded-lg p-4 flex items-center justify-between gap-4">
										<div className="flex items-center gap-2">
											<svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
											</svg>
											<div>
												<span className="font-medium text-red-800">Flag Reason:</span>
												<p className="text-red-700">{note.flagDescription}</p>
											</div>
										</div>
										{onUpdateFlag && note.flag && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													onUpdateFlag(note.id, false);
												}}
												className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 cursor-pointer shadow-sm"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
												</svg>
												Mark as Resolved
											</button>
										)}
									</div>
								)}
								
								{(onEdit || onDelete || (onUpdateFlag && note.flag)) && (
									<div className="flex gap-2 pt-3 border-t border-gray-100">
										{onEdit && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													onEdit(note);
												}}
												className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
											>
												Edit Note
											</button>
										)}
										{onDelete && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													onDelete(note.id);
												}}
												className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 cursor-pointer"
											>
												Remove Note
											</button>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
}; 