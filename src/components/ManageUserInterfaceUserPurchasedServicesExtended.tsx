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
		axiosInstance
			.post("/api/Admin/GetPurchasedService", {
				purchasedServiceId: purchaseId,
			})
			.then((response) => {
				// Process the response to update the status field
				const updatedData = {
					...response.data,
					status: getStatusString(response.data.status, language),
				};
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
							(s: { purchaseId: any }) => `${s.purchaseId}` === purchaseId
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
	}, []);

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
					(ins: { id: any }) => ins.id === purchasedServiceData.user.insuranceId
				);
				setInsurance(matchedInsurance || null);

				const matchedSupplementaryInsurance = data.find(
					(suppIns: { id: any }) =>
						suppIns.id === purchasedServiceData.user.supplementalInsuranceId
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
								ins.insuranceType === purchasedServiceData.user.insuranceId
						);
						setInsurance(matchedInsurance || null);

						const matchedSupplementaryInsurance =
							data.supplementaryInsurance.find(
								(suppIns: { supplementaryInsuranceType: any }) =>
									suppIns.supplementaryInsuranceType ===
									purchasedServiceData.user.supplementalInsuranceId
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
		navigate(`/edit-user/${purchasedServiceData.userId}`, {
			state: { activeSection: "userPurchased" }, // Hardcode "manageUsers" as the active section
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

					<h4 className="text-center px-4 mx-1 py-4">
						{language === "fa" ? "اطلاعات سرویس" : "Service Information"}
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
								{language === "fa" ? "نام سرویس" : "Service Name"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{language === "fa"
									? purchasedServiceData.service.pageTitle
									: purchasedServiceData.service.pageTitleEN}
							</div>
						</div>

						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "شناسه سرویس" : "Service ID"}
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
								{language === "fa" ? "قیمت پایه" : "Base price"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{purchasedServiceData.service.basePrice}
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
								{purchasedServiceData.service.discount}
							</div>
						</div>

						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "نوع سرویس" : "Service type"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{getTypeString(
									Number(purchasedServiceData.service.type),
									language
								)}
							</div>
						</div>
					</div>
				</div>

				{/* User Information */}
				<div className="d-flex flex-column bg-white border border-2 shadow text-end rounded-5 p-0 pt-2 px-md-2 mx-3 mx-md-4 mx-lg-5 mb-4">
					<h4 className="text-center px-4 mx-1 pb-4 pt-5">
						{language === "fa" ? "اطلاعات کاربر" : "User Information"}
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
							<h6 className=" mx-1">{language === "fa" ? "نام" : "Name"}</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{purchasedServiceData.user.name}
							</div>
						</div>

						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "نام خانوادگی" : "Last name"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{purchasedServiceData.user.lastName}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "شماره همراه" : "Phone number"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{purchasedServiceData.user.phoneNumber}
							</div>
						</div>

						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "شماره ثابت" : "Fixed phone number"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{purchasedServiceData.user.fixedPhoneNumber}
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
								{purchasedServiceData.userId}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "آدرس ایمیل" : "Email address"}
							</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{purchasedServiceData.user.emailAddress}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">
								{language === "fa" ? "بیمه پایه" : "Basic insurance"}
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
								{language === "fa" ? `بیمه تکمیلی` : `Supplementary insurance`}
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
								{purchasedServiceData.user.residenceProvince}
							</div>
						</div>
						<div
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
						>
							<h6 className=" mx-1">{language === "fa" ? `شهر` : `City`}</h6>
							<div className="border border-1 border-primary shadow-sm rounded-4 px-3 py-2">
								{purchasedServiceData.user.residenceCity}
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
								{purchasedServiceData.user.residenceAddress}
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
								{purchasedServiceData.user.residencePostalCode}
							</div>
						</div>
					</div>
				</div>

				{/* Purchase Information */}
				<div className="d-flex flex-column bg-white border border-2 shadow text-end rounded-5 p-0 pt-2 px-md-2 mx-3 mx-md-4 mx-lg-5 mb-4">
					<h4 className="text-center px-4 mx-1 pb-4 pt-5">
						{language === "fa" ? "اطلاعات خرید" : "User Information"}
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
								{language === "fa" ? "شماره سریال محصول" : "Service ID"}
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
								{language === "fa" ? "شماره سریال تراکنش" : "Purchase ID"}
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
								{language === "fa" ? "تاریخ خریداری" : "Purchase Date"}
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
								{language === "fa" ? "تاریخ آخرین تغییر" : "Last Update Date"}
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

				{/* <div
					className={`bg-white border border-2 shadow text-${
						language === "fa" ? "end" : "start"
					} rounded-5 py-4 px-0 px-md-2 mx-3 mx-md-4 mx-lg-5 mb-4`}
				>
					<h5 className="px-4 mx-1">
						{language === "fa" ? "فایل های ارسال شده" : "Sent Files"}
					</h5>
					{purchasedServiceData.files &&
					purchasedServiceData.files.length > 0 ? (
						<div className="d-flex flex-wrap justify-content-start align-items-center border border-1 border-primary shadow-sm rounded-4 px-2 mx-4 py-2">
							{purchasedServiceData.files.map((file, index) => (
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
				</div> */}

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
						<FormRenderFilled purchasedServiceData={purchasedServiceData} />
					</div>
				</div>

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
							<p>{purchasedServiceData.result}</p>
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

export default ManageUserInterfaceUserPurchasedServicesExtended;
