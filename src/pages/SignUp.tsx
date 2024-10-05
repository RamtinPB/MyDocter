import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaCaretLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "/src/cssFiles/login.css"; // Custom styles
import Toast from "../components/Toast.tsx";
import axiosInstance from "../myAPI/axiosInstance.ts";
import { useLanguage } from "../components/LanguageContext.tsx";

// Validation Schema
const getValidationSchema = (language: string) => {
	return Yup.object().shape({
		phoneNumber: Yup.string()
			.matches(
				/^(09\d{9}|\+989\d{9})$/,
				language === "fa"
					? "شماره وارد شده باید به شکل *********09 یا *********989+ باشد"
					: "The phone number must be in the format 09********* or +989*********"
			)
			.required(
				language === "fa" ? "شماره تماس الزامی است" : "Phone number is required"
			),
		password: Yup.string()
			.min(
				8,
				language === "fa"
					? "رمز عبور باید حداقل ۸ کاراکتر باشد"
					: "Password must be at least 8 characters long"
			)
			.max(
				16,
				language === "fa"
					? "رمز عبور نمی‌تواند بیشتر از ۱۶ کاراکتر باشد"
					: "Password cannot be longer than 16 characters"
			)
			.matches(
				/^(?=.*[0-9])(?=.*[a-zA-Z])/,
				language === "fa"
					? "رمز عبور باید شامل حداقل یک حرف انگلیسی و یک عدد باشد"
					: "Password must contain at least one letter and one number"
			)
			.matches(
				/^[a-zA-Z0-9!@#$%^&*()+=_\-{}\[\]:;"'?<>,.]+$/,
				language === "fa"
					? "تنها از کاراکترهای خاص ! @ # $ % ^ & * ( ) + = _ - { } [ ] : ; \" ' ? < > , می توان استفاده کند"
					: "Only special characters ! @ # $ % ^ & * ( ) + = _ - { } [ ] : ; \" ' ? < > , are allowed"
			)
			.required(
				language === "fa" ? "رمز عبور الزامی است" : "Password is required"
			),
	});
};

function SignUp() {
	const [showPassword, setShowPassword] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [showToast, setShowToast] = useState(false);
	const [countdown, setCountdown] = useState(5); // Countdown for navigation
	const [isSuccess, setIsSuccess] = useState(false); // Track successful signup

	const navigate = useNavigate();

	const togglePasswordVisibility = () => setShowPassword(!showPassword);

	const handleBackClick = () => navigate("/");

	const { language } = useLanguage();

	useEffect(() => {
		// Countdown logic for 5 seconds
		if (showToast && isSuccess && countdown > 0) {
			const timer = setTimeout(() => {
				setCountdown(countdown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else if (isSuccess && countdown === 0) {
			navigate("/"); // Navigate after countdown ends
		}
	}, [showToast, isSuccess, countdown, navigate]);

	const handleFormSubmit = async (
		values: { phoneNumber: any; password: any },
		{ setSubmitting }: any
	) => {
		try {
			const response = await axiosInstance.post("/api/User/SignUp", {
				phoneNumber: values.phoneNumber,
				password: values.password,
			});

			if (response.status === 200) {
				{
					language === "fa"
						? setToastMessage("ثبت نام با موفقیت انجام شد")
						: setToastMessage("Signup was successful");
				}
				setShowToast(true); // Show toast
				setCountdown(5); // Reset countdown to 5 seconds
				setIsSuccess(true); // Mark success
			}
		} catch (error) {
			let errorMessage = "خطای ناشناخته رخ داده است";

			if (axios.isAxiosError(error)) {
				// Check for error response and errorCode
				const errorCode = error.response?.data?.errorCode;
				const apiErrorMessage = error.response?.data?.message;

				if (error.response?.status === 400 && errorCode) {
					// Handle specific error codes
					switch (errorCode) {
						case 1001:
							{
								language === "fa"
									? (errorMessage = apiErrorMessage)
									: "The phone number must be in the format 09********* or +989*********";
							}
							break;
						case 1002:
							{
								language === "fa"
									? (errorMessage = apiErrorMessage)
									: `Entered password doesn't have the required properties. Password length must be between 8 and 16 characters and must contain at least one letter and one digit. Only the following special characters are supported: ! @ # $ % ^ & * ( ) + = _ - { } [ ] : ; " ' ? < > , . `;
							}
							break;
						case 1003:
							{
								language === "fa"
									? (errorMessage = apiErrorMessage)
									: "Entered phoneNumber is already used by another user.";
							}
							break;
						case 1004:
							{
								language === "fa"
									? (errorMessage = apiErrorMessage)
									: "Too many verification code requested for this phone number. Wait some time and try again.";
							}
							break;
						default:
							errorMessage = "خطای ناشناخته‌ای رخ داده است";
					}
				} else {
					errorMessage = "خطای ناشناخته‌ای رخ داده است";
				}
			}
			setToastMessage(errorMessage);
			setShowToast(true);
			setIsSuccess(false);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="d-flex justify-content-center align-items-center vh-100 login-container">
			<div className="container">
				<div className="d-flex justify-content-center justify-content-xl-end">
					<div className="col-12 col-xl-4 col-lg-6 col-md-7">
						<div
							className="card p-3 p-md-4 shadow rounded-4"
							style={{
								backgroundColor: "rgba(255, 255, 255, 0.9)",
							}}
						>
							<div
								className={`row text-${
									language === "fa" ? "end" : "center"
								} mb-4 pb-1`}
							>
								<FaCaretLeft
									className="col-2 custom-back-btn"
									type="button"
									color="black"
									onClick={handleBackClick}
								/>
								<h3 className={`col-${language === "fa" ? "10" : "8"} mb-0`}>
									{language === "fa"
										? "ثبت نام در پزشک من"
										: "Signup in My Docter"}
								</h3>
							</div>

							<Formik
								initialValues={{ phoneNumber: "", password: "" }}
								validationSchema={getValidationSchema(language)}
								onSubmit={handleFormSubmit}
							>
								{({ isSubmitting }) => (
									<Form
										style={{ direction: language === "fa" ? "rtl" : "ltr" }}
									>
										<div className="mb-3 p-1">
											<label htmlFor="phoneNumber" className="form-label">
												{language === "fa" ? "شماره تماس" : "Phone number"}
											</label>
											<Field
												type="text"
												name="phoneNumber"
												className="form-control"
												placeholder="09164524878"
											/>
											<ErrorMessage
												name="phoneNumber"
												component="div"
												className="text-danger"
											/>
										</div>

										<div className="mb-3 p-1">
											<label htmlFor="password" className="form-label">
												{language === "fa" ? "رمز عبور" : "Password"}
											</label>
											<div
												className="input-group "
												style={{ direction: "ltr" }}
											>
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
													className={`form-control text-${
														language === "fa" ? "end" : "start"
													}`}
													placeholder="********"
												/>
											</div>
											<ErrorMessage
												name="password"
												component="div"
												className="text-danger"
											/>
										</div>

										<div
											className={`form-check d-flex justify-content-start p-1 mb-3`}
											style={{ direction: language === "fa" ? "rtl" : "ltr" }}
										>
											<label
												className="form-check-label mx-1"
												htmlFor="rememberMe"
											>
												{language === "fa"
													? "مرا به خاطر بسپارید"
													: "Remmember Me"}
											</label>
											<Field
												type="checkbox"
												name="rememberMe"
												className="form-check-input mx-2"
											/>
										</div>

										<div className="p-1 text-center">
											<button
												type="submit"
												className="btn btn-primary rounded-pill"
												disabled={isSubmitting}
											>
												{language === "fa" ? "ثبت نام" : "Signup"}
											</button>
										</div>
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
				isSuccess={isSuccess} // Pass success state
				countdown={countdown} // Pass countdown state
			/>
		</div>
	);
}

export default SignUp;
