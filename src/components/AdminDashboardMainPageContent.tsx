import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";

interface homePageDataProps {
	openingQuoteTitle: string;
	openingQuoteDescription: string;
	openingQuoteTitleEN: string;
	openingQuoteDescriptionEN: string;
	/////////////////////////////////////////
	servicesLeftCardTitle: string;
	servicesLeftCardDescription: string;
	servicesLeftCardImage: string;
	/////////////////////////////////////////
	servicesLeftCardTitleEN: string;
	servicesLeftCardDescriptionEN: string;
	/////////////////////////////////////////
	servicesRightCardTitle: string;
	servicesRightCardDescription: string;
	servicesRightCardImage: string;
	/////////////////////////////////////////
	servicesRightCardTitleEN: string;
	servicesRightCardDescriptionEN: string;
	/////////////////////////////////////////
	docTitle: string;
	docImage: string;
	docImageEN: string;
	docDescription: string;
	/////////////////////////////////////////
	docTitleEN: string;
	docDescriptionEN: string;
}

function AdminDashboardMainPageContent() {
	const { language } = useLanguage(); // Get language and toggle function from context

	const [homePageData, setHomePageData] = useState<homePageDataProps | null>(
		null
	);

	//const [initialHomePageData, setInitialHomePageData] =
	// 	useState<homePageDataProps | null>(null);

	const [dataUpdateFlag, setDataUpdateFlag] = useState(false);

	useEffect(() => {
		const fetchHomeTextData = async () => {
			try {
				// Attempt to fetch from the API
				const response = await axiosInstance.post("/api/Pages/GetHomePageData");
				if (response.status !== 200) {
					throw new Error("Failed to fetch data from API");
				}

				setHomePageData(response.data);
				//setInitialHomePageData(response.data);
			} catch (err) {
				console.error("API request failed, trying local db.json", err);

				// Fallback to fetching from db.json if API request fails
				try {
					const response = await fetch("/db.json"); // Adjust the path to your static JSON file
					if (!response.ok) {
						throw new Error("Failed to fetch data from db.json");
					}

					const data = await response.json();
					setHomePageData(data.homeTextData[0]);
					//setInitialHomePageData(data.homeTextData[0]);
				} catch (jsonErr) {
					console.error(
						"Failed to fetch data from both API and db.json",
						jsonErr
					);
				}
			}
		};

		fetchHomeTextData();
	}, [dataUpdateFlag]);

	const handleSubmit = async () => {
		const alteredHomePageData = JSON.stringify(homePageData);
		try {
			const response = await axiosInstance.post(
				"/api/Admin/UpdateHomePageData",
				alteredHomePageData,
				{
					headers: {
						"Content-Type": "text/json", // Set header to JSON
					},
				}
			);

			if (response.status === 200) {
				console.log("Updated Data to Send:", homePageData);
			}
		} catch (error) {
			console.log("Failed to update home page data", error);
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		setHomePageData((prevData) => ({
			...prevData!,
			[name]: value,
		}));
	};

	const handleCancel = () => {
		setDataUpdateFlag((prev) => !prev);
	};

	return (
		<div className="container custom-bg-4 shadow rounded-5 p-3 mb-4 mb-md-5">
			{/* {banner section} */}
			<div className="d-flex flex-column bg-white shadow text-end rounded-5  m-3 m-md-4 m-lg-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa" ? "قسمت بنر" : "Banner Section"}
					</h3>
				</div>
				{/* farsi */}
				<div className="d-flex flex-column px-3 m-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa" ? "شعار سایت" : "Opening quote title (Farsi)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						rows={2}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						name="openingQuoteTitle" // Name attribute for corresponding data in homePageData
						value={homePageData?.openingQuoteTitle || ""} // Set value to corresponding homePageData property
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 m-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa"
							? "متن کوتاه بعد از شعار سایت"
							: "Opening quote description (Farsi)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						rows={2}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						name="openingQuoteDescription"
						value={homePageData?.openingQuoteDescription || ""}
						onChange={handleChange}
					></textarea>
				</div>
				{/* english */}
				<div className="d-flex flex-column px-3 m-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa"
							? "(انگلیسی) شعار سایت"
							: "Opening quote title (English)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						rows={2}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						name="openingQuoteTitleEN"
						value={homePageData?.openingQuoteTitleEN || ""}
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 m-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa"
							? "(انگلیسی) متن کوتاه بعد از شعار سایت"
							: "Opening quote description (English)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						rows={2}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						name="openingQuoteDescriptionEN"
						value={homePageData?.openingQuoteDescriptionEN || ""}
						onChange={handleChange}
					></textarea>
				</div>
			</div>
			{/* [services section] */}
			<div className="d-flex flex-column bg-white shadow text-end rounded-5  m-3 m-md-4 m-lg-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa" ? "قسمت خدمات" : "Services Section"}
					</h3>
				</div>
				{/* farsi */}
				<div className="d-flex flex-column px-3 m-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa"
							? "متن توضیح خدمات پزشک متخصص و فوق تخصص"
							: "Specialist services card description (Farsi)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						rows={2}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						name="servicesLeftCardDescription"
						value={homePageData?.servicesLeftCardDescription || ""}
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 m-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa"
							? "متن توضیح خدمات پزشک عمومی"
							: "General services card description (Farsi)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						rows={2}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						name="servicesRightCardDescription"
						value={homePageData?.servicesRightCardDescription || ""}
						onChange={handleChange}
					></textarea>
				</div>
				{/* english */}
				<div className="d-flex flex-column px-3 m-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa"
							? "(انگلیسی) متن توضیح خدمات پزشک متخصص و فوق تخصص"
							: "Specialist services card description (English)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						rows={2}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						name="servicesLeftCardDescriptionEN"
						value={homePageData?.servicesLeftCardDescriptionEN || ""}
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 m-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa"
							? "(انگلیسی) متن توضیح خدمات پزشک عمومی"
							: "General services card description (English)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						rows={2}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						name="servicesRightCardDescriptionEN"
						value={homePageData?.servicesRightCardDescriptionEN || ""}
						onChange={handleChange}
					></textarea>
				</div>
			</div>
			{/* [Doc section] */}
			<div className="d-flex flex-column bg-white shadow text-end rounded-5  m-3 m-md-4 m-lg-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa" ? "قسمت میانه" : "Middle Section"}
					</h3>
				</div>
				{/* farsi */}
				<div className="d-flex flex-column px-3 m-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa" ? "سر تیتر" : "Main title (Farsi)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						rows={2}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						name="docTitle"
						value={homePageData?.docTitle || ""}
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 m-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa" ? "متن اصلی" : "Main Description (Farsi)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						rows={2}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						name="docDescription"
						value={homePageData?.docDescription || ""}
						onChange={handleChange}
					></textarea>
				</div>
				{/* english */}
				<div className="d-flex flex-column px-3 m-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa" ? "(انگلیسی) سر تیتر" : "Main title (Egnlish)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						rows={2}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						name="docTitleEN"
						value={homePageData?.docTitleEN || ""}
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 m-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa"
							? "(انگلیسی) متن اصلی"
							: "Main Description (English)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						rows={2}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						name="docDescriptionEN"
						value={homePageData?.docDescriptionEN || ""}
						onChange={handleChange}
					></textarea>
				</div>
			</div>
			{/* Submit and Cancel buttons */}
			<div className="d-flex justify-content-evenly px-3 py-2 my-2">
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
	);
}

export default AdminDashboardMainPageContent;
