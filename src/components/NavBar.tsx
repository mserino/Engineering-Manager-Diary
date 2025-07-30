import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const NavBar = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch {
            // Error handling is done by Firebase
        }
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <a href="/" className="text-xl font-bold text-gray-900">
                                EM Diary
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={handleSignOut}
                            className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}; 