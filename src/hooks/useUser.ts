import { useState, useEffect } from 'react';
import type { User } from '../types/User';
import usersData from '../data/users.json';

export const useUser = (userId: number) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			const users = usersData as User[];
			const foundUser = users.find((u) => u.id === userId);
			
			if (foundUser) {
				setUser(foundUser);
			} else {
				setError('User not found');
			}
			setLoading(false);
		} catch {
			setError('Failed to load user');
			setLoading(false);
		}
	}, [userId]);

	return { user, loading, error };
}; 