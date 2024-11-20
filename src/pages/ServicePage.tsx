import { FaCaretLeft } from "react-icons/fa";
import FormRender from "../components/FormRender";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import "/src/cssFiles/customColors.css";
import "/src/cssFiles/servicePage.css";
import "/src/cssFiles/textOverflow.css";

import pdfIcon from "../assets/icons/fileIcons/file-pdf-duotone-solid.svg";
import zipIcon from "../assets/icons/fileIcons/file-zipper-duotone-solid.svg";
import fileIcon from "../assets/icons/fileIcons/file-duotone-solid.svg";
import imgIcon from "../assets/icons/fileIcons/file-image-duotone-solid.svg";
import { useLanguage } from "../components/LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";

interface FileData {
	fileName: string;
	fileType: string;
	fileUrl: string;
}

interface serviceProps {
	id: number;
	name: string;
	enabled: boolean;
	type: string;

	pageTitle: string;
	pageTitleEN: string;
	pageDescription: string;
	pageDescriptionEN: string;
	pageBannerUrl: string;

	reviewByDoctor: boolean;

	displayTitle: string;
	displayTitleEN: string;
	displayDescription: string;
	displayDescriptionEN: string;
	displayImageUrl: string;

	importantNotes: string;
	importantNotesEN: string;

	insurancePlanId: number;
	basePrice: number;
	subsidy: number;
}

interface UserInfo {
	insuranceId: number;
	supplementalInsuranceId: number;
}

interface insuranceDataProps {
	id: number;
	companyName: string;
	companyNameEN: string;
	type: number;
	discountPercentage: number;
}

const icons = {
	pdf: pdfIcon,
	zip: zipIcon,
	rar: zipIcon,
	jpg: imgIcon,
	jpeg: imgIcon,
	png: imgIcon,
	default: fileIcon,
};

// Function to get the appropriate icon based on file extension
const getIconForFileType = (fileName: string) => {
	const extension = fileName
		.split(".")
		.pop()
		?.toLowerCase() as keyof typeof icons;
	return icons[extension] || icons["default"];
};

