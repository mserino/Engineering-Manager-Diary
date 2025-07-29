import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserList } from './components/UserList';
import { useUsers } from './hooks/useUsers';
import { UserPage } from './pages/UserPage';
import { AddUserForm } from './components/AddUserForm';
import { UserProvider } from './contexts/UserContext';
import { Spinner } from './components/Spinner';

function HomePage() {
	const { users, loading, error } = useUsers();

	if (loading) {
		return (
			<div className="emd-container">
				<div className="flex justify-center items-center py-12">
					<Spinner size="lg" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="emd-container">
				<div className="text-xl text-red-600">{error}</div>
			</div>
		);
	}

	return (
		<div className="emd-container">
			<div className="py-8">
				<div className="mb-6 flex justify-between items-center">
					<h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
					<a
						href="/add-user"
						className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
					>
						Add a new team member
					</a>
				</div>
				<UserList users={users} />
			</div>
		</div>
	);
}

function App() {
	return (
		<UserProvider>
			<Router>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/user/:id" element={<UserPage />} />
					<Route path="/add-user" element={<AddUserForm />} />
				</Routes>
			</Router>
		</UserProvider>
	);
}

export default App;
