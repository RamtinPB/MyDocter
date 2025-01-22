import { FaCaretLeft } from "react-icons/fa";
import FormRender, { FormRenderHandle } from "../components/FormRender";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import "/src/cssFiles/customColors.css";
import "/src/cssFiles/servicePage.css";
import "/src/cssFiles/textOverflow.css";
import { useLanguage } from "../components/LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";
import { useAuth } from "../components/AuthContext";
import { FaCircleExclamation, FaTableList } from "react-icons/fa6";

interface serviceProps {
	id: number;
	name: string;
	enabled: boolean;
	type: number;

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
	discount: number;
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

function ServicePage() {
	const { id } = useParams<{ id: string }>();

	const [service, setService] = useState<serviceProps | null>(null);
	const [servicePageBanner, setServicePageBanner] = useState<string | null>(
		null
	);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	const [insurance, setInsurance] = useState<insuranceDataProps | null>(null);
	const [supplementaryInsurance, setSupplementaryInsurance] =
		useState<insuranceDataProps | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { language } = useLanguage(); // Get language and toggle function from context

	const { loginState } = useAuth();

	const navigate = useNavigate();

	const formRef = useRef<FormRenderHandle>(null);

	// fetch user data
	useEffect(() => {
		if (!loginState) return;
		setLoading(true);

		axiosInstance
			.post("/api/User/GetUserData") // Call the API to get user data
			.then((response) => {
				const data = response.data;

				setUserInfo(data);
				setLoading(false);
			})
			.catch(async (error) => {
				console.error(
					"API request failed, trying local db.json",
					error
				);
				try {
					const response = await fetch("/UserInformation.json"); // Adjust path if necessary
					if (!response.ok) {
						throw new Error("Failed to fetch data from db.json");
					}
					const data = await response.json();

					setUserInfo(data);
					setLoading(false);
				} catch (jsonErr) {
					console.error(
						"Failed to fetch data from both API and db.json",
						jsonErr
					);
				}
			});
	}, [loginState, id]);

	useEffect(() => {
		axiosInstance
			.post(
				"/api/Service/GetServicePageBanner",
				{
					serviceId: id,
				},
				{ responseType: "blob" }
			) // Specify blob as the response type
			.then((response) => {
				const imageBlob = response.data; // Binary image data
				const imageUrl = URL.createObjectURL(imageBlob); // Create a URL for the image
				setServicePageBanner(imageUrl); // Set the profile picture state
			})
			.catch((error) => {
				console.error(
					"API request for /api/Service/GetServicePageBanner failed.",
					error
				);
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
				fetch("/Insurances.json")
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
								ins.insuranceType === userInfo.insuranceId
						);
						setInsurance(matchedInsurance || null);

						const matchedSupplementaryInsurance =
							data.supplementaryInsurance.find(
								(suppIns: {
									supplementaryInsuranceType: any;
								}) =>
									suppIns.supplementaryInsuranceType ===
									userInfo.supplementalInsuranceId
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
	}, [userInfo, loginState, id]);

	// fetch service data
	useEffect(() => {
		setLoading(true);
		axiosInstance
			.post("/api/Service/GetServiceData", { serviceId: id }) // Call the API to get user data
			.then((response) => {
				const data = response.data.service;

				setService(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error(
					"API request for user data failed, trying local db.json",
					error
				);

				// Fetch from local db.json if API fails
				fetch("/ServiceData.json")
					.then((response) => {
						if (!response.ok) {
							throw new Error(
								"Failed to fetch user data from db.json"
							);
						}
						return response.json();
					})
					.then((data) => {
						const selectedService = data.find(
							(s: { id: any }) => `${s.id}` === id
						);
						if (selectedService) {
							setService(selectedService);
							setServicePageBanner(selectedService.pageBannerUrl);
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
		return (
			<div
				className="spinner-border text-primary text-center my-5"
				role="status"
			>
				<span className="visually-hidden">Loading...</span>
			</div>
		);
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	if (!service) {
		return (
			<div className="text-center my-5 text-danger">
				Service not found
			</div>
		);
	}

	const handleBackClick = () => {
		if (service.type === 1) {
			navigate("/SpecialistDoctorPrescription"); // Replace with actual route
		} else if (service.type === 0) {
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
		const serviceDiscount =
			parseFloat(service.discount as unknown as string) || 0;

		// Step 1: Calculate the price after insurance contribution
		let amountAfterInsurance =
			servicePrice - servicePrice * (insuranceContribution / 100);

		// Step 2: Apply supplementary insurance contribution
		let amountAfterSupplementary =
			amountAfterInsurance -
			servicePrice * (supplementaryContribution / 100);

		// Step 3: Subtract the service discount
		let finalAmount = amountAfterSupplementary - serviceDiscount;

		// Ensure the final amount is not negative
		finalAmount = finalAmount < 0 ? 0 : finalAmount;

		// Return the final amount formatted as currency
		return finalAmount.toFixed(0); // This will round the result to two decimal places
	};

	const handleSubmit = () => {
		if (formRef.current) {
			formRef.current.submitForm(); // No TypeScript error here
		}
	};

	return (
		<div className="container">
			<div className="container custom-bg-4 shadow rounded-5 pb-3 mb-4">
				{/* Header Section with Back Button and Service Name */}
				<div className="row custom-bg-1 align-items-center shadow rounded-5 mb-4 mt-4 mt-lg-5 p-2 p-md-3">
					<div className="col-2 ">
						<FaCaretLeft
							type="button"
							onClick={handleBackClick}
							className="custom-back-btn"
							color="white"
						/>
					</div>
					<div className="col-8 d-flex flex-column justify-content-center text-center text-white">
						<h4 className="mb-0">
							{language === "fa"
								? service.pageTitle
								: service.pageTitleEN}
						</h4>
					</div>
				</div>

				{/* Image and Description Section */}
				<div
					className={`d-flex flex-column-reverse flex-lg-row justify-content-between align-items-center align-items-lg-start bg-white border border-2 shadow text-${
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
									? service.pageDescription?.replace(
											/\n/g,
											"<br>"
										)
									: service.pageDescriptionEN?.replace(
											/\n/g,
											"<br>"
										),
						}}
						style={{
							direction: language === "fa" ? "rtl" : "ltr",
							textAlign: "justify",
						}}
					></p>
					<img
						src={servicePageBanner || ""}
						alt="Service"
						className="custom-service-img img-fluid shadow-sm mb-3 mb-lg-0 rounded-5"
					/>
				</div>

				{/* Form Render Section */}
				<div
					className={`bg-white border border-2 shadow text-${
						language === "fa" ? "end" : "start"
					} rounded-5 py-4 px-0 px-md-1 mx-3 mx-md-4 mx-lg-5 mb-4`}
				>
					<div
						className="d-flex align-items-center mb-2 justify-content-start px-4"
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					>
						<FaTableList size={20} className="mb-1" />
						<h5 className=" mx-2 mb-0">
							{language === "fa" ? "فرم سرویس" : "Service Form"}
						</h5>
					</div>
					<div className="border border-1 shadow-sm rounded-4 px-3 mx-4 py-2">
						{formRef ? (
							<FormRender ref={formRef} />
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

				{/* Important Notes Section */}
				<div
					className={`bg-white border border-2 border-inherit shadow text-${
						language === "fa" ? "end" : "start"
					} rounded-5 py-4 px-4 mx-3 mx-md-4 mx-lg-5 mb-4`}
				>
					<div
						className={`d-flex align-items-center justify-content-start mb-2`}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					>
						<FaCircleExclamation
							size={22}
							className="text-warning mb-1"
						/>
						<h5 className=" mx-2  my-auto">
							{language === "fa"
								? "نکات مهم سرویس"
								: "Important Notes"}
						</h5>
					</div>

					<p
						className=" mx-1"
						dangerouslySetInnerHTML={{
							__html:
								(language === "fa"
									? `قبل از استفاده از این سرویس حتما <a href="/UserIEInformation" style="color: blue; text-decoration: inherit;">ارزیابی اولیه</a> و <a href="/UserInformation" style="color: blue; text-decoration: inherit;">اطلاعات کاربر</a> را از منوی کاربری تکمیل کنید.`
									: `Before using this service, be sure to complete the <a href="/UserIEInformation" style="color: blue; text-decoration: inherit;">Initial Evaluation</a> and <a href="/UserIEInformation" style="color: blue; text-decoration: inherit;">User Information</a> sections from the user dashboard.`) +
								"<br>" +
								(language === "fa"
									? service.importantNotes
										? service.importantNotes
												.replace(/\n/g, "<br>")
												.replace(
													"ارزیابی اولیه",
													'<a href="#initial-evaluation" style="color: blue; text-decoration: inherit;">ارزیابی اولیه</a>'
												)
										: ""
									: service.importantNotesEN
										? service.importantNotesEN
												.replace(/\n/g, "<br>")
												.replace(
													/initial evaluation/i,
													'<a href="#initial-evaluation" style="color: blue; text-decoration: inherit;">Initial Evaluation</a>'
												)
										: " "),
						}}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					/>
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
									<th>
										{language === "fa"
											? "نوع بیمه"
											: "Insurance Type"}
									</th>
									<th>
										{language === "fa"
											? "سهم بیمه"
											: "Insurance Contribution"}
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
									<th>
										{language === "fa"
											? "قیمت سرویس"
											: "Service Cost"}
									</th>
									<th>
										{language === "fa"
											? "مبالغ یارانه"
											: "Discount Amount"}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										{insurance
											? language === "fa"
												? insurance?.companyName
												: insurance?.companyNameEN
											: "N/A"}
									</td>
									<td>
										{insurance
											? insurance?.discountPercentage
											: "N/A"}
									</td>
									<td>
										{supplementaryInsurance
											? language === "fa"
												? supplementaryInsurance?.companyName
												: supplementaryInsurance?.companyNameEN
											: "N/A"}
									</td>
									<td>
										{supplementaryInsurance
											? supplementaryInsurance?.discountPercentage
											: "N/A"}
									</td>
									<td>{service.basePrice}</td>
									<td>{service.discount}</td>
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
						<button
							className="btn btn-success rounded-pill px-4 py-2"
							type="button"
							onClick={handleSubmit}
						>
							{language === "fa"
								? "خریداری سرویس"
								: "Purchase Service"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ServicePage;
