import { useLanguage } from "../components/LanguageContext";
import Logo from "/images/Logo_Black.png";
import LogoEN from "/images/LogoEN_Black.png";
import { useRef } from "react";
import React from "react";

interface purchasedServiceProps {
	userPurchasedServiceData?: {
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
	};
	userInfo?: {
		lastName: string;
		name: string;
		age: string;
		balance: number;
		birthdate: string;
		educationLevel: string;
		email: string;
		fatherName: string;
		fixedPhoneNumber: string;
		gender: string;
		insuranceId: number;
		isIranian: boolean;
		isMarried: boolean;
		nationalCode: string;
		phoneNumber: string;
		residenceAddress: string;
		residenceCity: string;
		residencePostalCode: string;
		residenceProvince: string;
		supplementalInsuranceId: number;
	};

	adminPurchasedServiceData?: {
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
	insuranceName: string;
	supplementaryInsuranceName: string;
}

const getTypeString = (type: number, language: string) => {
	switch (type) {
		case 0:
			return language === "fa" ? "عمومی" : "General";
		case 1:
			return language === "fa" ? "تخصصی" : "Specialist";
	}
};

function UserContent({
	userPurchasedServiceData,
	userInfo,
	insuranceName,
	supplementaryInsuranceName,
	language,
}: {
	userPurchasedServiceData?: purchasedServiceProps["userPurchasedServiceData"];
	userInfo?: purchasedServiceProps["userInfo"];
	insuranceName: string;
	supplementaryInsuranceName: string;
	language: string;
}) {
	return (
		<>
			{/* Service Info */}
			<div className="d-flex flex-column justify-content-center align-items-start my-5 w-100">
				<h5>
					{language === "fa"
						? "مشخصات سرویس و خرید"
						: "Service and Purchase Information"}
				</h5>
				<table className="table ">
					<thead>
						<tr>
							<th>
								{language === "fa"
									? "نام سرویس"
									: "Service Name"}
							</th>
							<th>
								{language === "fa"
									? "وضعیت پیگیری"
									: "User Name"}
							</th>
							<th>
								{language === "fa"
									? "شماره سریال محصول"
									: "User Name"}
							</th>
							<th>
								{language === "fa"
									? "شماره سریال تراکنش"
									: "User Name"}
							</th>
							<th>
								{language === "fa"
									? "تاریخ خریداری"
									: "User Name"}
							</th>
							<th>
								{language === "fa"
									? "تاریخ آخرین بروزرسانی"
									: "User Name"}
							</th>
							<th>
								{language === "fa"
									? "قیمت نهایی خرید"
									: "User Name"}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								{language === "fa"
									? userPurchasedServiceData?.serviceTitle ||
										"N/A"
									: userPurchasedServiceData?.serviceTitleEN ||
										"N/A"}
							</td>
							<td>{userPurchasedServiceData?.status || "N/A"}</td>
							<td>
								{userPurchasedServiceData?.serviceId || "N/A"}
							</td>
							<td>{userPurchasedServiceData?.id || "N/A"}</td>
							<td>{userPurchasedServiceData?.date || "N/A"}</td>
							<td>
								{userPurchasedServiceData?.lastUpdateTime ||
									"N/A"}
							</td>
							<td>
								{userPurchasedServiceData?.finalPrice || "N/A"}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* User Info */}
			<div className="d-flex flex-column justify-content-center align-items-start my-5 w-100">
				<h5>
					{language === "fa" ? "مشخصات کاربر" : "User Information"}
				</h5>
				<table className="table">
					<thead>
						<tr>
							<th>{language === "fa" ? "نام" : "User Name"}</th>
							<th>
								{language === "fa"
									? "نام خانوادگی"
									: "User Name"}
							</th>
							<th>
								{language === "fa"
									? "شماره همراه"
									: "User Name"}
							</th>
							<th>
								{language === "fa" ? "آدرس ایمیل" : "User Name"}
							</th>
							<th>
								{language === "fa" ? "بیمه پایه" : "User Name"}
							</th>
							<th>
								{language === "fa"
									? "بیمه تکمیلی"
									: "User Name"}
							</th>
							<th>{language === "fa" ? "استان" : "User Name"}</th>
							<th>{language === "fa" ? "شهر" : "User Name"}</th>
							<th>
								{language === "fa" ? "آدرس منزل" : "User Name"}
							</th>
							<th>
								{language === "fa" ? "کد پستی" : "User Name"}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{userInfo?.name || "N/A"}</td>
							<td>{userInfo?.lastName || "N/A"}</td>
							<td>{userInfo?.phoneNumber || "N/A"}</td>
							<td>{userInfo?.email || "N/A"}</td>
							<td>{insuranceName || "N/A"}</td>
							<td>{supplementaryInsuranceName || "N/A"}</td>
							<td>{userInfo?.residenceProvince || "N/A"}</td>
							<td>{userInfo?.residenceCity || "N/A"}</td>
							<td>{userInfo?.residenceAddress || "N/A"}</td>
							<td>{userInfo?.residencePostalCode || "N/A"}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
}

function AdminContent({
	adminPurchasedServiceData,
	insuranceName,
	supplementaryInsuranceName,
	language,
}: {
	adminPurchasedServiceData?: purchasedServiceProps["adminPurchasedServiceData"];
	insuranceName: string;
	supplementaryInsuranceName: string;
	language: string;
}) {
	return (
		<>
			{/* Purchase Info */}
			<div className="d-flex flex-column justify-content-center align-items-start my-5 w-100">
				<h5>
					{language === "fa"
						? "مشخصات  سرویس"
						: "Service Information"}
				</h5>
				<table className="table ">
					<thead>
						<tr>
							<th>
								{language === "fa"
									? "نام سرویس"
									: "Service Name"}
							</th>
							<th>
								{language === "fa"
									? "شناسه سرویس"
									: "Service ID"}
							</th>
							<th>
								{language === "fa"
									? "قیمت پایه سرویس"
									: "Base Price"}
							</th>
							<th>{language === "fa" ? "تخفیف" : ""}</th>
							<th>{language === "fa" ? "نوع سرویس" : ""}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								{language === "fa"
									? adminPurchasedServiceData?.service
											.pageTitle || "N/A"
									: adminPurchasedServiceData?.service
											.pageTitleEN || "N/A"}
							</td>
							<td>
								{adminPurchasedServiceData?.serviceId || "N/A"}
							</td>
							<td>
								{adminPurchasedServiceData?.service.basePrice ||
									"N/A"}
							</td>
							<td>
								{adminPurchasedServiceData?.service.discount ||
									"N/A"}
							</td>
							<td>
								{getTypeString(
									Number(
										adminPurchasedServiceData?.service.type
									),
									language
								) || "N/A"}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* User Info */}
			<div className="d-flex flex-column justify-content-center align-items-start my-5 w-100">
				<h5>
					{language === "fa" ? "مشخصات کاربر" : "User Information"}
				</h5>
				<table className="table">
					<thead>
						<tr>
							<th>{language === "fa" ? "نام" : "User Name"}</th>
							<th>
								{language === "fa"
									? "نام خانوادگی"
									: "User Name"}
							</th>
							<th>
								{language === "fa"
									? "شماره همراه"
									: "User Name"}
							</th>
							<th>
								{language === "fa" ? "شماره ثابت" : "User Name"}
							</th>
							<th>
								{language === "fa"
									? "شناسه کاربر"
									: "User Name"}
							</th>
							<th>
								{language === "fa" ? "آدرس ایمیل" : "User Name"}
							</th>
							<th>
								{language === "fa" ? "بیمه پایه" : "User Name"}
							</th>
							<th>
								{language === "fa"
									? "بیمه تکمیلی"
									: "User Name"}
							</th>
							<th>{language === "fa" ? "استان" : "User Name"}</th>
							<th>{language === "fa" ? "شهر" : "User Name"}</th>
							<th>
								{language === "fa" ? "آدرس منزل" : "User Name"}
							</th>
							<th>
								{language === "fa" ? "کد پستی" : "User Name"}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								{adminPurchasedServiceData?.user.name || "N/A"}
							</td>
							<td>
								{adminPurchasedServiceData?.user.lastName ||
									"N/A"}
							</td>
							<td>
								{adminPurchasedServiceData?.user.phoneNumber ||
									"N/A"}
							</td>
							<td>
								{adminPurchasedServiceData?.user
									.fixedPhoneNumber || "N/A"}
							</td>
							<td>
								{adminPurchasedServiceData?.userId || "N/A"}
							</td>
							<td>
								{adminPurchasedServiceData?.user.emailAddress ||
									"N/A"}
							</td>
							<td>{insuranceName || "N/A"}</td>
							<td>{supplementaryInsuranceName || "N/A"}</td>
							<td>
								{adminPurchasedServiceData?.user
									.residenceProvince || "N/A"}
							</td>
							<td>
								{adminPurchasedServiceData?.user
									.residenceCity || "N/A"}
							</td>
							<td>
								{adminPurchasedServiceData?.user
									.residenceAddress || "N/A"}
							</td>
							<td>
								{adminPurchasedServiceData?.user
									.residencePostalCode || "N/A"}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* Purchase Info */}
			<div className="d-flex flex-column justify-content-center align-items-start my-5 w-100">
				<h5>
					{language === "fa"
						? "مشخصات  خرید"
						: "Purchase Information"}
				</h5>
				<table className="table ">
					<thead>
						<tr>
							<th>
								{language === "fa"
									? "شماره سریال محصول"
									: "User Name"}
							</th>
							<th>
								{language === "fa"
									? "شماره سریال تراکنش"
									: "User Name"}
							</th>
							<th>
								{language === "fa"
									? "وضعیت پیگیری"
									: "User Name"}
							</th>
							<th>
								{language === "fa"
									? "تاریخ خریداری"
									: "User Name"}
							</th>
							<th>
								{language === "fa"
									? "تاریخ آخرین بروزرسانی"
									: "User Name"}
							</th>
							<th>
								{language === "fa"
									? "قیمت نهایی خرید"
									: "User Name"}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								{adminPurchasedServiceData?.serviceId || "N/A"}
							</td>
							<td>{adminPurchasedServiceData?.id || "N/A"}</td>
							<td>
								{adminPurchasedServiceData?.status || "N/A"}
							</td>
							<td>{adminPurchasedServiceData?.date || "N/A"}</td>
							<td>
								{adminPurchasedServiceData?.lastUpdateTime ||
									"N/A"}
							</td>
							<td>
								{adminPurchasedServiceData?.finalPrice || "N/A"}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
}

