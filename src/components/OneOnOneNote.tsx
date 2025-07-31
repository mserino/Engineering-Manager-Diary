import { useState } from "react";
import { MOOD_LABELS } from "../types/Mood";
import type { OneOnOneNote } from "../types/OneOnOneNote";
import { ConfirmationModal } from "./ConfirmationModal";

interface OneOnOneNoteProps {
	note: OneOnOneNote;
	onDelete?: (noteId: string) => Promise<void>;
	onEdit?: (note: OneOnOneNote) => void;
	onUpdateFlag?: (noteId: string, flag: boolean, flagDescription?: string) => Promise<void>;
}

export const OneOnOneNoteSingle = ({ note, onDelete, onEdit, onUpdateFlag }: OneOnOneNoteProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [showResolveModal, setShowResolveModal] = useState(false);
	const [isResolving, setIsResolving] = useState(false);

	const handleCardClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsExpanded(!isExpanded);
	};

	const handleResolveFlag = async () => {
		if (!onUpdateFlag) return;
		
		setIsResolving(true);
		try {
			await onUpdateFlag(note.id, false, '');
		} finally {
			setIsResolving(false);
			setShowResolveModal(false);
		}
	};

	return (
		<>
			<div
				key={note.id}
				className={`bg-white rounded-lg shadow-md border-l-4 hover:shadow-lg transition-shadow duration-200 ${
					note.flag ? 'border-red-500' : 'border-blue-500'
				}`}
				role="article"
				aria-label={`Note from ${new Date(note.date).toLocaleDateString()}`}
			>
				<div
					className="flex items-center justify-between p-4 cursor-pointer"
					onClick={handleCardClick}
					data-testid={`note-card-${note.id}`}
				>
					<div className="flex items-center space-x-4 flex-1">
						<span className="text-2xl" aria-label={MOOD_LABELS[note.mood].ariaLabel}>
							{note.mood}
						</span>
						<div className="flex-1">
							<div className="flex items-center space-x-3">
								<div className="flex flex-col">
									<span className="text-sm font-medium text-gray-900">
										{new Date(note.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
									</span>
									<span className="text-xs text-gray-500">
										Created {new Date(note.createdAt).toLocaleDateString()}
									</span>
								</div>
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
								isExpanded ? 'rotate-180' : ''
							}`} 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</div>
				{isExpanded && (
					<div className="border-t border-gray-100 p-4">
						<div className="prose prose-sm max-w-none mb-4">
							<h3 className="text-lg font-semibold text-gray-900">Talking Points</h3>
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
											setShowResolveModal(true);
										}}
										disabled={isResolving}
										className="flex items-center gap-1 px-3 py-1.5 text-sm border-red-500 border-2 text-red-600 rounded-md hover:bg-red-500/10 hover:text-red-600 transition-colors duration-200 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
							<div className="flex gap-2 pt-4 border-t border-gray-100 mt-4 justify-end">
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

			<ConfirmationModal
				isOpen={showResolveModal}
				onClose={() => setShowResolveModal(false)}
				onConfirm={handleResolveFlag}
				title="Resolve Flag"
				message={`Are you sure you want to resolve the flag "${note.flagDescription}"? This will remove the flag from the note.`}
				confirmText={isResolving ? 'Resolving...' : 'Confirm'}
				confirmButtonClassName="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
				cancelText="Cancel"
				isConfirmDisabled={isResolving}
			/>
		</>
	);
};