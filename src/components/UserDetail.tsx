import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';
import { EditUserForm } from './EditUserForm';
import { ConfirmationModal } from './ConfirmationModal';
import type { User } from '../types/User';

interface UserDetailProps {
	user: User;
}

export const UserDetail = ({ user }: UserDetailProps) => {
	const navigate = useNavigate();
	const { deleteUser } = useUserContext();
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

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

	if (isEditing) {
		return <EditUserForm user={user} onCancel={() => setIsEditing(false)} />;
	}

	return (
		<>
			<div className="max-w-2xl mx-auto p-6">
				<div className="bg-white rounded-lg shadow-lg p-8">
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
								className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
							>
								Edit
							</button>
							<button
								onClick={() => setShowDeleteModal(true)}
								className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
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
								className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
							>
								← Back to Users
							</a>
						</div>
					</div>
				</div>
			</div>

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
		</>
	);
}; 