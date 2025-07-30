import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext/context';

export const useAuth = () => useContext(AuthContext); 
