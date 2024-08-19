interface SignUpToastProps {
	message: string;
	show: boolean;
	onClose: () => void;
}

function SignUpToast({ message, show, onClose }: SignUpToastProps) {
	return (
		<div
			className={`toast-container position-fixed top-0 end-0 p-3 ${
				show ? "d-block" : "d-none"
			}`}
		>
			<div className="toast fade show">
				<div className="toast-body">
					{message}
					<button
						type="button"
						className="btn-close"
						aria-label="Close"
						onClick={onClose}
					></button>
				</div>
			</div>
		</div>
	);
}

export default SignUpToast;
