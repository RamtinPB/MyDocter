import { SetStateAction, useEffect, useState } from "react";
import axiosInstance from "../myAPI/axiosInstance";
import { useLanguage } from "./LanguageContext";

interface AdminDashboardManageUsersModalProps {
	onConfirm: (captchaValue: string) => void;
	show: boolean;
	onClose: () => void;
}

function AdminDashboardManageUsersModal({
	onConfirm,
}: AdminDashboardManageUsersModalProps) {
	const tabi = -1;
	const [captchaImage, setCaptchaImage] = useState<string | null>(null);
	const [loadingCaptcha, setLoadingCaptcha] = useState(false);
	const [captchaValue, setCaptchaValue] = useState("");

	const { language } = useLanguage(); // Get language and toggle function from context

	const fetchCaptcha = async () => {
		try {
			// Revoke the old object URL (if any) to free memory
			if (captchaImage) {
				URL.revokeObjectURL(captchaImage);
			}
			setLoadingCaptcha(true);

			const response = await axiosInstance.get(`/api/User/GetCaptcha`, {
				responseType: "blob",
				withCredentials: true,
			});

			// Convert the blob into an object URL
			const blob = new Blob([response.data], {
				type: response.headers["content-type"],
			});
			const objectURL = URL.createObjectURL(blob);

			setCaptchaImage(objectURL); // Set the object URL as the image source
		} catch (error) {
			console.error("Error fetching CAPTCHA:", error);
		} finally {
			setLoadingCaptcha(false);
		}
	};

	useEffect(() => {
		fetchCaptcha();
	}, []);

	return (
		<div
			className="modal"
			tabIndex={tabi}
			id="staticBackdrop"
			data-bs-backdrop="static"
			data-bs-keyboard="false"
			aria-labelledby="staticBackdropLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog">
				<div className="modal-content">
					<div
						className="modal-header d-flex justify-content-between align-items-center px-3 py-2"
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					>
						<h5 className="modal-title ">
							{language === "fa"
								? "نیاز به احراز هویت"
								: "Authorization Required"}
						</h5>
						<button
							type="button"
							className="btn-close m-2"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body">
						<div className="mb-4 p-1">
							<div
								className="d-flex flex-column align-items-center justify-content-evenly mb-3"
								style={{ direction: language === "fa" ? "rtl" : "ltr" }}
							>
								{captchaImage ? (
									<img src={captchaImage} alt="CAPTCHA" className="rounded-3" />
								) : (
									<p>
										{language === "fa" ? "در حال بارگذاری..." : "Loading..."}
									</p>
								)}
								<button
									type="button"
									onClick={fetchCaptcha}
									className="btn btn-secondary rounded-pill mt-2"
									disabled={loadingCaptcha}
								>
									{language === "fa" ? "کد امنیتی جدید" : "Request New CAPTCHA"}
								</button>
							</div>

							<input
								type="text"
								name="captcha"
								className="form-control text-center p-1"
								placeholder={
									language === "fa" ? "کد امنیتی را وارد کنید" : "Enter CAPTCHA"
								}
								onChange={(e: { target: { value: SetStateAction<string> } }) =>
									setCaptchaValue(e.target.value)
								}
							/>
						</div>
						<div className="modal-footer d-flex justify-content-evenly align-items-center p-0 pt-3 mb-2">
							<button
								type="button"
								className="btn btn-secondary rounded-pill"
								data-bs-dismiss="modal"
							>
								{language === "fa" ? "خروج" : "Close"}
							</button>
							<button
								type="button"
								onClick={() => onConfirm(captchaValue)}
								className="btn btn-primary rounded-pill"
								data-bs-toggle="modal"
							>
								{language === "fa" ? "تأیید" : "Confirm"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminDashboardManageUsersModal;