const ResultsPrintableContent = React.forwardRef(
	(
		{
			userPurchasedServiceData,
			userInfo,
			adminPurchasedServiceData,
			insuranceName,
			supplementaryInsuranceName,
			language,
		}: {
			userPurchasedServiceData?: purchasedServiceProps["userPurchasedServiceData"];
			userInfo?: purchasedServiceProps["userInfo"];
			adminPurchasedServiceData?: purchasedServiceProps["adminPurchasedServiceData"];
			insuranceName: string;
			supplementaryInsuranceName: string;
			language: string;
		},
		ref: React.Ref<HTMLDivElement>
	) => {
		const logoSrc = language === "fa" ? Logo : LogoEN;

		return (
			<div ref={ref} className="container ">
				<div
					className="d-flex flex-column justify-content-between align-items-center my-4 px-4 w-100"
					style={{
						direction: language === "fa" ? "rtl" : "ltr",
						textAlign: language === "fa" ? "right" : "left",
					}}
				>
					{/* Logo */}
					<div className="d-flex flex-column justify-content-between align-items-center my-4 w-100">
						<img src={logoSrc} alt="Logo" />
						<h3 className="mt-5">
							{language === "fa"
								? "گزارش سرویس"
								: "Service Report"}
						</h3>
					</div>

					{/* Tables section */}
					{adminPurchasedServiceData && (
						<AdminContent
							adminPurchasedServiceData={
								adminPurchasedServiceData
							}
							insuranceName={insuranceName}
							supplementaryInsuranceName={
								supplementaryInsuranceName
							}
							language={language}
						/>
					)}
					{userPurchasedServiceData && (
						<UserContent
							userPurchasedServiceData={userPurchasedServiceData}
							userInfo={userInfo}
							insuranceName={insuranceName}
							supplementaryInsuranceName={
								supplementaryInsuranceName
							}
							language={language}
						/>
					)}

					{/* Results Content */}
					<div className="w-100 my-4">
						<h5>
							{language === "fa"
								? "نتایج سرویس"
								: "Service Results"}
						</h5>
						<p className="">
							{userPurchasedServiceData &&
								userPurchasedServiceData.result}
							{adminPurchasedServiceData &&
								adminPurchasedServiceData.result}
						</p>
					</div>
				</div>
			</div>
		);
	}
);

