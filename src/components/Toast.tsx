import { useLanguage } from "./LanguageContext";

interface ToastProps {
	message: string;
	show: boolean;
	onClose: () => void;
	isSuccess: boolean; // New prop to check success
	countdown: number; // New prop for countdown
}

function Toast({ message, show, onClose, isSuccess, countdown }: ToastProps) {
	const { language } = useLanguage();

	return (
		<div
			className={`toast-container position-fixed top-0 p-3 ${
				show ? "d-block" : "d-none"
			}`}
		>
			<div className="toast rounded-4 fade show">
				<div
					className="toast-body d-flex justify-content-between align-items-center "
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<p className=" px-2 mb-0">
						{message}
						{/* Conditionally show countdown only if it's a success */}
						{isSuccess &&
							countdown > 0 &&
							(language === "fa"
								? ` -  انتقال به صفحه اصلی در ${countdown} ثانیه`
								: ` - Redirecting in ${countdown}s`)}
					</p>
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

export default Toast;
