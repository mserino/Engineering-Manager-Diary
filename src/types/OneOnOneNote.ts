import type { MoodType } from './Mood';

export interface ActionItem {
	description: string;
	done: boolean;
}

export interface OneOnOneNote {
	id: string;
	userId: string;
	date: string;
	talkingPoints: string;
	mood: MoodType;
	flag: boolean;
	flagDescription?: string;
	createdAt: string;
	actionItems?: ActionItem[];
} 