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
    FirestoreError,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User } from '../types/User';

const COLLECTION_NAME = 'users';

const handleFirebaseError = (error: unknown) => {
    if (error instanceof FirestoreError) {
        if (error.code === 'permission-denied') {
            throw new Error('You must be logged in to perform this action');
        }
    }
    throw error;
};

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
            handleFirebaseError(error);
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
            handleFirebaseError(error);
            throw new Error('Failed to fetch user');
        }
    },

    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), userData);
            return {
                id: docRef.id,
                ...userData,
            };
        } catch (error) {
            handleFirebaseError(error);
            throw new Error('Failed to create user');
        }
    },

    async updateUser(id: string, userData: Partial<User>): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, userData);
        } catch (error) {
            handleFirebaseError(error);
            throw new Error('Failed to update user');
        }
    },

    async deleteUser(id: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            handleFirebaseError(error);
            throw new Error('Failed to delete user');
        }
    },
}; 