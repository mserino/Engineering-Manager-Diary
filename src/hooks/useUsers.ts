import { useState, useEffect } from 'react';
import type { User } from '../types/User';
import { userService } from '../services/userService';

export const useUsers = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const fetchedUsers = await userService.getAllUsers();
				setUsers(fetchedUsers);
				setError(null);
			} catch {
				setError('Failed to load users');
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	return { users, loading, error };
}; 