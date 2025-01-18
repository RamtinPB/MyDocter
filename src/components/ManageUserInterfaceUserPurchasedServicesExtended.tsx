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
import ResultsSection from "../pages/ResultsSection";

interface purchasedServiceProps {
	purchasedService: {
		id: string;
		serviceId: string;
		userId: string;
		service: {
			basePrice: string;
			discount: string;
			pageTitle: string;
			pageTitleEN: string;
			reviewByDoctor: string;
			type: string;
		};
		user: {
			fixedPhoneNumber: string;
			emailAddress: string;
			insuranceId: string;
			supplementalInsuranceId: string;
			lastName: string;
			name: string;
			phoneNumber: string;
			residenceAddress: string;
			residenceCity: string;
			residencePostalCode: string;
			residenceProvince: string;
		};
		date: string;
		status: string;
		lastUpdateTime: string;
		finalPrice: string;
		result: string;
		approvedByDoctor: boolean;
	};
	inputs?: {
		type: string;
		value: string;
		label: string;
		labelEN: string;
	}[];
}

interface insuranceDataProps {
	id: number;
	companyName: string;
	companyNameEN: string;
	type: number;
	discountPercentage: number;
}

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
const getStatusString = (status: number, language: string) => {
	switch (status) {
		case 0:
			return language === "fa" ? "مقداردهی" : "Initializing";
		case 1:
			return language === "fa" ? "تکمیل شده" : "Completed";
		case 2:
			return language === "fa" ? "ناموفق" : "Failed";
		case 3:
			return language === "fa" ? "در انتظار" : "Waiting";
		case 4:
			return language === "fa" ? "پردازش" : "Processing";
		case 5:
			return language === "fa" ? "لغو شد" : "Cancelled";
	}
};

const getTypeString = (type: number, language: string) => {
	switch (type) {
		case 0:
			return language === "fa" ? "عمومی" : "General";
		case 1:
			return language === "fa" ? "تخصصی" : "Specialist";
	}
};

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

