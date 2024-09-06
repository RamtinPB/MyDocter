import { useState } from "react";
import { FaCaretLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "/src/cssFiles/login.css"; // Assuming you have a separate CSS file for additional styles
import { useLanguage } from "../components/LanguageContext";

function PasswordRecovery() {
	const { language } = useLanguage(); // Get language and toggle function from context

	const [formData, setFormData] = useState({
		username: "",
		password: "",
		rememberMe: false,
	});
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

	const handleBackClick = () => {
		navigate("/");
	};

	return (
		<div className="d-flex justify-content-center align-items-center vh-100 login-container">
			<div className="container">
				<div className="d-flex justify-content-center justify-content-xl-end">
					<div className="col-12 col-xl-4 col-lg-5 col-md-6">
						<div
							className="card p-3 shadow rounded-4"
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
									{language === "fa" ? "بازیابی رمز عبور" : "Password Recovery"}
								</h3>
							</div>
							<form
								onSubmit={handleSubmit}
								style={{ direction: language === "fa" ? "rtl" : "ltr" }}
							>
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
								<div className="p-1 text-center">
									<button
										type="submit"
										className="btn btn-primary rounded-pill"
									>
										{language === "fa"
											? "بازیابی رمز عبور"
											: "Recover your Password"}
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

export default PasswordRecovery;
