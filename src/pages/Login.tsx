import { useState } from "react";
import { FaEye, FaEyeSlash, FaCaretLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../cssFiles/login.css"; // Assuming you have a separate CSS file for additional styles

function Login() {
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
				<div className="d-flex justify-content-end">
					<div className="col-lg-4 col-md-6 col-sm-8 col-10">
						<div
							className="card p-4 shadow"
							style={{
								backgroundColor: "rgba(255, 255, 255, 0.9)",
								borderRadius: "15px",
							}}
						>
							<div className="d-flex justify-content-between mb-3 pb-1">
								<button
									onClick={handleBackClick}
									className="btn btn-link p-0 m-0"
								>
									<FaCaretLeft size={27} color="black" />
								</button>
								<h2 className="mb-0">ورود به پزشک من</h2>
							</div>
							<form onSubmit={handleSubmit}>
								<div className="d-flex justify-content-between mb-3 p-1">
									<div className="">
										<a href="/SignIn">ثبت نام رایگان</a>
									</div>
									<div className="">
										<label htmlFor="username" className="form-label">
											ثبت نام نکرده اید؟
										</label>
									</div>
								</div>
								<div className="mb-3 p-1 text-end">
									<label htmlFor="username" className="form-label">
										شماره تماس یا ایمیل
									</label>
									<input
										type="text"
										className="form-control text-end"
										id="username"
										name="username"
										placeholder="09164524878 یا example@gmail.com"
										value={formData.username}
										onChange={handleInputChange}
									/>
								</div>
								<div className="mb-3 p-1 text-end">
									<div className="d-flex justify-content-between">
										<div className="text-start">
											<a href="#!">رمز عبور را فراموش کرده اید؟</a>
										</div>
										<div className="">
											<label htmlFor="password" className="form-label">
												رمز عبور
											</label>
										</div>
									</div>
									<div className="input-group">
										<span
											onClick={togglePasswordVisibility}
											className="input-group-text eye-icon"
											style={{ cursor: "pointer" }}
										>
											{showPassword ? <FaEyeSlash /> : <FaEye />}
										</span>
										<input
											type={showPassword ? "text" : "password"}
											className="form-control text-end"
											id="password"
											name="password"
											placeholder="********"
											value={formData.password}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div className="form-check mb-3 text-end d-flex justify-content-end align-items-center">
									<label className="form-check-label me-5" htmlFor="rememberMe">
										مرا به خاطر بسپارید
									</label>
									<input
										type="checkbox"
										className="form-check-input me-1"
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
										ورود
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
