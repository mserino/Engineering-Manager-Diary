import { useState, useEffect } from 'react';
import type { User } from '../types/User';
import { userService } from '../services/userService';
import { useUserContext } from './useUserContext';

export const useUser = (userId: string) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { users } = useUserContext();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true);
				
				// First check if user exists in context (for updated data)
				const contextUser = users.find(u => u.id === userId);
				if (contextUser) {
					setUser(contextUser);
					setError(null);
					setLoading(false);
					return;
				}

				// If not in context, fetch from service
				const fetchedUser = await userService.getUserById(userId);

				if (fetchedUser) {
					setUser(fetchedUser);
					setError(null);
				} else {
					setError('User not found');
				}
			} catch {
				setError('Failed to load user');
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [userId, users]);

	return { user, loading, error };
}; 