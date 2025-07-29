import {
	collection,
	doc,
	getDocs,
	getDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User } from '../types/User';

const COLLECTION_NAME = 'users';

export const userService = {
	async getAllUsers(): Promise<User[]> {
		try {
			const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as User[];
		} catch (error) {
			console.error('Error fetching users:', error);
			throw new Error('Failed to fetch users');
		}
	},

	async getUserById(id: string): Promise<User | null> {
		try {
			const docRef = doc(db, COLLECTION_NAME, id);
			const docSnap = await getDoc(docRef);
			
			if (docSnap.exists()) {
				return {
					id: docSnap.id,
					...docSnap.data(),
				} as User;
			}
			return null;
		} catch (error) {
			console.error('Error fetching user:', error);
			throw new Error('Failed to fetch user');
		}
	},

	async createUser(userData: Omit<User, 'id'>): Promise<User> {
		try {
			const docRef = await addDoc(collection(db, COLLECTION_NAME), userData);
			return {
				id: docRef.id,
				...userData,
			} as User;
		} catch (error) {
			console.error('Error creating user:', error);
			throw new Error('Failed to create user');
		}
	},

	async updateUser(id: string, userData: Partial<User>): Promise<void> {
		try {
			const docRef = doc(db, COLLECTION_NAME, id);
			await updateDoc(docRef, userData);
		} catch (error) {
			console.error('Error updating user:', error);
			throw new Error('Failed to update user');
		}
	},

	async deleteUser(id: string): Promise<void> {
		try {
			const docRef = doc(db, COLLECTION_NAME, id);
			await deleteDoc(docRef);
		} catch (error) {
			console.error('Error deleting user:', error);
			throw new Error('Failed to delete user');
		}
	},
}; 