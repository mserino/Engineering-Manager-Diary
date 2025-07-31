import { useState, useEffect } from 'react';
import type { OneOnOneNote } from '../types/OneOnOneNote';
import { MOODS, MOOD_LABELS, type MoodType } from '../types/Mood';

interface OneOnOneNoteFormProps {
	userId: string;
	onSubmit: (noteData: Omit<OneOnOneNote, 'id' | 'createdAt'>) => Promise<void>;
	onCancel: () => void;
	note?: OneOnOneNote;
}

const MOOD_OPTIONS = Object.entries(MOOD_LABELS).map(([value, { label, ariaLabel }]) => ({
	value: value as MoodType,
	label,
	ariaLabel,
}));

export const OneOnOneNoteForm = ({ userId, onSubmit, onCancel, note }: OneOnOneNoteFormProps) => {
	const today = new Date().toISOString().split('T')[0] || new Date().toISOString().slice(0, 10);
	
	const [formData, setFormData] = useState<{
		date: string;
		talkingPoints: string;
		mood: MoodType;
		flag: boolean;
		flagDescription?: string;
	}>({
		date: note?.date || today,
		talkingPoints: note?.talkingPoints || '',
		mood: note?.mood || MOODS.HAPPY,
		flag: note?.flag || false,
		flagDescription: note?.flagDescription || '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Update form data when note prop changes
	useEffect(() => {
		if (note) {
			setFormData({
				date: note.date,
				talkingPoints: note.talkingPoints,
				mood: note.mood,
				flag: note.flag,
				flagDescription: note.flagDescription || '',
			});
		}
	}, [note]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value, type } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
		}));
	};

	const handleMoodChange = (mood: MoodType) => {
		setFormData(prev => ({
			...prev,
			mood,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await onSubmit({
				userId,
				date: formData.date,
				talkingPoints: formData.talkingPoints,
				mood: formData.mood,
				flag: formData.flag,
				flagDescription: formData.flagDescription,
			});
			onCancel();
		} catch {
			setError('Failed to save note. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<div className="mb-6">
				<p className="text-gray-600">
					{note ? 'Update the conversation details below.' : 'Record today\'s conversation and observations.'}
				</p>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<p className="text-red-600">{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
						Date
					</label>
					<input
						type="date"
						id="date"
						name="date"
						value={formData.date}
						onChange={handleChange}
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div>
					<label htmlFor="talkingPoints" className="block text-sm font-medium text-gray-700 mb-2">
						Talking Points <span className="text-red-500">*</span>
					</label>
					<textarea
						id="talkingPoints"
						name="talkingPoints"
						value={formData.talkingPoints}
						onChange={handleChange}
						required
						rows={6}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
						placeholder="What did you discuss? Any action items? How did the conversation go?"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-3">
						Mood
					</label>
					<div className="flex gap-4">
						{MOOD_OPTIONS.map((option) => (
							<label key={option.value} className="flex items-center space-x-2 cursor-pointer">
								<input
									type="radio"
									name="mood"
									value={option.value}
									checked={formData.mood === option.value}
									onChange={() => handleMoodChange(option.value)}
									className="sr-only"
								/>
								<div 
									className={`text-2xl p-2 rounded-lg border-2 transition-colors ${
										formData.mood === option.value
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-200 hover:border-gray-300'
									}`}
									aria-label={option.ariaLabel}
								>
									{option.value}
								</div>
								<span className="text-sm text-gray-600">{option.label}</span>
							</label>
						))}
					</div>
				</div>

				<div>
					<label className="flex items-center space-x-3 cursor-pointer">
						<input
							type="checkbox"
							name="flag"
							checked={formData.flag}
							onChange={handleChange}
							className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						/>
						<span className="text-sm font-medium text-gray-700">
							Flag for follow-up
						</span>
					</label>

					{formData.flag && (
						<>
							<label htmlFor="flagDescription" className="block text-sm font-medium text-gray-700 mb-2 mt-2">
								Flag Description <span className="text-red-500">*</span>
							</label>
							<textarea
								id="flagDescription"
								name="flagDescription"
								value={formData.flagDescription}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
							/>
						</>
					)}
				</div>

				<div className="flex gap-4 pt-4">
					<button
						type="submit"
						disabled={loading}
						className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						{loading ? 'Saving...' : (note ? 'Update Note' : 'Save Note')}
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}; 