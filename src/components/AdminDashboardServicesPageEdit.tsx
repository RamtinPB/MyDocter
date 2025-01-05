import { FaCaretLeft } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "/src/cssFiles/customColors.css";
import "/src/cssFiles/servicePage.css";
import FormBuilder from "./FormBuilder";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";

// function convertTypeToString(type: number | string): string {
// 	if (type === 0 || type === "0") return "General";
// 	if (type === 1 || type === "1") return "Specialist";
// 	return "";
// }

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
	discount: number;
}

function ServicePageEdit() {
	const { id } = useParams();

	const [service, setService] = useState<serviceProps | null>(null);

	const [displayImageUrlData, setDisplayImageUrlData] = useState<
		string | null
	>(null);
	const [pageBannerUrlData, setPageBannerUrlData] = useState<string | null>(
		null
	);

	//const fileInputRef = useRef<HTMLInputElement>(null);

	const [dataUpdateFlag, setDataUpdateFlag] = useState(false);

	const { language } = useLanguage(); // Get language and toggle function from context
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await axiosInstance.post(
					"/api/Service/GetServiceData",
					{
						serviceId: id,
					}
				);
				if (response.status !== 200) {
					throw new Error("Failed to fetch data from API");
				}
				const serviceData = response.data.service;

				setService(serviceData);
			} catch (err) {
				try {
					const response = await fetch("/ServiceData.json"); // Adjust path if necessary
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					const data = await response.json();
					const selectedService = data.find(
						(s: { id: any }) => `${s.id}` === id
					);
					if (selectedService) {
						setService(selectedService);
						setPageBannerUrlData(selectedService.pageBannerUrl);
						setDisplayImageUrlData(selectedService.displayImageUrl);
					}
				} catch (err) {
					console.error("Failed to fetch services", err);
				}
			}
		};

		fetchServices();
	}, [dataUpdateFlag, id]);

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
				setPageBannerUrlData(imageUrl); // Set the profile picture state
			})
			.catch((error) => {
				console.log(
					"failed to capture ServicePageBanner from api",
					error
				);
			});
	}, []);

	useEffect(() => {
		axiosInstance
			.post(
				"/api/Service/GetServiceDisplayBanner",
				{
					serviceId: id,
				},
				{ responseType: "blob" }
			) // Specify blob as the response type
			.then((response) => {
				const imageBlob = response.data; // Binary image data
				const imageUrl = URL.createObjectURL(imageBlob); // Create a URL for the image
				setDisplayImageUrlData(imageUrl); // Set the profile picture state
			})
			.catch((error) => {
				console.log(
					"failed to capture ServiceDisplayBanner from api",
					error
				);
			});
	}, []);

	// Clean up the object URL when the component unmounts
	useEffect(() => {
		return () => {
			if (displayImageUrlData) {
				URL.revokeObjectURL(displayImageUrlData);
			}
			if (pageBannerUrlData) {
				URL.revokeObjectURL(pageBannerUrlData);
			}
		};
	}, [displayImageUrlData, pageBannerUrlData]);

	// Function to handle the back button
	const handleBackClick = () => {
		// Check the section passed in the location state
		const section = location.state?.section || "mainPage";
		navigate("/AdminDashboard", {
			state: { activeSection: section }, // Pass the section back to AdminDashboard
		});
	};

	const handleDisplayImageUrlDataChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setDisplayImageUrlData(URL.createObjectURL(file));

			const previewUrl = URL.createObjectURL(file); // Create a preview URL for display
			setService((prevService) =>
				prevService
					? { ...prevService, displayImageUrl: previewUrl }
					: null
			);

			const formData = new FormData();
			formData.append("file", file);
			formData.append("serviceId", String(id));

			axiosInstance
				.post("/api/File/UploadServiceDisplayBanner", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((response) => {
					console.log(
						"service picture uploaded successfully:",
						response.data
					);
				})
				.catch((error) => {
					console.error("Error uploading service picture:", error);
				});
		}
	};

	const handlePageBannerUrlDataChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setPageBannerUrlData(URL.createObjectURL(file)); // Store the file for submission

			const previewUrl = URL.createObjectURL(file); // Create a preview URL for display
			setService((prevService) =>
				prevService
					? { ...prevService, pageBannerUrl: previewUrl }
					: null
			);

			const formData = new FormData();
			formData.append("file", file);
			formData.append("serviceId", String(id));

			axiosInstance
				.post("/api/File/UploadServicePageBanner", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((response) => {
					console.log(
						"service picture uploaded successfully:",
						response.data
					);
				})
				.catch((error) => {
					console.error("Error uploading service picture:", error);
				});
		}
	};

	const handleChange = (
		field: keyof serviceProps,
		value: string | number | boolean
	) => {
		setService((prevService) =>
			prevService ? { ...prevService, [field]: value } : null
		);
	};

	const handleSubmit = async () => {
		const modifiedService = {
			...service,
			type: service?.type.toString(), // Ensure `type` is sent as a string
		};
		try {
			const response = await axiosInstance.post(
				"/api/Admin/EditService",
				modifiedService
			);
			if (response.status === 200) {
				alert(
					language === "fa"
						? "ارسال اطلاعات انجام شد"
						: "Submited Information successfuly"
				);
			}
		} catch (error) {
			alert(
				language === "fa"
					? "ارسال اطلاعات انجام نشد"
					: "Failed to submit Information"
			);
		}

		setDataUpdateFlag((prev) => !prev);
	};

	// @ts-ignore
	const handleCancel = () => {
		setDataUpdateFlag((prev) => !prev);
	};

	const preprocessNotes = (value: string) => {
		return value.replace(/\n/g, "<br>");
	};

	// const handleButtonClick = () => {
	// 	if (fileInputRef.current) {
	// 		fileInputRef.current.click();
	// 	}
	// };

	return (
		<div className="container">
			<div className="container custom-bg-4 shadow rounded-5 pb-3 mb-4">
				{/* Header Section with Back Button and Service Name */}
				<div className="row custom-bg-1 align-items-center shadow rounded-5 mb-4 mt-4 mt-lg-5 p-2 p-md-3">
					<div className="col-2">
						<FaCaretLeft
							type="button"
							onClick={handleBackClick}
							className="custom-back-btn"
							color="white"
						/>
					</div>
					<div className="col-8 d-flex flex-column justify-content-center text-center text-white">
						<h4 className="mb-0">{service?.name}</h4>
					</div>
				</div>

				{/* Service Information section */}
				<div
					className="d-flex flex-lg-row flex-column justify-content-center bg-white border border-2 shadow text-end rounded-5 p-5 pt-4 mx-3 mx-md-4 mx-lg-5 mb-4 gap-5 gap-lg-3"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<div className="col-12 col-lg-6">
						<h5 className="text-center">
							{language === "fa"
								? "اطلاعات کارت سرویس"
								: "Service Card Data"}
						</h5>

						<div
							className={`py-3 text-${language === "fa" ? "end" : "start"}`}
							style={{
								direction: language === "fa" ? "rtl" : "ltr",
							}}
						>
							<label htmlFor="displayTitle" className="py-2">
								{language === "fa"
									? "تیتر کارت سرویس"
									: "Service Card Title (Farsi)"}
							</label>
							<input
								type="text"
								className={`form-control  text-end`}
								onChange={(e) =>
									handleChange(
										"displayTitle",
										preprocessNotes(e.target.value)
									)
								}
								placeholder={"متن خود را وارد کنید"}
								value={
									service?.displayTitle?.replace(
										/<br>/g,
										"\n"
									) || ""
								}
							/>
						</div>

						<div
							className={`py-3 text-${language === "fa" ? "end" : "start"}`}
							style={{
								direction: language === "fa" ? "rtl" : "ltr",
							}}
						>
							<label htmlFor="" className="py-2">
								{language === "fa"
									? "تیتر کارت سرویس (انگلیسی)"
									: "Service Card Title (English)"}
							</label>
							<input
								type="text"
								className={`form-control text-start`}
								onChange={(e) =>
									handleChange(
										"displayTitleEN",
										preprocessNotes(e.target.value)
									)
								}
								placeholder={"Write your input"}
								value={
									service?.displayTitleEN?.replace(
										/<br>/g,
										"\n"
									) || ""
								}
							/>
						</div>

						<div
							className={`py-3 text-${language === "fa" ? "end" : "start"}`}
							style={{
								direction: language === "fa" ? "rtl" : "ltr",
							}}
						>
							<label htmlFor="" className="py-2">
								{language === "fa"
									? "توضیحات کارت سرویس"
									: "Service Card Desctiption (Farsi)"}
							</label>
							<textarea
								className={`form-control text-end h-100`}
								onChange={(e) =>
									handleChange(
										"displayDescription",
										preprocessNotes(e.target.value)
									)
								}
								value={
									service?.displayDescription?.replace(
										/<br>/g,
										"\n"
									) || ""
								}
								rows={3}
								placeholder={"متن خود را وارد کنید"}
								style={{ resize: "none" }}
							></textarea>
						</div>

						<div
							className={`py-3 text-${language === "fa" ? "end" : "start"}`}
							style={{
								direction: language === "fa" ? "rtl" : "ltr",
							}}
						>
							<label htmlFor="" className="py-2">
								{language === "fa"
									? "توضیحات کارت سرویس (انگلیسی)"
									: "Service Card Desctiption (English)"}
							</label>
							<textarea
								className={`form-control text-start h-100`}
								onChange={(e) =>
									handleChange(
										"displayDescriptionEN",
										preprocessNotes(e.target.value)
									)
								}
								value={
									service?.displayDescriptionEN?.replace(
										/<br>/g,
										"\n"
									) || ""
								}
								rows={3}
								placeholder={"Write your input"}
								style={{ resize: "none", direction: "ltr" }}
							></textarea>
						</div>

						<div className="d-flex flex-column justify-content-center align-items-center gap-3 py-3">
							{displayImageUrlData ? (
								<img
									src={displayImageUrlData}
									alt="service"
									className=" img-fluid shadow-sm rounded-5"
								/>
							) : (
								<input
									type="file"
									accept="image/*"
									className=" text-center btn btn-light shadow rounded-pill"
									onChange={handleDisplayImageUrlDataChange}
								/>
							)}
							<button
								className="btn btn-sm btn-warning shadow-sm rounded-pill"
								onClick={() => setDisplayImageUrlData(null)}
							>
								<span>
									{" "}
									{language === "fa"
										? "حذف عکس"
										: "Delete Picture"}
								</span>
							</button>
						</div>
					</div>

					<div className="col-12 col-lg-6">
						<h5 className="text-center">
							{language === "fa"
								? "اطلاعات صفحه سرویس"
								: "Service Page Data"}
						</h5>

						<div
							className={`py-3 text-${language === "fa" ? "end" : "start"}`}
							style={{
								direction: language === "fa" ? "rtl" : "ltr",
							}}
						>
							<label htmlFor="" className="py-2">
								{language === "fa"
									? "تیتر صفحه سرویس"
									: "Service Page Title (Farsi)"}
							</label>
							<input
								type="text"
								className={`form-control  text-end`}
								onChange={(e) =>
									handleChange(
										"pageTitle",
										preprocessNotes(e.target.value)
									)
								}
								placeholder={"متن خود را وارد کنید"}
								value={
									service?.pageTitle?.replace(
										/<br>/g,
										"\n"
									) || ""
								}
							/>
						</div>

						<div
							className={`py-3 text-${language === "fa" ? "end" : "start"}`}
							style={{
								direction: language === "fa" ? "rtl" : "ltr",
							}}
						>
							<label htmlFor="" className="py-2">
								{language === "fa"
									? "تیتر صفحه سرویس (انگلیسی)"
									: "Service Page Title (English)"}
							</label>
							<input
								type="text"
								className={`form-control text-start`}
								onChange={(e) =>
									handleChange(
										"pageTitleEN",
										preprocessNotes(e.target.value)
									)
								}
								placeholder={"Write your input"}
								value={
									service?.pageTitleEN?.replace(
										/<br>/g,
										"\n"
									) || ""
								}
							/>
						</div>

						<div
							className={`py-3 text-${language === "fa" ? "end" : "start"}`}
							style={{
								direction: language === "fa" ? "rtl" : "ltr",
							}}
						>
							<label htmlFor="" className="py-2">
								{language === "fa"
									? "توضیحات صفحه سرویس"
									: "Service Card Desctiption (Farsi)"}
							</label>
							<textarea
								className={`form-control text-end h-100`}
								onChange={(e) =>
									handleChange(
										"pageDescription",
										preprocessNotes(e.target.value)
									)
								}
								value={
									service?.pageDescription?.replace(
										/<br>/g,
										"\n"
									) || ""
								}
								rows={3}
								placeholder={"متن خود را وارد کنید"}
								style={{ resize: "none" }}
							></textarea>
						</div>

						<div
							className={`py-3 text-${language === "fa" ? "end" : "start"}`}
							style={{
								direction: language === "fa" ? "rtl" : "ltr",
							}}
						>
							<label htmlFor="" className="py-2">
								{language === "fa"
									? "توضیحات صفحه سرویس (انگلیسی)"
									: "Service Card Desctiption (English)"}
							</label>
							<textarea
								className={`form-control text-start h-100`}
								onChange={(e) =>
									handleChange(
										"pageDescriptionEN",
										preprocessNotes(e.target.value)
									)
								}
								value={
									service?.pageDescriptionEN?.replace(
										/<br>/g,
										"\n"
									) || ""
								}
								rows={3}
								placeholder={"Write your input"}
								style={{ resize: "none", direction: "ltr" }}
							></textarea>
						</div>

						<div className="d-flex flex-column justify-content-center align-items-center gap-3 py-3">
							{pageBannerUrlData ? (
								<img
									src={pageBannerUrlData}
									alt="service"
									className=" img-fluid shadow-sm rounded-5"
								/>
							) : (
								<input
									type="file"
									accept="image/*"
									className=" text-center btn btn-light shadow rounded-pill"
									onChange={handlePageBannerUrlDataChange}
								/>
							)}
							<button
								className="btn btn-sm btn-warning shadow-sm rounded-pill"
								onClick={() => setPageBannerUrlData(null)}
							>
								<span>
									{" "}
									{language === "fa"
										? "حذف عکس"
										: "Delete Picture"}
								</span>
							</button>
						</div>
					</div>
				</div>

				{/* Important Notes Section */}
				<div
					className="d-flex flex-row justify-content-between bg-white border border-2 shadow text-end rounded-5 p-3 p-md-4 mx-3 mx-md-4 mx-lg-5 mb-4"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<div
						className={`d-flex flex-column flex-grow-1 px-1 mx-1 text-${language === "fa" ? "end" : "start"}`}
					>
						<h5 className={``}>
							{language === "fa"
								? "نکات مهم سرویس"
								: "Service Important Notes"}
						</h5>

						<div className="d-flex flex-column my-2">
							<label htmlFor="" className="px-1 py-2">
								{language === "fa"
									? "نکات مهم سرویس"
									: "Service Important Notes (Farsi)"}
							</label>
							<textarea
								className={`form-control text-end h-100`}
								onChange={(e) =>
									handleChange(
										"importantNotes",
										preprocessNotes(e.target.value)
									)
								}
								value={
									service?.importantNotes?.replace(
										/<br>/g,
										"\n"
									) || ""
								}
								rows={3}
								placeholder={"متن خود را وارد کنید"}
								style={{ resize: "none" }}
							></textarea>
						</div>

						<div className="d-flex flex-column my-2">
							<label htmlFor="" className="px-1 py-2">
								{language === "fa"
									? "نکات مهم سرویس (انگلیسی)"
									: "Service Important Notes (English)"}
							</label>
							<textarea
								className={`form-control text-start h-100`}
								onChange={(e) =>
									handleChange(
										"importantNotesEN",
										preprocessNotes(e.target.value)
									)
								}
								value={
									service?.importantNotesEN?.replace(
										/<br>/g,
										"\n"
									) || ""
								}
								rows={3}
								placeholder={"Write your input"}
								style={{ resize: "none", direction: "ltr" }}
							></textarea>
						</div>
					</div>
				</div>

				{/* Service Pricing Section */}
				<div
					className="bg-white border border-2 shadow rounded-5 py-4 px-4 mx-3 mx-md-4 mx-lg-5 mb-4"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<h5 className={`px-1 mx-1`}>
						{language === "fa"
							? "قیمت گذاری سرویس"
							: "Service Pricing Section"}
					</h5>

					<div
						className={`d-flex flex-row justify-content-between align-items-center text-${language === "fa" ? "end" : "start"}`}
					>
						<div className="col-6 px-2 py-3">
							<label htmlFor="" className="py-2">
								{language === "fa"
									? "قیمت پایه سرویس"
									: "Service Base Price"}
							</label>
							<input
								type="text"
								className={`form-control text-${
									language === "fa" ? "end" : "start"
								}`}
								onChange={(e) =>
									handleChange("basePrice", e.target.value)
								}
								value={
									service?.basePrice !== undefined &&
									service?.basePrice !== null
										? service.basePrice
										: ""
								}
							/>
						</div>

						<div className="col-6 px-2 py-3 ">
							<label htmlFor="" className="py-2">
								{language === "fa"
									? "تخفیف سرویس"
									: "Service discount"}
							</label>
							<input
								type="text"
								className={`form-control text-${
									language === "fa" ? "end" : "start"
								}`}
								onChange={(e) =>
									handleChange("discount", e.target.value)
								}
								value={
									service?.discount !== undefined &&
									service?.discount !== null
										? service.discount
										: ""
								}
							/>
						</div>

						{/* <div className="col-4 px-2 py-3">
							<label htmlFor="" className="py-2">
								{language === "fa"
									? "شناسه طرح بیمه تحت پوشش"
									: "Supporting Insurance Id"}
							</label>
							<input
								type="text"
								className={`form-control  text-${
									language === "fa" ? "end" : "start"
								}`}
								onChange={(e) =>
									handleChange("insurancePlanId", e.target.value)
								}
								value={
									service?.insurancePlanId !== undefined &&
									service?.insurancePlanId !== null
										? service.insurancePlanId
										: ""
								}
							/>
						</div> */}
					</div>
				</div>

				{/* Form Builder Section */}
				<div
					className={`bg-white border border-2 shadow rounded-5 py-4 px-0 px-md-1 mx-3 mx-md-4 mx-lg-5 mb-4`}
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<h5 className="px-4 mx-1 pb-2">
						{language === "fa" ? "فرم سرویس" : "Service Form"}
					</h5>
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
