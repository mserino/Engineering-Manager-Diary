import { useState, useEffect } from 'react';
import type { User } from '../types/User';
import { userService } from '../services/userService';

export const useUser = (userId: string) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true);
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
	}, [userId]);

	return { user, loading, error };
}; 