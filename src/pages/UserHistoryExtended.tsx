import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import pdfIcon from "../assets/icons/fileIcons/file-pdf-duotone-solid.svg";
import zipIcon from "../assets/icons/fileIcons/file-zipper-duotone-solid.svg";
import fileIcon from "../assets/icons/fileIcons/file-duotone-solid.svg";
import imgIcon from "../assets/icons/fileIcons/file-image-duotone-solid.svg";
import "/src/cssFiles/textOverflow.css";
import "/src/cssFiles/customColors.css";
import "/src/cssFiles/servicePage.css";
import { FaCaretLeft } from "react-icons/fa";
import FormRenderFilled from "../components/ForRenderFilled";
import { useLanguage } from "../components/LanguageContext";

interface Service {
	name: string;
	id: string;
	purchaseDate: string;
	finalPurchaseAmount: string;
	purchaseId: string;
	status: string;
	files?: { fileName: string; fileType: string; fileUrl: string }[]; // Added files property
	userInput: string;
}

const icons = {
	pdf: pdfIcon,
	zip: zipIcon,
	rar: zipIcon,
	jpg: imgIcon,
	jpeg: imgIcon,
	png: imgIcon,
	// Add other icons as needed
	default: fileIcon,
};

const getIconForFileType = (fileName: string) => {
	const extension = fileName
		.split(".")
		.pop()
		?.toLowerCase() as keyof typeof icons;
	return icons[extension] || icons["default"];
};

function UserHistoryExtended() {
	const { purchaseId } = useParams<{ purchaseId: string }>();

	const [service, setService] = useState<Service | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		// Define a function to fetch the specific service by purchaseId
		const fetchService = async () => {
			try {
				// Fetch the entire list of services
				const response = await fetch("/db.json");
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();

				// Find the specific service using the purchaseId
				const selectedService = data.userPurchasedServices.find(
					(s: { purchaseId: any }) => `${s.purchaseId}` === purchaseId
				);

				// Set the service state if found, otherwise set error state
				if (selectedService) {
					setService(selectedService);
				} else {
					setError("Service not found");
				}
				setLoading(false);
			} catch (err) {
				setError("Failed to fetch service details");
				setLoading(false);
			}
		};

		fetchService();
	}, [purchaseId]);

	// Loading, Error and Service UI
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

	const handleBackClick = () => {
		navigate("/UserHistory");
	};

	return (
		<div className="custom-bg-4 min-vh-100">
			<div className="container py-5">
				<div className="d-flex flex-column bg-white border border-2 shadow text-end rounded-5 p-0 pt-2 px-md-2 mx-3 mx-md-4 mx-lg-5 mb-4">
					<div className="text-start m-2">
						<FaCaretLeft
							type="button"
							onClick={handleBackClick}
							className="custom-back-btn"
							color="black"
						/>
					</div>

					<div
						className="row row-cols-2 mx-2 mx-md-auto"
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "نام سرویس" : "Service Name"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{service.name}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "شماره سریال محصول" : "Service ID"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{service.id}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "تاریخ خریداری" : "Purchase Date"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{service.purchaseDate}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa"
									? `مبلغ نهایی خرید`
									: `Final Purchase Amount`}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{service.finalPurchaseAmount}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "شماره سریال تراکنش" : "Purchase ID"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{service.purchaseId}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "وضعیت پیگیری" : "Status"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{service.status}
							</div>
						</div>
					</div>
				</div>

				{/* Sent Files Section */}
				<div
					className={`bg-white border border-2 shadow text-${
						language === "fa" ? "end" : "start"
					} rounded-5 py-4 px-0 px-md-2 mx-3 mx-md-4 mx-lg-5 mb-4`}
				>
					<h5 className="px-4 mx-1">
						{language === "fa" ? "فایل های ارسال شده" : "Sent Files"}
					</h5>
					{service.files && service.files.length > 0 ? (
						<div className="d-flex flex-wrap justify-content-start align-items-center border border-1 border-primary shadow-sm rounded-4 px-2 mx-4 py-2">
							{service.files.map((file, index) => (
								<div
									key={index}
									className="d-flex flex-column file-item p-1 mx-1"
								>
									<a
										href={file.fileUrl}
										download
										className="d-flex flex-column justify-content-center align-items-center d-block "
									>
										<img
											src={getIconForFileType(file.fileType)}
											alt={`${file.fileName} Icon`}
											className="custom-file-icon"
										/>
										<span className={`scrollable-text text-center mt-1`}>
											{file.fileName}
										</span>
									</a>
								</div>
							))}
						</div>
					) : (
						<div className="d-flex flex-wrap justify-content-center align-items-center border border-1 border-primary shadow-sm rounded-4 px-2 mx-4 py-2">
							<p className="px-3 mx-4 py-2">
								{language === "fa" ? "هیچ فایلی یافت نشد" : "No files found"}
							</p>
						</div>
					)}
				</div>

				{/* Form Render Filled Section */}
				<div
					className={`bg-white border border-2 shadow text-${
						language === "fa" ? "end" : "start"
					} rounded-5 py-4 px-0 px-md-1 mx-3 mx-md-4 mx-lg-5 mb-4`}
				>
					<h5 className="px-4 mx-1">
						{language === "fa" ? "فرم تکمیل شده" : "Completed Form"}
					</h5>
					<div className="border border-1 border-primary shadow-sm rounded-4 px-3 mx-4 py-2">
						{true ? (
							<FormRenderFilled />
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
					} rounded-5 py-4 px-0 px-md-1 mx-3 mx-md-4 mx-lg-5 mb-4`}
				>
					<h5 className="px-4 mx-1">
						{language === "fa" ? "شرح حال کاربر" : "User's Input"}
					</h5>
					<div className="border border-1 border-primary shadow-sm rounded-4 px-3 mx-4 py-2">
						{service.userInput ? (
							<p>{service.userInput}</p>
						) : (
							<div className="text-center px-3 mx-4 py-2">
								<p>
									{language === "fa" ? "ورودی داده نشد" : "No input was given"}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserHistoryExtended;
