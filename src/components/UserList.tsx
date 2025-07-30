import type { User } from '../types/User';
import { useUserNotesSummary } from '../hooks/useUserNotesSummary';

interface UserListProps {
	users: User[];
}

export const UserList = ({ users }: UserListProps) => {
	const summary = useUserNotesSummary(users.map(user => user.id));

	return (
	<div className="flex flex-col gap-6">
		{users.map((user) => {
			const userSummary = summary[user.id] || { totalNotes: 0, flaggedNotes: 0 };
			return (
				<a
					key={user.id}
					href={`/user/${user.id}`}
					aria-label={`View details for ${user.name}`}
					className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 block"
				>
					<div className="flex justify-between items-center space-x-4">
						<div>
							<h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
							<p className="text-gray-600">{user.role}</p>
						</div>
						{userSummary.totalNotes > 0 && (
							<div className="flex flex-col items-end space-x-2 mt-2">
								<span className="text-sm text-gray-500">
									{userSummary.totalNotes} notes
								</span>
								{userSummary.flaggedNotes > 0 && (
									<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
										{userSummary.flaggedNotes} flagged
									</span>
								)}
							</div>
						)}
					</div>
				</a>
			);
		})}
	</div>
	);
}; 