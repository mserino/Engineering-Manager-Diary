import { userService } from '../services/userService';

const initialUsers = [
	{
		name: 'John Doe',
		role: 'Senior Frontend Engineer',
		birthday: '1990-01-01',
		hiringDate: '2020-01-01',
		location: 'New York, NY',
	},
	{
		name: 'Jane Doe',
		role: 'Senior Backend Engineer',
		birthday: '1990-01-01',
		hiringDate: '2020-01-01',
		location: 'San Francisco, CA',
	},
	{
		name: 'Jim Doe',
		role: 'Engineering Manager',
		birthday: '1990-01-01',
		hiringDate: '2020-01-01',
		location: 'Los Angeles, CA',
	},
];

export const seedDatabase = async () => {
	try {
		console.log('Seeding database with initial users...');
		
		for (const userData of initialUsers) {
			await userService.createUser(userData);
			console.log(`Created user: ${userData.name}`);
		}
		
		console.log('Database seeding completed successfully!');
	} catch (error) {
		console.error('Error seeding database:', error);
		throw error;
	}
}; 