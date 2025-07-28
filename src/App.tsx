import './App.css'
import { UserList } from './components/UserList';
import { useUsers } from './hooks/useUsers';

function App() {
	const { users, loading, error } = useUsers();

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-xl text-gray-600">Loading users...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-xl text-red-600">{error}</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto py-8">
				<h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
					Engineering Manager Diary
				</h1>
				<UserList users={users} />
			</div>
		</div>
	);
}

export default App;
