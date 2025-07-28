import './App.css'
import { UserList } from './components/UserList';
import { useUsers } from './hooks/useUsers';

function App() {
	const { users, loading, error } = useUsers();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-xl text-gray-600">Loading users...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-xl text-red-600">{error}</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<div className="container mx-auto py-8">
				<UserList users={users} />
			</div>
		</div>
	);
}

export default App;