function ManageUserInterfaceUserPurchasedServicesExtended() {
	const { purchaseId } = useParams<{ purchaseId: string }>();

	const [purchasedServiceData, setPurchasedServiceData] =
		useState<purchasedServiceProps | null>(null);

	const [insurance, setInsurance] = useState<insuranceDataProps | null>(null);
	const [supplementaryInsurance, setSupplementaryInsurance] =
		useState<insuranceDataProps | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const { language } = useLanguage(); // Get language and toggle function from context

	// Fetch specific purchased service
	useEffect(() => {
		if (!language) {
			return;
		}
		axiosInstance
			.post("/api/Admin/GetPurchasedService", {
				purchasedServiceId: purchaseId,
			})
			.then((response) => {
				// Process the response to update the status field
				const data = response.data;
				const updatedData = {
					...data,
					purchasedService: {
						...data.purchasedService,
						status: getStatusString(
							data.purchasedService.status,
							language
						),
						date: formatDate(data.purchasedService.date),
						lastUpdateTime: formatDate(
							data.purchasedService.lastUpdateTime
						),
					},
				};
				console.log(updatedData);
				setPurchasedServiceData(updatedData);
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
				fetch("/db.json")
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
						const selectedService = data.userPurchasedServices.find(
							(s: { purchaseId: any }) =>
								`${s.purchaseId}` === purchaseId
						);

						// Set the service state if found, otherwise set error state
						if (selectedService) {
							setPurchasedServiceData(selectedService);
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
	}, [language]);

	// Fetch insurance & supplementary insurance data
	useEffect(() => {
		setLoading(true);

		// Only proceed if purchasedServiceData is defined
		if (!purchasedServiceData) return;

		axiosInstance
			.post("/api/Service/GetInsurances") // Call the API to get user data
			.then((response) => {
				const data = response.data;

				const matchedInsurance = data.find(
					(ins: { id: any }) =>
						ins.id ===
						purchasedServiceData.purchasedService.user.insuranceId
				);
				setInsurance(matchedInsurance || null);

				const matchedSupplementaryInsurance = data.find(
					(suppIns: { id: any }) =>
						suppIns.id ===
						purchasedServiceData.purchasedService.user
							.supplementalInsuranceId
				);
				setSupplementaryInsurance(
					matchedSupplementaryInsurance || null
				);

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
							throw new Error(
								"Failed to fetch user data from db.json"
							);
						}
						return response.json();
					})
					.then((data) => {
						const matchedInsurance = data.insurance.find(
							(ins: { insuranceType: any }) =>
								ins.insuranceType ===
								purchasedServiceData.purchasedService.user
									.insuranceId
						);
						setInsurance(matchedInsurance || null);

						const matchedSupplementaryInsurance =
							data.supplementaryInsurance.find(
								(suppIns: {
									supplementaryInsuranceType: any;
								}) =>
									suppIns.supplementaryInsuranceType ===
									purchasedServiceData.purchasedService.user
										.supplementalInsuranceId
							);
						setSupplementaryInsurance(
							matchedSupplementaryInsurance || null
						);

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
	}, [purchasedServiceData, purchaseId]);

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
		navigate(`/edit-user/${purchasedServiceData.purchasedService.userId}`, {
			state: { activeSection: "userPurchased" },
		});
	};

	return (
		<div className="custom-bg-4 min-vh-100">
			<div className="container py-5">
				{/* Service Information */}
				<div className="d-flex flex-column bg-white border border-2 shadow text-end rounded-5 p-0 pt-2 px-md-2 mx-3 mx-md-4 mx-lg-5 mb-4">
					<div className="text-start m-2">
						<FaCaretLeft
							type="button"
							onClick={handleBackClick}
							className="custom-back-btn"
							color="black"
						/>
					</div>

					<h4 className="text-center px-4 mx-1 py-2 py-lg-4">
						{language === "fa"
							? "اطلاعات سرویس"
							: "Service Information"}
					</h4>
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
									? purchasedServiceData.purchasedService
											.service.pageTitle
									: purchasedServiceData.purchasedService
											.service.pageTitleEN}
							</div>
						</div>

						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa"
									? "شناسه سرویس"
									: "Service ID"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{
									purchasedServiceData.purchasedService
										.serviceId
								}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "قیمت پایه" : "Base price"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{
									purchasedServiceData.purchasedService
										.service.basePrice
								}
							</div>
						</div>

						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "تخفیف" : "Discount"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{
									purchasedServiceData.purchasedService
										.service.discount
								}
							</div>
						</div>

						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa"
									? "نوع سرویس"
									: "Service type"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{getTypeString(
									Number(
										purchasedServiceData.purchasedService
											.service.type
									),
									language
								)}
							</div>
						</div>
					</div>
				</div>

				{/* User Information */}
				<div className="d-flex flex-column bg-white border border-2 shadow text-end rounded-5 p-0 pt-2 px-md-2 mx-3 mx-md-4 mx-lg-5 mb-4">
					<h4 className="text-center px-4 mx-1 pb-4 pt-4 pt-lg-5">
						{language === "fa"
							? "اطلاعات کاربر"
							: "User Information"}
					</h4>
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
								{language === "fa" ? "نام" : "Name"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{purchasedServiceData?.purchasedService?.user
									?.name || " "}
							</div>
						</div>

						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa"
									? "نام خانوادگی"
									: "Last name"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{
									purchasedServiceData?.purchasedService?.user
										?.lastName
								}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa"
									? "شماره همراه"
									: "Phone number"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{
									purchasedServiceData?.purchasedService?.user
										?.phoneNumber
								}
							</div>
						</div>

						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa"
									? "شماره ثابت"
									: "Fixed phone number"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{
									purchasedServiceData?.purchasedService?.user
										?.fixedPhoneNumber
								}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "شناسه کاربر" : "User ID"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{purchasedServiceData?.purchasedService?.userId}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa"
									? "آدرس ایمیل"
									: "Email address"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{
									purchasedServiceData?.purchasedService?.user
										?.emailAddress
								}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa"
									? "بیمه پایه"
									: "Basic insurance"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{language === "fa"
									? insurance?.companyName
									: insurance?.companyNameEN}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa"
									? `بیمه تکمیلی`
									: `Supplementary insurance`}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{language === "fa"
									? supplementaryInsurance?.companyName
									: supplementaryInsurance?.companyNameEN}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? `استان` : `Province`}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{
									purchasedServiceData?.purchasedService?.user
										?.residenceProvince
								}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? `شهر` : `City`}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{
									purchasedServiceData?.purchasedService?.user
										?.residenceCity
								}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? `آدرس منزل` : `Address`}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{
									purchasedServiceData?.purchasedService?.user
										?.residenceAddress
								}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? `کد پستی` : `Postal code`}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{
									purchasedServiceData?.purchasedService?.user
										?.residencePostalCode
								}
							</div>
						</div>
					</div>
				</div>

				{/* Purchase Information */}
				<div className="d-flex flex-column bg-white border border-2 shadow text-end rounded-5 p-0 pt-2 px-md-2 mx-3 mx-md-4 mx-lg-5 mb-4">
					<h4 className="text-center px-4 mx-1 pb-4 pt-4 pt-lg-5">
						{language === "fa"
							? "اطلاعات خرید"
							: "Purchase Information"}
					</h4>
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
									? "شماره سریال محصول"
									: "Service ID"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{
									purchasedServiceData.purchasedService
										.serviceId
								}
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
								{purchasedServiceData.purchasedService.id}
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
								{purchasedServiceData.purchasedService.status}
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
								{purchasedServiceData.purchasedService.date}
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
								{
									purchasedServiceData.purchasedService
										.lastUpdateTime
								}
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
								{
									purchasedServiceData.purchasedService
										.finalPrice
								}
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

				<ResultsSection
					adminPurchasedServiceData={
						purchasedServiceData.purchasedService
					}
					insuranceName={
						(language === "fa"
							? insurance?.companyName
							: insurance?.companyNameEN) as string
					}
					supplementaryInsuranceName={
						(language === "fa"
							? supplementaryInsurance?.companyName
							: supplementaryInsurance?.companyNameEN) as string
					}
				/>
			</div>
		</div>
	);
}

export default ManageUserInterfaceUserPurchasedServicesExtended;
