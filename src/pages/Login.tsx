import { useState } from "react";
import { FaEye, FaEyeSlash, FaCaretLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "/src/cssFiles/login.css"; // Assuming you have a separate CSS file for additional styles
import { useLanguage } from "../components/LanguageContext";

function Login() {
	const { language } = useLanguage(); // Get language and toggle function from context

	const [formData, setFormData] = useState({
		username: "",
		password: "",
		rememberMe: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Add your login logic here
		console.log("Submitted form:", formData);
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handleBackClick = () => {
		navigate("/");
	};

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
								<h3 className={`col-${language === "fa" ? "10" : "8"} mb-0`}>
									{language === "fa" ? "ورود به پزشک من" : "Log into My Docter"}
								</h3>
							</div>
							<form
								onSubmit={handleSubmit}
								style={{ direction: language === "fa" ? "rtl" : "ltr" }}
							>
								<div className="d-flex justify-content-between mb-3 p-1">
									<div className="">
										<label htmlFor="username" className="form-label">
											{language === "fa"
												? "ثبت نام نکرده اید؟"
												: "Not Registered?"}
										</label>
									</div>
									<div className="">
										<a href="/SignUp">
											{language === "fa" ? "ثبت نام رایگان" : "Free Sign Up"}
										</a>
									</div>
								</div>
								<div className="mb-3 p-1">
									<label htmlFor="username" className="form-label">
										{language === "fa" ? "شماره تماس" : "Phone number"}
									</label>
									<input
										type="text"
										className="form-control"
										id="username"
										name="username"
										placeholder="09164524878"
										value={formData.username}
										onChange={handleInputChange}
									/>
								</div>
								<div className="mb-3 p-1 ">
									<div className="d-flex justify-content-between">
										<div className="">
											<label htmlFor="password" className="form-label">
												{language === "fa" ? "رمز عبور" : "Password"}
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
									<div className="input-group" style={{ direction: "ltr" }}>
										<span
											onClick={togglePasswordVisibility}
											className="input-group-text eye-icon"
											style={{ cursor: "pointer" }}
										>
											{showPassword ? <FaEyeSlash /> : <FaEye />}
										</span>
										<input
											type={showPassword ? "text" : "password"}
											className={`form-control text-${
												language === "fa" ? "end" : "start"
											}`}
											id="password"
											name="password"
											placeholder="********"
											value={formData.password}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div
									className={`form-check  d-flex justify-content-start p-1 mb-3`}
									style={{ direction: language === "fa" ? "rtl" : "ltr" }}
								>
									<label className="form-check-label mx-1" htmlFor="rememberMe">
										{language === "fa" ? "مرا به خاطر بسپارید" : "Remmember Me"}
									</label>
									<input
										type="checkbox"
										className="form-check-input mx-1"
										id="rememberMe"
										name="rememberMe"
										checked={formData.rememberMe}
										onChange={handleInputChange}
									/>
								</div>
								<div className="p-1 text-center">
									<button
										type="submit"
										className="btn btn-primary rounded-pill"
									>
										{language === "fa" ? "ورود" : "Login"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
