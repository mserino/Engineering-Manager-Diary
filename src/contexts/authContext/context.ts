import { createContext } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';

export interface AuthContextType {
    currentUser: FirebaseUser | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    loading: true,
    signOut: async () => {},
}); 