import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '../test/test-utils';
import { UserList } from './UserList';
import type { User } from '../types/User';
import { MOODS } from '../types/Mood';
import type { OneOnOneNote } from '../types/OneOnOneNote';

const mockUsers: User[] = [
	{
		id: "1",
		name: 'John Doe',
		role: 'Senior Frontend Engineer',
		birthday: '1990-01-01',
		hiringDate: '2020-01-01',
		location: 'New York, NY',
	},
	{
		id: "2",
		name: 'Alice Smith',
		role: 'Senior Backend Engineer',
		birthday: '1985-05-15',
		hiringDate: '2019-03-15',
		location: 'San Francisco, CA',
	},
];

const mockOneOnOneNotes: OneOnOneNote[] = [
	{
		id: '1',
		userId: '1',
		date: '2024-01-01',
		mood: MOODS.HAPPY,
		flag: false,
		talkingPoints: 'This is a note',
		createdAt: '2024-01-01',
	},
	{
		id: '2',
		userId: '1',
		date: '2024-01-01',
		mood: MOODS.SAD,
		flag: true,
		talkingPoints: 'This is a note',
		createdAt: '2024-01-01',
	},
];

describe('UserList', () => {
	test('renders all users', () => {
		render(<UserList users={mockUsers} />);
		
		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('Alice Smith')).toBeInTheDocument();
	});

	test('displays user roles', () => {
		render(<UserList users={mockUsers} />);
		
		expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
		expect(screen.getByText('Senior Backend Engineer')).toBeInTheDocument();
	});

	test('renders correct number of user cards', () => {
		render(<UserList users={mockUsers} />);
		
		const userCards = screen.getAllByRole('link');
		expect(userCards).toHaveLength(2);
	});

	test('handles empty users array', () => {
		render(<UserList users={[]} />);
		
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	test('has proper accessibility attributes', () => {
		render(<UserList users={mockUsers} />);
		
		const userCards = screen.getAllByRole('link');
		expect(userCards).toHaveLength(2);
	});

	test('user cards are clickable links', () => {
		render(<UserList users={mockUsers} />);
		
		const links = screen.getAllByRole('link');
		expect(links).toHaveLength(2);
		expect(links[0]).toHaveAttribute('href', '/user/1');
		expect(links[1]).toHaveAttribute('href', '/user/2');
	});

	test('shows user summary', () => {
		render(<UserList users={mockUsers} />);

		vi.mock('../hooks/useUserNotesSummary', () => ({
			useUserNotesSummary: () => ({
				'1': { totalNotes: 1, flaggedNotes: 1 },
				'2': { totalNotes: 0, flaggedNotes: 0 },
			}),
		}));
		
		expect(screen.getByText('1 notes')).toBeInTheDocument();
		expect(screen.getByText('1 flagged')).toBeInTheDocument();
	});

	test('shows last note emoji', () => {
		render(<UserList users={mockUsers} />);

		vi.mock('../hooks/useUserNotesSummary', () => ({
			useUserNotesSummary: () => ({
				'1': { totalNotes: 2, flaggedNotes: 1, lastNoteMood: mockOneOnOneNotes[0]?.mood },
				'2': { totalNotes: 1, flaggedNotes: 0, lastNoteMood: mockOneOnOneNotes[2]?.mood },
			}),
		}));

		expect(screen.getByText(MOODS.HAPPY)).toBeInTheDocument();
	});
}); 