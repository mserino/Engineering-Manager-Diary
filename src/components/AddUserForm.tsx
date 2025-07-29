import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';

export const AddUserForm = () => {
	const navigate = useNavigate();
	const { createUser } = useUserContext();
	const [formData, setFormData] = useState({
		name: '',
		role: '',
		birthday: '',
		hiringDate: '',
		location: '',
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
			await createUser(formData);
			navigate('/');
		} catch {
			setError('Failed to create user. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="emd-container">
			<div className="bg-white rounded-lg shadow-lg p-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Add New Team Member</h1>
					<p className="text-gray-600 mt-2">Fill in the details below to add a new team member.</p>
				</div>

				{error && (
					<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-red-600">{error}</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
							Full Name <span className="text-red-500">*</span>
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
							Role <span className="text-red-500">*</span>
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
							Birthday <span className="text-red-500">*</span>
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
							Hiring Date <span className="text-red-500">*</span>
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
							Location <span className="text-red-500">*</span>
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
							className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						>
							{loading ? 'Adding...' : 'Add Team Member'}
						</button>
						<a
							href="/"
							className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200 text-center cursor-pointer"
						>
							Cancel
						</a>
					</div>
				</form>
			</div>
		</div>
	);
}; 