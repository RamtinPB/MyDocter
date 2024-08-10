import { useState } from "react";
import { FaCaretLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../cssFiles/login.css"; // Assuming you have a separate CSS file for additional styles

function PasswordRecovery() {
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
				<div className="d-flex justify-content-end">
					<div className="col-lg-4 col-md-6 col-sm-8 col-10">
						<div
							className="card p-4 shadow"
							style={{
								backgroundColor: "rgba(255, 255, 255, 0.9)",
								borderRadius: "15px",
							}}
						>
							<div className="d-flex justify-content-between mb-3 pb-4">
								<button
									onClick={handleBackClick}
									className="btn btn-link p-0 m-0"
								>
									<FaCaretLeft size={27} color="black" />
								</button>
								<h2 className="mb-0">بازیابی رمز عبور</h2>
							</div>
							<form onSubmit={handleSubmit}>
								<div className="mb-4 p-1 text-end">
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
								<div className="p-1 text-center">
									<button
										type="submit"
										className="btn btn-primary rounded-pill"
									>
										بازیابی رمز عبور
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
