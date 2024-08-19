import { useState } from "react";
import { FaEye, FaEyeSlash, FaCaretLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../cssFiles/login.css"; // Custom styles
import Toast from "../components/SignUpToast.tsx";
import Modal from "../components/SignUpModel.tsx";

// Validation Schema
const validationSchema = Yup.object().shape({
	phoneNumber: Yup.string()
		.matches(
			/^(09\d{9}|\+989\d{9})$/,
			"شماره وارد شده باید *********09 باشد یا *********989+ باشد"
		)
		.required("شماره تماس الزامی است"),
	password: Yup.string()
		.min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
		.max(16, "رمز عبور نمی‌تواند بیشتر از ۱۶ کاراکتر باشد")
		.matches(
			/^(?=.*[0-9])(?=.*[a-zA-Z])/,
			"رمز عبور باید شامل حداقل یک حرف انگلیسی و یک عدد باشد"
		)
		.matches(
			/^[a-zA-Z0-9!@#$%^&*()+=_\-{}\[\]:;"'?<>,.]+$/,
			"تنها از کاراکترهای خاص ! @ # $ % ^ & * ( ) + = _ - { } [ ] : ; \" ' ? < > , می توان استفاده کند"
		)
		.required("رمز عبور الزامی است"),
});

function SignUp() {
	const [showPassword, setShowPassword] = useState(false);
	const [verificationSent, setVerificationSent] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [verificationCode, setVerificationCode] = useState("");
	const [toastMessage, setToastMessage] = useState("");
	const [showToast, setShowToast] = useState(false);

	const navigate = useNavigate();

	const togglePasswordVisibility = () => setShowPassword(!showPassword);

	const handleBackClick = () => navigate("/");

	const handleFormSubmit = async (
		values: { phoneNumber: any; password: any },
		{ setSubmitting }: any
	) => {
		try {
			const response = await axios.post(
				"http://localhost:3001/api/User/SignUp",
				{
					phoneNumber: values.phoneNumber,
					password: values.password,
				}
			);

			if (response.status === 200) {
				setVerificationSent(true);
				setToastMessage("کد تایید به شماره تماس شما ارسال شد.");
				setShowToast(true);
			}
		} catch (error) {
			let errorMessage = "خطای ناشناخته رخ داده است.";

			if (axios.isAxiosError(error)) {
				// Handle known Axios error
				switch (error.response?.status) {
					case 400:
						errorMessage = "فرمت شماره تماس اشتباه است.";
						break;
					case 401:
						errorMessage =
							"رمز عبور باید شامل حروف و اعداد باشد و بین ۸ تا ۱۶ کاراکتر باشد.";
						break;
					case 409:
						errorMessage = "این شماره تماس قبلا ثبت شده است.";
						break;
					default:
						errorMessage = "خطای ناشناخته رخ داده است.";
				}
			}
			setToastMessage(errorMessage);
			setShowToast(true);
		} finally {
			setSubmitting(false);
		}
	};

	const handleVerificationSubmit = async () => {
		console.log("Verification code submitted:", verificationCode);
		navigate("/dashboard");
	};

	return (
		<div className="d-flex justify-content-center align-items-center vh-100 login-container">
			<div className="container">
				<div className="d-flex justify-content-center justify-content-xl-end">
					<div className="col-12 col-xl-4 col-lg-6 col-md-7">
						<div
							className="card p-4 shadow"
							style={{
								backgroundColor: "rgba(255, 255, 255, 0.9)",
								borderRadius: "15px",
							}}
						>
							<div className="d-flex justify-content-end justify-content-lg-between mb-3 pb-4">
								<button
									onClick={handleBackClick}
									className="btn btn-link p-0 m-0"
								>
									<FaCaretLeft size={27} color="black" />
								</button>
								<h3 className="mb-0">ثبت نام در پزشک من</h3>
							</div>

							<Formik
								initialValues={{ phoneNumber: "", password: "" }}
								validationSchema={validationSchema}
								onSubmit={handleFormSubmit}
							>
								{({ isSubmitting }) => (
									<Form>
										<div className="mb-4 p-1 text-end">
											<label htmlFor="phoneNumber" className="form-label">
												شماره تماس
											</label>
											<Field
												type="text"
												name="phoneNumber"
												className="form-control text-end"
												placeholder="09164524878"
											/>
											<ErrorMessage
												name="phoneNumber"
												component="div"
												className="text-danger text-end"
											/>
										</div>

										<div className="mb-4 p-1 text-end">
											<label htmlFor="password" className="form-label">
												رمز عبور
											</label>
											<div className="input-group">
												<span
													onClick={togglePasswordVisibility}
													className="input-group-text eye-icon"
													style={{ cursor: "pointer" }}
												>
													{showPassword ? <FaEyeSlash /> : <FaEye />}
												</span>
												<Field
													type={showPassword ? "text" : "password"}
													name="password"
													className="form-control text-end"
													placeholder="********"
												/>
											</div>
											<ErrorMessage
												name="password"
												component="div"
												className="text-danger text-end"
											/>
										</div>

										<div className="form-check mb-3 text-end d-flex justify-content-end">
											<Field
												type="checkbox"
												name="rememberMe"
												className="form-check-input me-2"
											/>
											<label
												className="form-check-label me-1"
												htmlFor="rememberMe"
											>
												مرا به خاطر بسپارید
											</label>
										</div>

										{verificationSent && (
											<div className="mb-4 p-1 text-end">
												<label
													htmlFor="verificationCode"
													className="form-label"
												>
													کد تایید
												</label>
												<input
													type="text"
													className="form-control text-end"
													placeholder="کد تایید"
													value={verificationCode}
													onChange={(e) => setVerificationCode(e.target.value)}
												/>
												<button
													type="button"
													className="btn btn-success rounded-pill mt-3"
													onClick={handleVerificationSubmit}
												>
													تایید کد
												</button>
											</div>
										)}

										{!verificationSent && (
											<div className="p-1 text-center">
												<button
													type="submit"
													className="btn btn-primary rounded-pill"
													disabled={isSubmitting}
												>
													ثبت نام
												</button>
											</div>
										)}
									</Form>
								)}
							</Formik>
						</div>
					</div>
				</div>
			</div>

			<Toast
				message={toastMessage}
				show={showToast}
				onClose={() => setShowToast(false)}
			/>
			<Modal
				show={showModal}
				onClose={() => setShowModal(false)}
				onConfirm={handleVerificationSubmit}
			>
				<p>کد تایید به شماره تماس شما ارسال شده است. لطفا آن را وارد کنید:</p>
				<input
					type="text"
					className="form-control text-end"
					placeholder="کد تایید"
					value={verificationCode}
					onChange={(e) => setVerificationCode(e.target.value)}
				/>
			</Modal>
		</div>
	);
}

export default SignUp;
