import { describe, expect, test } from 'vitest';
import { render, screen } from '../test/test-utils';
import { Spinner } from './Spinner';

describe('Spinner', () => {
	test('renders with default size', () => {
		render(<Spinner />);
		
		const spinner = screen.getByRole('status');
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveAttribute('aria-label', 'Loading');
	});

	test('renders with small size', () => {
		render(<Spinner size="sm" />);
		
		const spinner = screen.getByRole('status');
		expect(spinner).toBeInTheDocument();
	});

	test('renders with large size', () => {
		render(<Spinner size="lg" />);
		
		const spinner = screen.getByRole('status');
		expect(spinner).toBeInTheDocument();
	});

	test('applies custom className', () => {
		render(<Spinner className="custom-class" />);
		
		const spinner = screen.getByRole('status');
		expect(spinner).toHaveClass('custom-class');
	});

	test('accepts custom aria-label', () => {
		render(<Spinner aria-label="Custom loading text" />);
		
		const spinner = screen.getByRole('status');
		expect(spinner).toHaveAttribute('aria-label', 'Custom loading text');
	});

	test('has proper accessibility attributes', () => {
		render(<Spinner />);
		
		const spinner = screen.getByRole('status');
		expect(spinner).toHaveAttribute('aria-label');
		
		const spinnerElement = spinner.firstChild as HTMLElement;
		expect(spinnerElement).toHaveAttribute('aria-hidden', 'true');
	});

	test('renders spinner element', () => {
		render(<Spinner />);
		
		const spinner = screen.getByRole('status');
		expect(spinner.firstChild).toBeInTheDocument();
	});
}); 