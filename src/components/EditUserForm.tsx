import { useState } from 'react';
import { useUserContext } from '../hooks/useUserContext';
import type { User } from '../types/User';

interface EditUserFormProps {
	user: User;
	onCancel: () => void;
}

export const EditUserForm = ({ user, onCancel }: EditUserFormProps) => {
	const { updateUser } = useUserContext();
	const [formData, setFormData] = useState({
		name: user.name,
		role: user.role,
		birthday: user.birthday,
		hiringDate: user.hiringDate,
		location: user.location,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			console.log('Updating user:', user.id, formData);
			await updateUser(user.id, formData);
			console.log('User updated successfully, exiting edit mode');
			onCancel(); // Exit edit mode instead of navigating
		} catch (err) {
			console.error('Error updating user:', err);
			setError('Failed to update user. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6">
			<div className="bg-white rounded-lg shadow-lg p-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Edit Team Member</h1>
					<p className="text-gray-600 mt-2">Update the details below for {user.name}.</p>
				</div>

				{error && (
					<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-red-600">{error}</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
							Full Name *
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Enter full name"
						/>
					</div>

					<div>
						<label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
							Role *
						</label>
						<input
							type="text"
							id="role"
							name="role"
							value={formData.role}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Enter job role"
						/>
					</div>

					<div>
						<label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-2">
							Birthday *
						</label>
						<input
							type="date"
							id="birthday"
							name="birthday"
							value={formData.birthday}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<div>
						<label htmlFor="hiringDate" className="block text-sm font-medium text-gray-700 mb-2">
							Hiring Date *
						</label>
						<input
							type="date"
							id="hiringDate"
							name="hiringDate"
							value={formData.hiringDate}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<div>
						<label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
							Location *
						</label>
						<input
							type="text"
							id="location"
							name="location"
							value={formData.location}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Enter location (e.g., New York, NY)"
						/>
					</div>

					<div className="flex gap-4 pt-6">
						<button
							type="submit"
							disabled={loading}
							className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? 'Updating...' : 'Update Team Member'}
						</button>
						<button
							type="button"
							onClick={onCancel}
							className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}; 