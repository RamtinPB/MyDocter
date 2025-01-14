import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import pdfIcon from "../assets/icons/fileIcons/file-pdf-duotone-solid.svg";
// import zipIcon from "../assets/icons/fileIcons/file-zipper-duotone-solid.svg";
// import fileIcon from "../assets/icons/fileIcons/file-duotone-solid.svg";
// import imgIcon from "../assets/icons/fileIcons/file-image-duotone-solid.svg";
import "/src/cssFiles/textOverflow.css";
import "/src/cssFiles/customColors.css";
import "/src/cssFiles/servicePage.css";
import { FaCaretLeft } from "react-icons/fa";
import FormRenderFilled from "../components/FormRenderFilled";
import { useLanguage } from "../components/LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";

interface purchasedServiceProps {
	id: string;
	serviceId: string;
	serviceName: string;
	serviceTitle: string;
	serviceTitleEN: string;
	date: string;
	status: string;
	lastUpdateTime: string;
	finalPrice: string;
	result: string;
	approvedByDoctor: boolean;
	inputs?: {
		type: string;
		value: string;
		label: string;
		labelEN: string;
	}[];
}

function formatDate(input: string | undefined): string {
	if (!input) {
		return "Invalid Date"; // Return a default or error message if input is undefined
	}
	// Split the input string into date and time parts
	const [date, time] = input.split("T");

	// Replace the dashes in the date with slashes
	const formattedDate = date.replace(/-/g, "/");

	// Return the final formatted string
	return `${time} - ${formattedDate}`;
}

const getStatusString = (status: string, language: string) => {
	switch (status) {
		case "Initializing":
			return language === "fa" ? "مقداردهی" : "Initializing";
		case "Completed":
			return language === "fa" ? "تکمیل شده" : "Completed";
		case "Failed":
			return language === "fa" ? "ناموفق" : "Failed";
		case "Waiting":
			return language === "fa" ? "در انتظار" : "Waiting";
		case "Processing":
			return language === "fa" ? "پردازش" : "Processing";
		case "Cancelled":
			return language === "fa" ? "لغو شد" : "Cancelled";
	}
};

// const icons = {
// 	pdf: pdfIcon,
// 	zip: zipIcon,
// 	rar: zipIcon,
// 	jpg: imgIcon,
// 	jpeg: imgIcon,
// 	png: imgIcon,
// 	default: fileIcon,
// };

// const getIconForFileType = (fileName: string) => {
// 	const extension = fileName
// 		.split(".")
// 		.pop()
// 		?.toLowerCase() as keyof typeof icons;
// 	return icons[extension] || icons["default"];
// };

function UserHistoryExtended() {
	const { purchaseId } = useParams<{ purchaseId: string }>();

	const [purchasedServiceData, setPurchasedServiceData] =
		useState<purchasedServiceProps | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const { language } = useLanguage(); // Get language and toggle function from context

	// Fetch specific purchased service
	useEffect(() => {
		axiosInstance
			.post("/api/Service/GetPurchasedService", {
				purchasedServiceId: purchaseId,
			})
			.then((response) => {
				const data = response.data;
				const formattedService = {
					...data,
					date: formatDate(data.date),
					status: getStatusString(data.status, language),
					lastUpdateTime: formatDate(data.lastUpdateTime),
				};
				setPurchasedServiceData(formattedService);
				setError(null); // Clear any previous errors on success
			})
			.catch((apiError) => {
				console.error(
					"API request for purchased services failed. Trying local db.json",
					apiError
				);
				setError(
					"Failed to fetch purchased services from API. Trying local data."
				);

				// Fetch from local db.json if API fails
				fetch("/PurchasedService.json")
					.then((response) => {
						if (!response.ok) {
							throw new Error(
								"Failed to fetch purchased services from db.json"
							);
						}
						return response.json();
					})
					.then((data) => {
						// Find the specific service using the purchaseId
						const selectedService = data.find(
							(s: { purchaseId: any }) =>
								`${s.purchaseId}` === purchaseId
						);

						// Set the service state if found, otherwise set error state
						if (selectedService) {
							const formattedService = {
								...selectedService,
								purchaseDate: formatDate(
									selectedService.purchaseDate
								), // Example for a `purchaseDate` field
								serviceDate: formatDate(
									selectedService.serviceDate
								), // Example for a `serviceDate` field
							};
							setPurchasedServiceData(formattedService);
						} else {
							setError("Service not found");
						}
						setError(null); // Clear any previous errors on success
					})
					.catch((jsonError) => {
						console.error(
							"Failed to fetch purchased services from both API and db.json",
							jsonError
						);
						setError(
							"Failed to fetch purchased services from both API and local data."
						);
					})
					.finally(() => {
						setLoading(false); // Ensure loading is false after all attempts
					});
			})
			.finally(() => {
				setLoading(false); // Ensure loading is false if API request succeeds
			});
	}, []);

	// Loading, Error and Service UI
	if (loading) {
		return <div className="text-center my-5">Loading...</div>;
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	if (!purchasedServiceData) {
		return (
			<div className="text-center my-5 text-danger">
				Purchased Service not found
			</div>
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
								{language === "fa"
									? "نام سرویس"
									: "Service Name"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{language === "fa"
									? purchasedServiceData.serviceTitle
									: purchasedServiceData.serviceTitleEN}
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
								{purchasedServiceData.status}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa"
									? "شماره سریال محصول"
									: "Service ID"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{purchasedServiceData.serviceId}
							</div>
						</div>

						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa"
									? "شماره سریال تراکنش"
									: "Purchase ID"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{purchasedServiceData.id}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa"
									? "تاریخ خریداری"
									: "Purchase Date"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{purchasedServiceData.date}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa"
									? "تاریخ آخرین تغییر"
									: "Last Update Date"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{purchasedServiceData.lastUpdateTime}
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
								{purchasedServiceData.finalPrice}
							</div>
						</div>
					</div>
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
						<FormRenderFilled
							purchasedServiceData={purchasedServiceData}
						/>
					</div>
				</div>

				{/* Results Section */}
				<div
					className={`bg-white border border-2 shadow text-${
						language === "fa" ? "end" : "start"
					} rounded-5 py-4 px-0 px-md-1 mx-3 mx-md-4 mx-lg-5 mb-4`}
				>
					<h5 className="px-4 mx-1">
						{language === "fa" ? "نتایج" : "Results"}
					</h5>
					<div className="border border-1 border-primary shadow-sm rounded-4 px-3 mx-4 py-2">
						{purchasedServiceData.result ? (
							<p
								dangerouslySetInnerHTML={{
									__html: purchasedServiceData.result,
								}}
							/>
						) : (
							<div className="text-center px-3 mx-4 py-3">
								<p className="m-0">
									{language === "fa"
										? "نتایج آماده نشده است"
										: "Results are not ready yet"}
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
