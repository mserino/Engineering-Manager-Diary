import { beforeEach, describe, expect, test } from 'vitest';
import App from './App';
import { render, screen } from './test/test-utils';

describe('App', () => {
	beforeEach(() => {
		render(<App />);
	});

	test('The title is visible and the app renders correctly', () => {
		expect(screen.getByText(/Engineering Manager Diary/i)).toBeInTheDocument();
	});
});
