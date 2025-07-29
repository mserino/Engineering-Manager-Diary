import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserList } from './components/UserList';
import { useUsers } from './hooks/useUsers';
import { UserPage } from './pages/UserPage';

function HomePage() {
	const { users, loading, error } = useUsers();

	if (loading) {
		return (
			<div className="flex items-center justify-center container">
				<div className="text-xl text-gray-600">Loading users...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center container">
				<div className="text-xl text-red-600">{error}</div>
			</div>
		);
	}

	return (
		<div className="emd-container">
			<div className="py-8">
				<UserList users={users} />
			</div>
		</div>
	);
}

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/user/:id" element={<UserPage />} />
			</Routes>
		</Router>
	);
}

export default App;
