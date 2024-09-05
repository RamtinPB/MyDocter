import { useLanguage } from "./LanguageContext";

function AdminDashboardMainPageContent() {
	const { language } = useLanguage(); // Get language and toggle function from context

	// @ts-ignore
	const handleChange = () => {};

	// @ts-ignore
	const handleSubmit = () => {};

	// @ts-ignore
	const handleCancel = () => {};

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
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa" ? "شعار سایت" : "Opening quote title (Farsi)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
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
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						onChange={handleChange}
					></textarea>
				</div>
				{/* english */}
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
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
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
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
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
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
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
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
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
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
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						onChange={handleChange}
					></textarea>
				</div>
				{/* english */}
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
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
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
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
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						onChange={handleChange}
					></textarea>
				</div>
			</div>
			{/* [Doc section] */}
			<div className="d-flex flex-column bg-white shadow text-end rounded-5  m-3 m-md-4 m-lg-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa" ? "قسمت میانه" : "MIddle Section"}
					</h3>
				</div>
				{/* farsi */}
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa" ? "سر تیتر" : "Main title (Farsi)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa" ? "متن اصلی" : "Main Description (Farsi)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						onChange={handleChange}
					></textarea>
				</div>
				{/* english */}
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
					<h4
						className={`text-${language === "fa" ? "end" : "start"} px-1 mx-1`}
					>
						{language === "fa" ? "(انگلیسی) سر تیتر" : "Main title (Egnlish)"}
					</h4>
					<textarea
						className={`form-control text-${
							language === "fa" ? "end" : "start"
						} border border-1 shadow-sm rounded-4 py-2 my-1`}
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
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
						rows={3}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
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
					{language === "fa" ? "ذخیره" : "Save Changes"}
				</button>
			</div>
		</div>
	);
}

export default AdminDashboardMainPageContent;
