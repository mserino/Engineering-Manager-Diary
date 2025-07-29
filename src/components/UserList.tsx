import type { User } from '../types/User';

interface UserListProps {
	users: User[];
}

export const UserList = ({ users }: UserListProps) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
			{users.map((user) => (
				<a
					key={user.id}
					href={`/user/${user.id}`}
					aria-label={`View details for ${user.name}`}
					className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 block"
				>
					<div className="flex items-center space-x-4">
						<div>
							<h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
							<p className="text-gray-600">{user.role}</p>
						</div>
					</div>
				</a>
			))}
		</div>
	);
}; 