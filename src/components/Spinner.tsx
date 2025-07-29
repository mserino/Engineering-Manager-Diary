interface SpinnerProps {
	size?: 'sm' | 'md' | 'lg';
	className?: string;
	'aria-label'?: string;
}

export const Spinner = ({ size = 'md', className = '', 'aria-label': ariaLabel = 'Loading' }: SpinnerProps) => {
	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-6 h-6',
		lg: 'w-8 h-8',
	};

	return (
		<div 
			className={`flex justify-center items-center ${className}`}
			role="status"
			aria-label={ariaLabel}
		>
			<div
				className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-500`}
				aria-hidden="true"
			/>
		</div>
	);
}; 