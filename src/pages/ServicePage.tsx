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

interface FileData {
	fileName: string;
	fileType: string;
	fileUrl: string;
}

interface Service {
	name: string;
	description: string;
	detailedDescription: string;

	nameEN: string;
	descriptionEN: string;
	detailedDescriptionEN: string;

	price: string;
	subsidy: string;
	image: string;
	id: string;
	type: string;
	files?: FileData[]; // File data interface
}
interface UserInfo {
	insuranceType: string;
	supplementaryInsuranceType: string;

	insuranceTypeEN: string;
	supplementaryInsuranceTypeEN: string;
}

interface Insurance {
	insuranceType: string;
	insuranceTypeEN: string;
	insuranceContribution: string;
}

interface SupplementaryInsurance {
	supplementaryInsuranceType: string;
	supplementaryInsuranceTypeEN: string;
	supplementaryInsuranceContribution: string;
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

	const [service, setService] = useState<Service | null>(null);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	const [insurance, setInsurance] = useState<Insurance | null>(null);
	const [supplementaryInsurance, setSupplementaryInsurance] =
		useState<SupplementaryInsurance | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]); // State to store uploaded files
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { language } = useLanguage(); // Get language and toggle function from context

	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// Fetch user info
				const userInfoResponse = await fetch("/db.json");
				if (!userInfoResponse.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await userInfoResponse.json();
				const userInfo = data.userInfo;
				setUserInfo(userInfo);
				console.log(userInfo);

				// Fetch insurance data
				const insuranceResponse = await fetch("/db.json");
				if (!insuranceResponse.ok) {
					throw new Error("Network response was not ok");
				}
				const insuranceData = await insuranceResponse.json();
				const matchedInsurance = insuranceData.insurance.find(
					(ins: { insuranceType: any }) =>
						ins.insuranceType === userInfo.insuranceType
				);
				setInsurance(matchedInsurance || null);

				// Fetch supplementary insurance data
				const supplementaryInsuranceResponse = await fetch("/db.json");
				if (!supplementaryInsuranceResponse.ok) {
					throw new Error("Network response was not ok");
				}
				const supplementaryInsuranceData =
					await supplementaryInsuranceResponse.json();
				const matchedSupplementaryInsurance =
					supplementaryInsuranceData.supplementaryInsurance.find(
						(suppIns: { supplementaryInsuranceType: any }) =>
							suppIns.supplementaryInsuranceType ===
							userInfo.supplementaryInsuranceType
					);
				setSupplementaryInsurance(matchedSupplementaryInsurance || null);

				// Fetch service data
				const serviceResponse = await fetch("/db.json");
				if (!serviceResponse.ok) {
					throw new Error("Network response was not ok");
				}
				const serviceData = await serviceResponse.json();
				const selectedService = serviceData.services.find(
					(s: { id: any }) => `${s.id}` === id
				);
				if (selectedService) {
					setService(selectedService);
				} else {
					setError("Service not found");
				}

				setLoading(false);
			} catch (err) {
				console.error("Error fetching data:", err);
				setError("Failed to fetch data");
				setLoading(false);
			}
		};

		fetchData();
	}, [id]); // Only re-run if `id` changes

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
		if (service?.type.toLocaleLowerCase() === "specialist") {
			navigate("/SpecialistDoctorPrescription"); // Replace with actual route
		} else if (service?.type.toLocaleLowerCase() === "general") {
			navigate("/GeneralDoctorPrescription"); // Replace with actual route
		} else {
			navigate("/"); // Default fallback
		}
	};

	const handleFinalPurchaseAmount = () => {
		if (!service || !insurance || !supplementaryInsurance) {
			return "N/A"; // Return a default value if any required data is missing
		}

		const servicePrice = parseFloat(service.price) || 0;
		const insuranceContribution =
			parseFloat(insurance.insuranceContribution) || 0;
		const supplementaryContribution =
			parseFloat(supplementaryInsurance.supplementaryInsuranceContribution) ||
			0;
		const serviceSubsidy = parseFloat(service.subsidy) || 0;

		// Step 1: Calculate the price after insurance contribution
		let amountAfterInsurance =
			servicePrice - servicePrice * (insuranceContribution / 100);

		// Step 2: Apply supplementary insurance contribution
		let amountAfterSupplementary =
			amountAfterInsurance -
			amountAfterInsurance * (supplementaryContribution / 100);

		// Step 3: Subtract the service subsidy
		let finalAmount = amountAfterSupplementary - serviceSubsidy;

		// Ensure the final amount is not negative
		finalAmount = finalAmount < 0 ? 0 : finalAmount;

		// Return the final amount formatted as currency
		return finalAmount.toFixed(0); // This will round the result to two decimal places
	};

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
							{language === "fa" ? service.name : service.nameEN}
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
					<p className="px-3 mx-1">
						{language === "fa"
							? service.detailedDescription
							: service.detailedDescriptionEN}
					</p>
					<img
						src={service.image}
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
											? userInfo?.insuranceType
											: userInfo?.insuranceTypeEN}
									</td>
									<td>{insurance?.insuranceContribution}</td>
									<td>
										{language === "fa"
											? userInfo?.supplementaryInsuranceType
											: userInfo?.supplementaryInsuranceTypeEN}
									</td>
									<td>
										{supplementaryInsurance?.supplementaryInsuranceContribution}
									</td>
									<td>{service.price}</td>
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
