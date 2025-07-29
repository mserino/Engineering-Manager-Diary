import type { User } from '../types/User';

interface UserDetailProps {
	user: User;
}

export const UserDetail = ({ user }: UserDetailProps) => {
	return (
		<div className="max-w-2xl mx-auto p-6">
			<div className="bg-white rounded-lg shadow-lg p-8">
				<div className="flex items-center space-x-6 mb-8">
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
							className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
						>
							← Back to Users
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}; 