function ServicePage() {
	const { id } = useParams<{ id: string }>();

	const [service, setService] = useState<serviceProps | null>(null);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	const [insurance, setInsurance] = useState<insuranceDataProps | null>(null);
	const [supplementaryInsurance, setSupplementaryInsurance] =
		useState<insuranceDataProps | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]); // State to store uploaded files
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { language } = useLanguage(); // Get language and toggle function from context

	const navigate = useNavigate();

	// fetch user data
	useEffect(() => {
		setLoading(true);

		axiosInstance
			.post("/api/User/GetUserData") // Call the API to get user data
			.then((response) => {
				const data = response.data;

				setUserInfo(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error(
					"API request for user data failed, trying local db.json",
					error
				);

				// Fetch from local db.json if API fails
				fetch("/db.json")
					.then((response) => {
						if (!response.ok) {
							throw new Error("Failed to fetch user data from db.json");
						}
						return response.json();
					})
					.then((data) => {
						const userInfo = data.userInfo;
						setUserInfo(userInfo);
						setLoading(false);
					})
					.catch((jsonError) => {
						console.error(
							"Failed to fetch user data from both API and db.json",
							jsonError
						);
						setLoading(false);
					});
			});
	}, [id]);

	// Fetch insurance & supplementary insurance data
	useEffect(() => {
		setLoading(true);

		// Only proceed if userInfo is defined
		if (!userInfo) return;

		axiosInstance
			.post("/api/Service/GetInsurances") // Call the API to get user data
			.then((response) => {
				const data = response.data;

				const matchedInsurance = data.find(
					(ins: { id: any }) => ins.id === userInfo.insuranceId
				);
				setInsurance(matchedInsurance || null);

				const matchedSupplementaryInsurance = data.find(
					(suppIns: { id: any }) =>
						suppIns.id === userInfo.supplementalInsuranceId
				);
				setSupplementaryInsurance(matchedSupplementaryInsurance || null);

				setLoading(false);
			})
			.catch((error) => {
				console.error(
					"API request for user data failed, trying local db.json",
					error
				);

				// Fetch from local db.json if API fails
				fetch("/db.json")
					.then((response) => {
						if (!response.ok) {
							throw new Error("Failed to fetch user data from db.json");
						}
						return response.json();
					})
					.then((data) => {
						const matchedInsurance = data.insurance.find(
							(ins: { insuranceType: any }) =>
								ins.insuranceType === userInfo.insuranceId
						);
						setInsurance(matchedInsurance || null);

						const matchedSupplementaryInsurance =
							data.supplementaryInsurance.find(
								(suppIns: { supplementaryInsuranceType: any }) =>
									suppIns.supplementaryInsuranceType ===
									userInfo.supplementalInsuranceId
							);
						setSupplementaryInsurance(matchedSupplementaryInsurance || null);

						setLoading(false);
					})
					.catch((jsonError) => {
						console.error(
							"Failed to fetch user data from both API and db.json",
							jsonError
						);
						setLoading(false);
					});
			});
	}, [userInfo, id]);

	// fetch service data
	useEffect(() => {
		setLoading(true);
		axiosInstance
			.post("/api/Service/GetServiceData", { serviceId: id }) // Call the API to get user data
			.then((response) => {
				const data = response.data.service;

				setService(data);
				console.log(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error(
					"API request for user data failed, trying local db.json",
					error
				);

				// Fetch from local db.json if API fails
				fetch("/db.json")
					.then((response) => {
						if (!response.ok) {
							throw new Error("Failed to fetch user data from db.json");
						}
						return response.json();
					})
					.then((data) => {
						const selectedService = data.services.find(
							(s: { id: any }) => `${s.id}` === id
						);
						if (selectedService) {
							setService(selectedService);
						} else {
							setError("Service not found");
						}
						setLoading(false);
					})
					.catch((jsonError) => {
						console.error(
							"Failed to fetch user data from both API and db.json",
							jsonError
						);
						setLoading(false);
					});
			});
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

	const handleFileUploadClick = () => {
		fileInputRef.current?.click(); // Trigger file input click
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []); // Get selected files
		const newFiles = files.map((file) => ({
			fileName: file.name,
			fileType: file.type,
			fileUrl: URL.createObjectURL(file),
		}));

		// Update the state with newly uploaded files
		setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
	};

	const handleFileDelete = (fileIndex: number) => {
		setUploadedFiles((prevFiles) =>
			prevFiles.filter((_, index) => index !== fileIndex)
		);
	};

	const handleBackClick = () => {
		if (service.type === "1") {
			navigate("/SpecialistDoctorPrescription"); // Replace with actual route
		} else if (service.type === "0") {
			navigate("/GeneralDoctorPrescription"); // Replace with actual route
		} else {
			console.log(service.type);
		}
	};

	const handleFinalPurchaseAmount = () => {
		if (!service || !insurance || !supplementaryInsurance) {
			return "N/A"; // Return a default value if any required data is missing
		}

		const servicePrice =
			parseFloat(service.basePrice as unknown as string) || 0;
		const insuranceContribution =
			parseFloat(insurance.discountPercentage as unknown as string) || 0;
		const supplementaryContribution =
			parseFloat(
				supplementaryInsurance.discountPercentage as unknown as string
			) || 0;
		const serviceSubsidy =
			parseFloat(service.subsidy as unknown as string) || 0;

		// Step 1: Calculate the price after insurance contribution
		let amountAfterInsurance =
			servicePrice - servicePrice * (insuranceContribution / 100);

		// Step 2: Apply supplementary insurance contribution
		let amountAfterSupplementary =
			amountAfterInsurance - servicePrice * (supplementaryContribution / 100);

		// Step 3: Subtract the service subsidy
		let finalAmount = amountAfterSupplementary - serviceSubsidy;

		// Ensure the final amount is not negative
		finalAmount = finalAmount < 0 ? 0 : finalAmount;

		// Return the final amount formatted as currency
		return finalAmount.toFixed(0); // This will round the result to two decimal places
	};

	function formatImportantNotes(text: string) {
		if (!text || typeof text !== "string") return text; // Ensure valid input
		return text.replace(/\. /g, ".\n");
	}

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
							{language === "fa" ? service.pageTitle : service.pageTitleEN}
						</h4>
					</div>
				</div>

				{/* Image and Description Section */}
				<div
					className={`d-flex justify-content-between bg-white border border-2 shadow text-${
						language === "fa" ? "end" : "start"
					} rounded-5 p-3 p-md-4 mx-3 mx-md-4 mx-lg-5 mb-4`}
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<p
						className={`text-justify ${
							language === "fa"
								? "ps-3 ps-md-4 pe-1 pt-1"
								: "pe-3 pe-md-4 ps-1 pt-1"
						} mx-1 `}
						dangerouslySetInnerHTML={{
							__html:
								language === "fa"
									? service.pageDescription?.replace(/\n/g, "<br>")
									: service.pageDescriptionEN?.replace(/\n/g, "<br>"),
						}}
						style={{
							direction: language === "fa" ? "rtl" : "ltr",
							textAlign: "justify",
						}}
					></p>
					<img
						src={service.pageBannerUrl}
						alt="Service"
						className="custom-service-img img-fluid shadow-sm rounded-5"
					/>
				</div>

				{/* File Upload Section */}
				<div
					className={`bg-white border border-2 shadow text-${
						language === "fa" ? "end" : "start"
					} rounded-5 py-4 px-0 px-md-2 mx-3 mx-md-4 mx-lg-5 mb-4`}
				>
					<h5 className="px-4 mx-1">
						{language === "fa" ? "ارسال فایل" : "Send Files"}
					</h5>
					<div
						className="d-flex justify-content-between border border-2 shadow-sm rounded-4 p-2 mx-4"
						style={{ direction: "ltr" }}
					>
						<div
							className={`d-flex flex-wrap justify-content-start align-items-center`}
						>
							{/* Display uploaded files with icons */}
							{uploadedFiles.map((file, index) => (
								<div className="d-flex flex-column p-1 mx-1">
									<a
										href={file.fileUrl}
										key={index}
										className="d-flex flex-column justify-content-center align-items-center d-block "
										download
									>
										<img
											src={getIconForFileType(file.fileName)}
											alt={`${file.fileName} Icon`}
											className="custom-file-icon"
										/>
										<span className={`scrollable-text text-center mt-1`}>
											{file.fileName}
										</span>
									</a>
									{/* Delete Button */}
									<button
										className="btn btn-sm btn-danger rounded-pill mt-1"
										onClick={() => handleFileDelete(index)}
									>
										{language === "fa" ? "حذف" : "Delete"}
									</button>
								</div>
							))}
						</div>
						<div className="d-flex flex-wrap justify-content-end align-items-center">
							{/* Upload button */}
							<button
								type="button"
								className="btn btn-outline-secondary ms-2"
								onClick={handleFileUploadClick}
							>
								<i className="fas fa-file-upload"></i>
								{language === "fa" ? "ارسال فایل" : "Upload"}
							</button>
							{/* Hidden file input */}
							<input
								type="file"
								ref={fileInputRef}
								style={{ display: "none" }}
								onChange={handleFileChange}
								multiple // Allow multiple file selection
							/>
						</div>
					</div>
				</div>

				{/* Form Render Section */}
				<div
					className={`bg-white border border-2 shadow text-${
						language === "fa" ? "end" : "start"
					} rounded-5 py-4 px-0 px-md-1 mx-3 mx-md-4 mx-lg-5 mb-4`}
				>
					<h5 className="px-4 mx-1">
						{language === "fa" ? "فرم سرویس" : "Service Form"}
					</h5>
					<div className="border border-1 shadow-sm rounded-4 px-3 mx-4 py-2">
						{true ? (
							<FormRender />
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

				{/* User Input Section */}
				<div
					className={`bg-white border border-2 shadow text-${
						language === "fa" ? "end" : "start"
					} rounded-5 py-4 px-4 mx-3 mx-md-4 mx-lg-5 mb-4`}
				>
					<h5 className="px-1 mx-1">
						{language === "fa" ? "شرح حال کاربر" : "User's Input"}
					</h5>
					<textarea
						id="userInput"
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						}`}
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
					></textarea>
				</div>

				{/* Important Notes Section */}
				<div
					className={`bg-white border border-2 shadow text-${
						language === "fa" ? "end" : "start"
					} rounded-5 py-4 px-4 mx-3 mx-md-4 mx-lg-5 mb-4`}
				>
					<h5 className="px-1 mx-1">
						{language === "fa" ? "نکات مهم سرویس" : "Service Important Notes"}
					</h5>
					<p
						className="px-3 mx-1"
						dangerouslySetInnerHTML={{
							__html:
								language === "fa"
									? service.importantNotes?.replace(/\n/g, "<br>")
									: service.importantNotesEN?.replace(/\n/g, "<br>"),
						}}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					></p>
				</div>

				{/* Pricing Table Section */}
				<div
					className={`bg-white border border-2 shadow text-${
						language === "fa" ? "end" : "start"
					} rounded-5 p-4 mx-3 mx-md-4 mx-lg-5 mb-4`}
				>
					<div
						className="table-responsive"
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					>
						<table className="table text-center">
							<thead>
								<tr>
									<th>{language === "fa" ? "نوع بیمه" : "Insurance Type"}</th>
									<th>
										{language === "fa" ? "سهم بیمه" : "Insurance Contribution"}
									</th>
									<th>
										{language === "fa"
											? "نوع بیمه تکمیلی"
											: "Supplementary Insurance Type"}
									</th>
									<th>
										{language === "fa"
											? "سهم بیمه تکمیلی"
											: "Supplementary Insurance Contribution"}
									</th>
									<th>{language === "fa" ? "قیمت سرویس" : "Service Cost"}</th>
									<th>
										{language === "fa" ? "مبالغ یارانه" : "Subsidy Amount"}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										{language === "fa"
											? insurance?.companyName
											: insurance?.companyNameEN}
									</td>
									<td>{insurance?.discountPercentage}</td>
									<td>
										{language === "fa"
											? supplementaryInsurance?.companyName
											: supplementaryInsurance?.companyNameEN}
									</td>
									<td>{supplementaryInsurance?.discountPercentage}</td>
									<td>{service.basePrice}</td>
									<td>{service.subsidy}</td>
								</tr>
								{/* Add more rows as needed */}
							</tbody>
						</table>
					</div>
				</div>

				{/* Purchase Button Section */}
				<div className="d-flex justify-content-center mb-4 mt-5">
					<div
						className={`bg-white border border-2 shadow text-${
							language === "fa" ? "end" : "start"
						} rounded-5 `}
					>
						<span className=" mx-3 ">
							{language === "fa"
								? `مبلغ نهایی خرید: ${handleFinalPurchaseAmount()} تومان`
								: `Final Purchase Amount ${handleFinalPurchaseAmount()} Toman(s)`}
						</span>
						<button className="btn btn-success rounded-pill px-4 py-2">
							{language === "fa" ? "خریداری سرویس" : "Purchase Service"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ServicePage;
