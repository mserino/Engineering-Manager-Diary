import type { User } from '../types/User';
import { useUserNotesSummary } from '../hooks/useUserNotesSummary';

interface UserListProps {
	users: User[];
}

export const UserList = ({ users }: UserListProps) => {
	const summary = useUserNotesSummary(users.map(user => user.id));

	const today = new Date();
	const usersWithBirthday = users.filter(
		( user ) =>
			user.birthday &&
			new Date( user.birthday ).getDate() === today.getDate() &&
			new Date( user.birthday ).getMonth() === today.getMonth()
	);

	const usersWithWorkAnniversary = users.filter(
		( user ) =>
			user.hiringDate &&
			new Date( user.hiringDate ).getDate() === today.getDate() &&
			new Date( user.hiringDate ).getMonth() === today.getMonth()
	);

	return (
	<div className="flex flex-col gap-6">
		{(usersWithBirthday.length > 0 || usersWithWorkAnniversary.length > 0) && (
			<div className="flex flex-row gap-4">
				{usersWithBirthday.length > 0 && (
					<div className="flex flex-col gap-4 bg-pink-50 border border-pink-200 rounded-lg p-4 mb-2">
						<div className="flex items-center gap-3 mb-2">
							<span className="text-xl" role="img" aria-label="tada">🎉</span>
							<h2 className="text-xl font-bold text-pink-700">Today is someone's birthday!</h2>
						</div>
						
						<div className="flex flex-wrap gap-3">
							{usersWithBirthday.map((user) => (
								<div
									key={user.id}
									className="flex items-center gap-2 bg-white border border-pink-100 rounded-md p-2 shadow-sm"
									data-testid="birthday-card"
								>
									<span className="text-sm font-semibold text-pink-800">{user.name}</span>
								</div>
							))}
						</div>
					</div>
				)}
				{usersWithWorkAnniversary.length > 0 && (
					<div className="flex flex-col gap-4 bg-teal-50 border border-teal-200 rounded-lg p-4 mb-2">
						<div className="flex items-center gap-3 mb-2">
							<span className="text-xl" role="img" aria-label="tada">🎉</span>
							<h2 className="text-xl font-bold text-teal-700">Today is someone's work anniversary!</h2>
						</div>
						<div className="flex flex-wrap gap-3">
							{usersWithWorkAnniversary.map((user) => (
								<div
									key={user.id}
									className="flex items-center gap-2 bg-white border border-teal-100 rounded-md p-2 shadow-sm"
									data-testid="work-anniversary-card"
								>
									<span className="text-sm font-semibold text-teal-800">{user.name}</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		)}

		{users.map((user) => {
			const userSummary = summary[user.id] || { totalNotes: 0, flaggedNotes: 0, lastNoteMood: null };
			return (
				<a
					key={user.id}
					href={`/user/${user.id}`}
					aria-label={`View details for ${user.name}`}
					className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 block"
				>
					<div className="flex justify-between items-center space-x-4">
						<div>
							<h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
								<span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-base">
									{user.name.charAt(0)}
								</span>
								{user.name}
								{userSummary.lastNoteMood && (
									<span className="inline-flex items-center px-2 py-0.5 rounded-full text-lg font-large">
										{userSummary.lastNoteMood}
									</span>
								)}
							</h3>
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