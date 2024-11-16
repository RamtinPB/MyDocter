import { FaCaretLeft } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "/src/cssFiles/customColors.css";
import "/src/cssFiles/servicePage.css";
import FormBuilder from "./FormBuilder";
import axios from "axios";
import { useLanguage } from "./LanguageContext";

interface serviceProps {
	id: number;
	name: string;
	type: string;

	title: string;
	titleEN: string;

	description: string;
	descriptionEN: string;

	imageUrl: string;
	enabled: boolean;
}

function ServicePageEdit() {
	const { id } = useParams();

	const [service, setService] = useState<serviceProps | null>(null);
	const [servicePicture, setServicePicture] = useState<string | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { language } = useLanguage(); // Get language and toggle function from context

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const fetchService = async () => {
			try {
				const response = await fetch("/db.json"); // Adjust path if necessary
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();

				// Assuming services is an array available in the root of db.json
				const services = data.services;

				const selectedService = services.find(
					(s: { id: any }) => `${s.id}` === id
				);

				if (selectedService) {
					setService(selectedService);
					setServicePicture(selectedService.image);
				} else {
					setError("Service not found");
				}
				setLoading(false);
			} catch (err) {
				console.error("Error fetching service details:", err);
				setError("Failed to fetch service details");
				setLoading(false);
			}
		};

		fetchService();
	}, [id]);

	if (loading) {
		return <div className="text-center my-5">Loading...</div>;
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	if (!service) {
		return (
			<div className="text-center my-5 text-danger">Service not found</div>
		);
	}

	// Function to handle the back button
	const handleBackClick = () => {
		// Check the section passed in the location state
		const section = location.state?.section || "mainPage";
		navigate("/AdminDashboard", {
			state: { activeSection: section }, // Pass the section back to AdminDashboard
		});
	};

	const handleServicePictureChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files && e.target.files[0]) {
			setServicePicture(URL.createObjectURL(e.target.files[0]));

			const formData = new FormData();
			formData.append("servicePicture", e.target.files[0]);

			axios
				.post("/api/upload-service-picture", formData)
				.then((response) => {
					console.log("service picture uploaded successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error uploading service picture:", error);
				});
		}
	};

	// @ts-ignore
	const handleChange = () => {};

	// @ts-ignore
	const handleSubmit = () => {};

	// @ts-ignore
	const handleCancel = () => {};

	return (
		<div className="container">
			<div className="container custom-bg-4 shadow rounded-5 pb-3 mb-4">
				{/* Header Section with Back Button and Service Name */}
				<div className="row custom-bg-1 shadow rounded-5 mb-4 mt-4 mt-lg-5 p-2 p-md-3">
					<div className="col-2">
						<FaCaretLeft
							type="button"
							onClick={handleBackClick}
							className="custom-back-btn"
							color="white"
						/>
					</div>
					<div className="col-8 d-flex flex-column justify-content-center text-center text-white">
						<h4 className="mb-0">
							{language === "fa" ? service.title : service.titleEN}
						</h4>
					</div>
				</div>

				{/* Image and Description Section */}
				<div
					className="d-flex flex-row justify-content-between bg-white border border-2 shadow text-end rounded-5 p-3 p-md-4 mx-3 mx-md-4 mx-lg-5 mb-4 gap-3"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<div className="d-flex flex-column flex-grow-1 px-1 mx-1">
						<h6
							className={`text-${
								language === "fa" ? "end" : "start"
							} px-1 mx-1`}
						>
							{language === "fa"
								? "توضیحات کوتاه مربوط به سرویس"
								: "Short description of the service"}
						</h6>
						<textarea
							className={`form-control text-${
								language === "fa" ? "end" : "start"
							} h-100`}
							value={service.description}
							rows={3}
							placeholder={
								language === "fa" ? "متن خود را وارد کنید" : "Write your input"
							}
							style={{ resize: "none" }}
						></textarea>
					</div>

					<div className="d-flex flex-column justify-content-center align-items-center gap-3">
						{servicePicture ? (
							<img
								src={service.imageUrl}
								alt="service"
								className="custom-service-img shadow-sm rounded-5"
							/>
						) : (
							<input
								type="file"
								accept="image/*"
								className="custom-service-img text-center btn btn-light shadow rounded-pill"
								onChange={handleServicePictureChange}
							/>
						)}
						<button
							className="btn btn-sm btn-warning shadow-sm rounded-pill"
							onClick={() => setServicePicture(null)}
						>
							<span> {language === "fa" ? "حذف عکس" : "Delete Picture"}</span>
						</button>
					</div>
				</div>

				{/* Detailed Description Section */}
				<div className="bg-white border border-2 shadow text-end rounded-5 py-4 px-4 mx-3 mx-md-4 mx-lg-5 mb-4">
					<h6
						className={` text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa"
							? "توضیحات تکمیلی مربوط به سرویس"
							: "Detailed description of the service"}
					</h6>
					<textarea
						id="userInput"
						className={`form-control  text-${
							language === "fa" ? "end" : "start"
						}`}
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
					></textarea>
				</div>

				{/* Form Builder Section */}
				<div
					className={`bg-white border border-2 shadow text-${
						language === "fa" ? "end" : "start"
					} rounded-5 py-4 px-0 px-md-1 mx-3 mx-md-4 mx-lg-5 mb-4`}
				>
					<h6 className="px-4 mx-1">
						{language === "fa" ? "فرم سرویس" : "Service Form"}
					</h6>
					<div className="border border-1 shadow-sm rounded-4 px-3 mx-4 py-2">
						{true ? (
							<FormBuilder />
						) : (
							<div className="text-center py-3">
								<p>
									{language === "fa"
										? "اطلاعات فرم یافت نشد"
										: "Form Data Not Found"}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Pricing & Subsidy Section */}
				<div
					className="d-flex flex-column flex-lg-row justify-content-center bg-white border border-2 shadow text-end rounded-5 p-4 mx-3 mx-md-4 mx-lg-5 mb-4 gap-3"
					style={{ direction: "ltr" }}
				>
					<input
						type="text"
						className={`form-control  text-${
							language === "fa" ? "end" : "start"
						}`}
						placeholder={
							language === "fa" ? "نام سرویس" : "Service Name (Farsi)"
						}
					/>
					<input
						type="text"
						className={`form-control  text-${
							language === "fa" ? "end" : "start"
						}`}
						placeholder={
							language === "fa"
								? "نام سرویس (انگلیسی)"
								: "Service Name (English)"
						}
					/>
					<input
						type="text"
						className={`form-control  text-${
							language === "fa" ? "end" : "start"
						}`}
						placeholder={language === "fa" ? "قیمت سرویس" : "Service Cost"}
					/>
					<input
						type="text"
						className={`form-control  text-${
							language === "fa" ? "end" : "start"
						}`}
						placeholder={language === "fa" ? "یارانه" : "Subsidy"}
					/>
				</div>

				{/* Submit and Cancel buttons */}
				<div className="d-flex justify-content-evenly px-3 my-2 mx-4 py-2">
					<button
						className="btn btn-secondary rounded-pill px-3"
						onClick={handleCancel}
					>
						{language === "fa" ? "حذف تغییرات" : "Cancel Changes"}
					</button>
					<button
						className="btn btn-success rounded-pill px-3"
						onClick={handleSubmit}
					>
						{language === "fa" ? "ذخیره تغییرات" : "Save Changes"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default ServicePageEdit;