export default function ResultsSection({
	userPurchasedServiceData,
	userInfo,
	insuranceName,
	supplementaryInsuranceName,
	adminPurchasedServiceData,
}: purchasedServiceProps) {
	const { language } = useLanguage();
	const printableRef = useRef<HTMLDivElement>(null);

	const handlePrint = () => {
		if (printableRef.current) {
			const printWindow = window.open("", "_blank", "a4");
			printWindow?.document.write(
				"<html><head><title>Title</title></head><body>"
			);
			// Add Bootstrap CSS to the print window
			printWindow?.document.write(
				`<html><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></head><body>`
			);
			printWindow?.document.write(
				`<html><link rel="preconnect" href="https://fonts.googleapis.com" /></head><body>`
			);
			printWindow?.document.write(
				`<html><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /></head><body>`
			);
			printWindow?.document.write(
				`<html><link href="https://fonts.googleapis.com/css2?family=Vazirmatn:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Sans+Arabic:wght@100..900&display=swap" rel="stylesheet"/></head><body>`
			);
			printWindow?.document.write(
				`<html><link rel="stylesheet" href="./src/cssFiles/customFonts.css" /></head><body>`
			);
			printWindow?.document.write(printableRef.current.innerHTML);
			//printWindow?.document.write("</body></html>");
			printWindow?.document.close();
			printWindow?.focus();
			printWindow?.print();
		}
	};

	return (
		<div
			className={`bg-white border border-2 shadow text-${
				language === "fa" ? "end" : "start"
			} rounded-5 py-4 px-0 px-md-1 mx-3 mx-md-4 mx-lg-5 mb-4`}
		>
			<h5 className="px-4 mx-1">
				{language === "fa" ? "نتایج" : "Results"}
			</h5>
			<div className="border border-1 border-primary shadow-sm rounded-4 px-3 mx-4 py-2">
				{userPurchasedServiceData?.result ||
				adminPurchasedServiceData?.result ? (
					<div className="text-center px-3 mx-4 py-3">
						<p
							className="m-0"
							dangerouslySetInnerHTML={{
								__html:
									(language === "fa"
										? "!نتایج آماده بررسی می باشند"
										: "Results are ready for review") +
									"<br>" +
									(language === "fa"
										? ".جهت دانلود دکمه زیر را کلیک کنید"
										: "Please click the button below to download your results"),
							}}
						/>

						<div style={{ display: "none" }}>
							<ResultsPrintableContent
								ref={printableRef}
								userPurchasedServiceData={
									userPurchasedServiceData
								}
								insuranceName={insuranceName}
								supplementaryInsuranceName={
									supplementaryInsuranceName
								}
								userInfo={userInfo}
								adminPurchasedServiceData={
									adminPurchasedServiceData
								}
								language={language}
							/>
						</div>
						<button
							type="button"
							className="btn btn-success rounded-pill px-3 py-1 mt-2"
							onClick={handlePrint}
							style={{ width: "fit-content" }}
						>
							{language === "fa"
								? "دانلود نتایج"
								: "Download the Results"}
						</button>
					</div>
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
	);
}
