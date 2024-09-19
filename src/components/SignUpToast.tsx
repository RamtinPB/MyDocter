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
				<div
					className="toast-body d-flex justify-content-end align-items-center"
					style={{ direction: "ltr" }}
				>
					<p className=" px-2 mb-0">{message}</p>
					<button
						type="button"
						className="btn-close px-2"
						aria-label="Close"
						onClick={onClose}
					/>
				</div>
			</div>
		</div>
	);
}

export default SignUpToast;
