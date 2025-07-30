export const MOODS = {
	HAPPY: '😊',
	NEUTRAL: '😐',
	SAD: '😔',
	FRUSTRATED: '😤',
	TIRED: '😴',
} as const;

export type MoodType = typeof MOODS[keyof typeof MOODS];

export const MOOD_LABELS = {
	[MOODS.HAPPY]: { label: 'Happy', ariaLabel: 'Happy mood' },
	[MOODS.NEUTRAL]: { label: 'Neutral', ariaLabel: 'Neutral mood' },
	[MOODS.SAD]: { label: 'Sad', ariaLabel: 'Sad mood' },
	[MOODS.FRUSTRATED]: { label: 'Frustrated', ariaLabel: 'Frustrated mood' },
	[MOODS.TIRED]: { label: 'Tired', ariaLabel: 'Tired mood' },
} as const; 