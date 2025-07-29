import { useEffect } from 'react';
import { useUserContext } from './useUserContext';

export const useUsers = () => {
	const { users, loading, error, fetchUsers } = useUserContext();

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return { users, loading, error };
}; 