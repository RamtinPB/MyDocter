import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaCaretLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "/src/cssFiles/login.css"; // Assuming you have a separate CSS file for additional styles
import { useLanguage } from "../components/LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Toast from "../components/Toast";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

const getValidationSchema = (language: string) => {
	return Yup.object().shape({
		emailAddress: Yup.string()
			.matches(
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				language === "fa"
					? "فرمت آدرس ایمیل اشتباه است"
					: "Invalid email format, must include a full domain"
			)
			.required(
				language === "fa"
					? " آدرس ایمیل الزامی است"
					: "Email Address is required"
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
				language === "fa"
					? "رمز عبور الزامی است"
					: "Password is required"
			),
	});
};

function Login() {
	const { language } = useLanguage(); // Get language and toggle function from context
	const { setAuthData } = useAuth();

	const [captchaImage, setCaptchaImage] = useState<string | null>(null);
	const [loadingCaptcha, setLoadingCaptcha] = useState(false);

	const [showPassword, setShowPassword] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [showToast, setShowToast] = useState(false);
	const [countdown, setCountdown] = useState(2); // Countdown for navigation
	const [isSuccess, setIsSuccess] = useState(false); // Track successful signup

	const navigate = useNavigate();

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

	useEffect(() => {
		// Countdown logic for 5 seconds
		// if (showToast && isSuccess && countdown > 0) {
		// 	const timer = setTimeout(() => {
		// 		setCountdown(countdown - 1);
		// 	}, 500);
		// 	return () => clearTimeout(timer);
		// } else if (isSuccess && countdown === 0) {
		// 	navigate("/UserInformation"); // Navigate after countdown ends
		// }
		if (isSuccess) {
			alert(
				language === "fa"
					? "فرآیند ورود با موفقیت انجام شد"
					: "The Login Process was successful"
			);
			alert(
				language === "fa"
					? "لطفا فرم اطلاعات کاربر را تکمیل کنید"
					: "Please fill the User Information Form"
			);
			navigate("/UserInformation"); // Navigate after countdown ends
		}
	}, [showToast, isSuccess, countdown, navigate]);

	const handleFormSubmit = async (
		values: {
			captcha: any;
			emailAddress: any;
			password: any;
		},
		{ setSubmitting }: any
	) => {
		try {
			const response = await axiosInstance.post(
				"/api/User/SignIn",
				{
					emailAddress: values.emailAddress,
					password: values.password,
					captcha: values.captcha,
				},
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				const { jwToken, isAdministrator } = response.data;

				// Store token and admin status in local storage
				localStorage.setItem("jwToken", jwToken);
				localStorage.setItem(
					"isAdministrator",
					JSON.stringify(isAdministrator)
				);

				// Update Auth context
				setAuthData(jwToken, isAdministrator);

				setToastMessage(
					language === "fa"
						? "عملیات با موفقیت انجام شد"
						: "Login was successful"
				);
				setShowToast(true); // Show toast
				setCountdown(5); // Reset countdown to 5 seconds
				setIsSuccess(true); // Mark success
			}
		} catch (error) {
			let errorMessage = "";

			if (axios.isAxiosError(error)) {
				// Check for error response and errorCode
				const errorCode = error.response?.data?.errorCode;
				const apiErrorMessage = error.response?.data?.message;

				if (error.response?.status === 400 && errorCode) {
					// Handle specific error codes
					switch (errorCode) {
						case 1029:
							errorMessage =
								language === "fa"
									? "کد امنیتی اشتباه است."
									: "Wrong CAPTCHA code.";

							break;
						case 1031:
							errorMessage =
								language === "fa"
									? "فرمت آدرس ایمیل اشتباه است."
									: "Incorrect email address format.";
							break;
						case 1007:
							errorMessage =
								language === "fa"
									? apiErrorMessage
									: "This User was not found.";
							break;
						default:
							errorMessage =
								language === "fa"
									? "خطای ناشناخته‌ای رخ داده است"
									: "Unknown Error.";
					}
				} else {
					errorMessage =
						language === "fa"
							? "خطای ناشناخته‌ای رخ داده است"
							: "Unknown Error.";
				}
			}
			setToastMessage(errorMessage);
			setShowToast(true);
			setIsSuccess(false);
		} finally {
			setSubmitting(false);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handleBackClick = () => navigate("/");

	return (
		<div className="d-flex justify-content-center align-items-center vh-100 login-container">
			<div className="container">
				<div className="d-flex justify-content-center justify-content-xl-end">
					<div className="col-12 col-xl-4 col-lg-6 col-md-7 ">
						<div
							className="card p-3 p-md-4 shadow rounded-4"
							style={{
								backgroundColor: "rgba(255, 255, 255, 0.9)",
							}}
						>
							<div
								className={`row text-${
									language === "fa" ? "end" : "center"
								}  mb-4 pb-1`}
							>
								<FaCaretLeft
									className="col-2 custom-back-btn"
									type="button"
									color="black"
									onClick={handleBackClick}
								/>
								<h3
									className={`col-${language === "fa" ? "10" : "8"} mb-0`}
								>
									{language === "fa"
										? "ورود به پزشک من"
										: "Log into My Docter"}
								</h3>
							</div>
							<Formik
								initialValues={{
									emailAddress: "",
									password: "",
									captcha: "",
								}}
								validationSchema={getValidationSchema(language)}
								onSubmit={handleFormSubmit}
							>
								{({ isSubmitting }) => (
									<Form
										style={{
											direction:
												language === "fa"
													? "rtl"
													: "ltr",
										}}
									>
										<div className="d-flex justify-content-between mb-2 p-1">
											<div className="">
												<label
													htmlFor="emailAddress"
													className="form-label"
												>
													{language === "fa"
														? "ثبت نام نکرده اید؟"
														: "Not Registered?"}
												</label>
											</div>
											<div className="">
												<a href="/SignUp">
													{language === "fa"
														? "ثبت نام رایگان"
														: "Free Sign Up"}
												</a>
											</div>
										</div>

										<div className="mb-3 p-1">
											<label
												id="emailAddress"
												className="form-label"
											>
												{language === "fa"
													? "آدرس ایمیل"
													: "Email Address"}
											</label>
											<Field
												type="text"
												name="emailAddress"
												className="form-control"
												placeholder="example@gmail.com"
											/>
											<ErrorMessage
												name="emailAddress"
												component="div"
												className="text-danger"
											/>
										</div>

										<div className="mb-3 p-1 ">
											<div className="d-flex justify-content-between">
												<div className="">
													<label
														htmlFor="password"
														className="form-label"
													>
														{language === "fa"
															? "رمز عبور"
															: "Password"}
													</label>
												</div>
												<div className="">
													<a href="/PasswordRecovery">
														{language === "fa"
															? "رمز عبور را فراموش کرده اید؟"
															: "Forgot your password?"}
													</a>
												</div>
											</div>
											<div
												className="input-group "
												style={{ direction: "ltr" }}
											>
												<span
													onClick={
														togglePasswordVisibility
													}
													className="input-group-text eye-icon"
													style={{
														cursor: "pointer",
													}}
												>
													{showPassword ? (
														<FaEyeSlash />
													) : (
														<FaEye />
													)}
												</span>
												<Field
													type={
														showPassword
															? "text"
															: "password"
													}
													name="password"
													className={`form-control text-${
														language === "fa"
															? "end"
															: "start"
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

										<div className="mb-3 p-1">
											<div
												className="d-flex flex-column align-items-center justify-content-evenly mb-3"
												style={{
													direction:
														language === "fa"
															? "rtl"
															: "ltr",
												}}
											>
												{captchaImage ? (
													<img
														src={captchaImage}
														alt="CAPTCHA"
														className="rounded-3"
													/>
												) : (
													<p>
														{language === "fa"
															? "در حال بارگذاری..."
															: "Loading..."}
													</p>
												)}
												<button
													type="button"
													onClick={fetchCaptcha}
													className="btn btn-secondary rounded-pill mt-2"
													disabled={loadingCaptcha}
												>
													{language === "fa"
														? "کد امنیتی جدید"
														: "Request New CAPTCHA"}
												</button>
											</div>

											<Field
												type="text"
												name="captcha"
												className="form-control"
												placeholder={
													language === "fa"
														? "کد امنیتی را وارد کنید"
														: "Enter CAPTCHA"
												}
											/>
											<ErrorMessage
												name="captcha"
												component="div"
												className="text-danger"
											/>
										</div>

										<div
											className={`form-check d-flex justify-content-start p-1 mb-3`}
											style={{
												direction:
													language === "fa"
														? "rtl"
														: "ltr",
											}}
										>
											<label
												className="form-check-label mx-1"
												id="rememberMe"
											>
												{language === "fa"
													? "مرا به خاطر بسپارید"
													: "Remember Me"}
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
												{language === "fa"
													? "ورود"
													: "Login"}
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

export default Login;
