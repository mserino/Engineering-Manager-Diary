import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { userService } from '../services/userService';
import type { User } from '../types/User';

interface UserContextType {
	users: User[];
	loading: boolean;
	error: string | null;
	fetchUsers: () => Promise<void>;
	updateUser: (id: string, userData: Partial<User>) => Promise<void>;
	deleteUser: (id: string) => Promise<void>;
	createUser: (userData: Omit<User, 'id'>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export { UserContext };

interface UserProviderProps {
	children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUsers = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const fetchedUsers = await userService.getAllUsers();
			setUsers(fetchedUsers);
		} catch {
			setError('Failed to fetch users');
		} finally {
			setLoading(false);
		}
	}, []);

	const updateUser = useCallback(async (id: string, userData: Partial<User>) => {
		try {
			await userService.updateUser(id, userData);
			// Update the user in local state
			setUsers(prevUsers => 
				prevUsers.map(user => 
					user.id === id ? { ...user, ...userData } : user
				)
			);
		} catch {
			throw new Error('Failed to update user');
		}
	}, []);

	const deleteUser = useCallback(async (id: string) => {
		try {
			await userService.deleteUser(id);
			// Remove the user from local state
			setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
		} catch {
			throw new Error('Failed to delete user');
		}
	}, []);

	const createUser = useCallback(async (userData: Omit<User, 'id'>) => {
		try {
			const newUser = await userService.createUser(userData);
			// Add the new user to local state
			setUsers(prevUsers => [...prevUsers, newUser]);
		} catch {
			throw new Error('Failed to create user');
		}
	}, []);

	return (
		<UserContext.Provider value={{
			users,
			loading,
			error,
			fetchUsers,
			updateUser,
			deleteUser,
			createUser,
		}}>
			{children}
		</UserContext.Provider>
	);
}; 