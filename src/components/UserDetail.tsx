import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';
import { useOneOnOneNotes } from '../hooks/useOneOnOneNotes';
import { EditUserForm } from './EditUserForm';
import { ConfirmationModal } from './ConfirmationModal';
import { OneOnOneNoteForm } from './OneOnOneNoteForm';
import { OneOnOneNotesList } from './OneOnOneNotesList';
import { Modal } from './Modal';
import { Spinner } from './Spinner';
import type { User } from '../types/User';
import type { OneOnOneNote } from '../types/OneOnOneNote';

interface UserDetailProps {
	user: User;
}

export const UserDetail = ({ user }: UserDetailProps) => {
	const navigate = useNavigate();
	const { deleteUser } = useUserContext();
	const { notes, loading: notesLoading, error: notesError, createNote, updateNote, deleteNote } = useOneOnOneNotes(user.id);
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showNoteModal, setShowNoteModal] = useState(false);
	const [editingNote, setEditingNote] = useState<OneOnOneNote | undefined>(undefined);
	const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false);
	const [deletingNoteId, setDeletingNoteId] = useState<string | undefined>(undefined);
	const [isDeletingNote, setIsDeletingNote] = useState(false);

	// Reset edit state when component mounts (when navigating back from edit)
	useEffect(() => {
		setIsEditing(false);
	}, []);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await deleteUser(user.id);
			navigate('/');
		} catch {
			// Handle error silently or show a toast
			setIsDeleting(false);
			setShowDeleteModal(false);
		}
	};

	const handleCreateNote = async (noteData: Omit<OneOnOneNote, 'id' | 'createdAt'>) => {
		await createNote(noteData);
		setShowNoteModal(false);
	};

	const handleEditNote = (note: OneOnOneNote) => {
		setEditingNote(note);
		setShowNoteModal(true);
	};

	const handleUpdateNote = async (noteData: Omit<OneOnOneNote, 'id' | 'createdAt'>) => {
		if (editingNote) {
			await updateNote(editingNote.id, noteData);
			setShowNoteModal(false);
			setEditingNote(undefined);
		}
	};

	const handleDeleteNote = async (noteId: string) => {
		setDeletingNoteId(noteId);
		setShowDeleteNoteModal(true);
	};

	const handleConfirmDeleteNote = async () => {
		if (deletingNoteId) {
			setIsDeletingNote(true);
			try {
				await deleteNote(deletingNoteId);
				setShowDeleteNoteModal(false);
				setDeletingNoteId(undefined);
			} catch {
				// Handle error silently or show a toast
			} finally {
				setIsDeletingNote(false);
			}
		}
	};

	const handleCloseNoteModal = () => {
		setShowNoteModal(false);
		setEditingNote(undefined);
	};

	const handleCloseDeleteNoteModal = () => {
		setShowDeleteNoteModal(false);
		setDeletingNoteId(undefined);
	};

	const handleUpdateNoteFlag = async (
		noteId: string,
		flag: boolean,
		flagDescription?: string,
	) => {
		try {
			await updateNote(noteId, { flag, flagDescription });
		} catch {
			// Handle error silently or show a toast
		}
	};

	if (isEditing) {
		return <EditUserForm user={user} onCancel={() => setIsEditing(false)} />;
	}

	return (
		<>
			<div className="max-w-4xl mx-auto p-6">
				<div className="bg-white rounded-lg shadow-lg p-8 mb-6">
					<div className="flex items-center justify-between mb-8">
						<div className="flex items-center space-x-6">
							<div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
								<span className="text-white font-bold text-2xl">
									{user.name.charAt(0)}
								</span>
							</div>
							<div>
								<h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
								<p className="text-xl text-gray-600">{user.role}</p>
							</div>
						</div>
						<div className="flex gap-3">
							<button
								onClick={() => setIsEditing(true)}
								className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
							>
								Edit
							</button>
							<button
								onClick={() => setShowDeleteModal(true)}
								className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer"
							>
								Remove User
							</button>
						</div>
					</div>

					<div className="space-y-6">
						<div className="border-b border-gray-200 pb-4">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="text-sm font-medium text-gray-500">Birthday</label>
									<p className="text-gray-900">{new Date(user.birthday).toLocaleDateString()}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">Location</label>
									<p className="text-gray-900">{user.location}</p>
								</div>
							</div>
						</div>

						<div className="border-b border-gray-200 pb-4">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h2>
							<div>
								<label className="text-sm font-medium text-gray-500">Hiring Date</label>
								<p className="text-gray-900">{new Date(user.hiringDate).toLocaleDateString()}</p>
							</div>
						</div>

						<div className="pt-4">
							<a
								href="/"
								className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
							>
								← Back to Users
							</a>
						</div>
					</div>
				</div>

				{/* 1:1 Notes Section */}
				<div className="bg-white rounded-lg shadow-lg p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-gray-900">1:1 Notes</h2>
						<button
							onClick={() => setShowNoteModal(true)}
							className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 cursor-pointer"
						>
							Add Note
						</button>
					</div>

					{notesError ? (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-red-600">{notesError}</p>
						</div>
					) : notesLoading ? (
						<div className="flex justify-center items-center py-12">
							<Spinner size="lg" />
						</div>
					) : (
						<OneOnOneNotesList 
							notes={notes} 
							onDelete={handleDeleteNote}
							onEdit={handleEditNote}
							onUpdateFlag={handleUpdateNoteFlag}
						/>
					)}
				</div>
			</div>

			{/* 1:1 Note Modal */}
			<Modal
				isOpen={showNoteModal}
				onClose={handleCloseNoteModal}
				title={editingNote ? 'Edit 1:1 Note' : 'Add 1:1 Note'}
			>
				<OneOnOneNoteForm
					userId={user.id}
					onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
					onCancel={handleCloseNoteModal}
					note={editingNote}
				/>
			</Modal>

			{/* Delete User Modal */}
			<ConfirmationModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDelete}
				title="Remove Team Member"
				message={`Are you sure you want to remove ${user.name}? This action cannot be undone.`}
				confirmText={isDeleting ? 'Removing...' : 'Confirm'}
				cancelText="Cancel"
				confirmButtonClassName="bg-red-500 hover:bg-red-600 disabled:opacity-50"
			/>

			{/* Delete Note Modal */}
			<ConfirmationModal
				isOpen={showDeleteNoteModal}
				onClose={handleCloseDeleteNoteModal}
				onConfirm={handleConfirmDeleteNote}
				title="Delete Note"
				message={`Are you sure you want to delete this note? This action cannot be undone.`}
				confirmText={isDeletingNote ? 'Deleting...' : 'Confirm'}
				cancelText="Cancel"
				confirmButtonClassName="bg-red-500 hover:bg-red-600 disabled:opacity-50"
			/>
		</>
	);
}; 