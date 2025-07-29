interface ConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	confirmButtonClassName?: string;
}

export const ConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	confirmButtonClassName = 'bg-red-500 hover:bg-red-600',
}: ConfirmationModalProps) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
				<div className="p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
					<p className="text-gray-600 mb-6">{message}</p>
					
					<div className="flex gap-3 justify-end">
						<button
							onClick={onClose}
							className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
						>
							{cancelText}
						</button>
						<button
							onClick={onConfirm}
							className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 cursor-pointer ${confirmButtonClassName}`}
						>
							{confirmText}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}; 