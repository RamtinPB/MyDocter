function AdminDashboardMainPageContent() {
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
					<h3 className="text-center text-white m-0">{"قسمت بنر"}</h3>
				</div>
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
					<h4 className="pe-1 me-1">{"شعار سایت"}</h4>
					<textarea
						className="form-control text-end border border-1 shadow-sm rounded-4 py-2 my-1"
						rows={3}
						placeholder="متن خود را وارد کنید"
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
					<h4 className="pe-1 me-1">{"متن کوتاه بعد از شعار سایت"}</h4>
					<textarea
						className="form-control text-end border border-1 shadow-sm rounded-4 py-2 my-1"
						rows={3}
						placeholder="متن خود را وارد کنید"
						onChange={handleChange}
					></textarea>
				</div>
			</div>
			{/* [services section] */}
			<div className="d-flex flex-column bg-white shadow text-end rounded-5  m-3 m-md-4 m-lg-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">{"قسمت خدمات"}</h3>
				</div>
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
					<h4 className="pe-1 me-1">
						{"متن توضیح خدمات پزشک متخصص و فوق تخصص"}
					</h4>
					<textarea
						className="form-control text-end border border-1 shadow-sm rounded-4 py-2 my-1"
						rows={3}
						placeholder="متن خود را وارد کنید"
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
					<h4 className="pe-1 me-1">{"متن توضیح خدمات پزشک عمومی"}</h4>
					<textarea
						className="form-control text-end border border-1 shadow-sm rounded-4 py-2 my-1"
						rows={3}
						placeholder="متن خود را وارد کنید"
						onChange={handleChange}
					></textarea>
				</div>
			</div>
			{/* [Doc section] */}
			<div className="d-flex flex-column bg-white shadow text-end rounded-5  m-3 m-md-4 m-lg-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">{"قسمت میانه"}</h3>
				</div>
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
					<h4 className="pe-1 me-1">{"سر تیتر"}</h4>
					<textarea
						className="form-control text-end border border-1 shadow-sm rounded-4 py-2 my-1"
						rows={3}
						placeholder="متن خود را وارد کنید"
						onChange={handleChange}
					></textarea>
				</div>
				<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
					<h4 className="pe-1 me-1">{"متن اصلی"}</h4>
					<textarea
						className="form-control text-end border border-1 shadow-sm rounded-4 py-2 my-1"
						rows={3}
						placeholder="متن خود را وارد کنید"
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
					{"حذف"}
				</button>
				<button
					className="btn btn-success rounded-pill px-3"
					onClick={handleSubmit}
				>
					{"ذخیره"}
				</button>
			</div>
		</div>
	);
}

export default AdminDashboardMainPageContent;
