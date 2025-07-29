import { useParams } from 'react-router-dom';
import { UserDetail } from '../components/UserDetail';
import { useUser } from '../hooks/useUser';

export const UserPage = () => {
	const { id } = useParams<{ id: string }>();
	const userId = parseInt(id || '0', 10);
	const { user, loading, error } = useUser(userId);

	if (loading) {
		return (
			<div className="emd-container">
				<div className="text-xl text-gray-600">Loading user...</div>
			</div>
		);
	}

	if (error || !user) {
		return (
			<div className="emd-container">
				<div className="text-center">
					<div className="text-xl text-red-600 mb-4">{error || 'User not found'}</div>
					<a
						href="/"
						className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
					>
						← Back to Users
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="emd-container">
			<div className="container mx-auto">
				<UserDetail user={user} />
			</div>
		</div>
	);
}; 