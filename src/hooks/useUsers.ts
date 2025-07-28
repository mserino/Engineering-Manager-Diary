import { useState, useEffect } from 'react';
import type { User } from '../types/User';
import usersData from '../data/users.json';

export const useUsers = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			setUsers(usersData as User[]);
			setLoading(false);
		} catch {
			setError('Failed to load users');
			setLoading(false);
		}
	}, []);

	return { users, loading, error };
}; 