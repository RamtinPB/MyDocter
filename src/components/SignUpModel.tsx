import { FaTimes } from "react-icons/fa";

interface SignUpModelProps {
	show: boolean;
	onClose: () => void;
	onConfirm: () => void;
	children: React.ReactNode;
}

function SignUpModel({ show, onClose, onConfirm, children }: SignUpModelProps) {
	return (
		<div
			className={`modal ${show ? "d-block" : "d-none"}`}
			tabIndex={-1}
			style={{ display: show ? "block" : "none" }}
		>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">کد تایید</h5>
						<button type="button" className="btn-close" onClick={onClose}>
							<FaTimes />
						</button>
					</div>
					<div className="modal-body">
						{children}
						<button
							type="button"
							className="btn btn-primary mt-3 w-100"
							onClick={onConfirm}
						>
							تایید
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SignUpModel;
