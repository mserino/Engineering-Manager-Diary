import type { MoodType } from './Mood';

export interface OneOnOneNote {
	id: string;
	userId: string;
	date: string;
	talkingPoints: string;
	mood: MoodType;
	flag: boolean;
	createdAt: string;
} 