import { useState } from "react";
import "/src/cssFiles/adminbuttons.css";
import { useLanguage } from "./LanguageContext";

function AdminDashboardInsurancePageContent() {
	const { language } = useLanguage(); // Get language and toggle function from context

	// Define the state for Basic Insurance sections
	const [basicInsuranceSections, setBasicInsuranceSections] = useState<
		{ input1: string; input2: string }[]
	>([]);

	// Define the state for Supplementary Insurance sections
	const [supplementaryInsuranceSections, setSupplementaryInsuranceSections] =
		useState<{ input1: string; input2: string }[]>([]);

	// Add a new section to the Basic Insurance table
	const addBasicInsuranceSection = () => {
		setBasicInsuranceSections([
			...basicInsuranceSections,
			{ input1: "", input2: "" },
		]);
	};

	// Add a new section to the Supplementary Insurance table
	const addSupplementaryInsuranceSection = () => {
		setSupplementaryInsuranceSections([
			...supplementaryInsuranceSections,
			{ input1: "", input2: "" },
		]);
	};

	// Remove a specific section from the Basic Insurance table
	const removeBasicInsuranceSection = (indexToRemove: number) => {
		const newSections = basicInsuranceSections.filter(
			(_, index) => index !== indexToRemove
		);
		setBasicInsuranceSections(newSections);
	};

	// Remove a specific section from the Supplementary Insurance table
	const removeSupplementaryInsuranceSection = (indexToRemove: number) => {
		const newSections = supplementaryInsuranceSections.filter(
			(_, index) => index !== indexToRemove
		);
		setSupplementaryInsuranceSections(newSections);
	};

	// Handle change in the input fields for Basic Insurance
	const handleBasicInsuranceChange = (
		index: number,
		field: "input1" | "input2",
		value: string
	) => {
		const updatedSections = [...basicInsuranceSections];
		updatedSections[index][field] = value;
		setBasicInsuranceSections(updatedSections);
	};

	// Handle change in the input fields for Supplementary Insurance
	const handleSupplementaryInsuranceChange = (
		index: number,
		field: "input1" | "input2",
		value: string
	) => {
		const updatedSections = [...supplementaryInsuranceSections];
		updatedSections[index][field] = value;
		setSupplementaryInsuranceSections(updatedSections);
	};

	// @ts-ignore
	const handleSubmit = () => {};

	// @ts-ignore
	const handleCancel = () => {};

	return (
		<div className="container custom-bg-4 shadow rounded-5 p-3 mb-4 mb-md-5">
			{/* Basic Insurance */}
			<div className="d-flex flex-column bg-white shadow text-end rounded-5 m-3 m-md-4 m-lg-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa" ? "بیمه پایه" : "Basic Insurance"}
					</h3>
				</div>
				<table
					className="table table-hover text-center mb-5"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">
								{language === "fa" ? "نام بیمه" : "Insurance name"}
							</th>
							<th scope="col">
								{language === "fa"
									? "درصد سهم بیمه"
									: "Insurance Contribution percentage"}
							</th>
							<th scope="col">{language === "fa" ? "حذف" : "Delete"}</th>
						</tr>
					</thead>
					<tbody>
						{basicInsuranceSections.map((section, index) => (
							<tr key={index}>
								<th scope="row" className="align-middle">
									<span className="px-1">{index + 1}</span>
								</th>
								<td className="align-middle">
									<input
										type="text"
										className="form-control"
										value={section.input1}
										onChange={(e) =>
											handleBasicInsuranceChange(
												index,
												"input1",
												e.target.value
											)
										}
										placeholder={
											language === "fa" ? "نام بیمه" : "Insurance name"
										}
									/>
								</td>
								<td className="align-middle">
									<input
										type="text"
										className="form-control"
										value={section.input2}
										onChange={(e) =>
											handleBasicInsuranceChange(
												index,
												"input2",
												e.target.value
											)
										}
										placeholder={
											language === "fa"
												? "درصد سهم بیمه"
												: "Contribution percentage"
										}
									/>
								</td>
								<td className="align-middle">
									<button
										id="btn-delete"
										className="rounded-circle btn p-0 m-1 m-md-3"
										type="button"
										onClick={() => removeBasicInsuranceSection(index)}
									>
										<img
											src="\images\red-delete.png"
											className="custom-admin-btn rounded-circle"
										/>
									</button>
								</td>
							</tr>
						))}
						<tr>
							<td colSpan={4} className="align-middle ">
								{/* Add Button for new rows */}
								<div
									id="btn-add"
									className="d-flex justify-content-center align-items-center "
								>
									<button
										className="rounded-circle btn p-0 m-1"
										type="button"
										onClick={addBasicInsuranceSection}
									>
										<img
											src="\images\green-add.png"
											className="custom-admin-btn rounded-circle"
										/>
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* Supplementary Insurance */}
			<div className="d-flex flex-column bg-white shadow text-end rounded-5 m-3 m-md-4 m-lg-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa" ? "بیمه تکمیلی" : "Supplementary  Insurance"}
					</h3>
				</div>
				<table
					className="table table-hover text-center mb-5"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">
								{language === "fa" ? "نام بیمه" : "Insurance name"}
							</th>
							<th scope="col">
								{language === "fa"
									? "درصد سهم بیمه"
									: "Insurance Contribution percentage"}
							</th>
							<th scope="col">{language === "fa" ? "حذف" : "Delete"}</th>
						</tr>
					</thead>
					<tbody>
						{supplementaryInsuranceSections.map((section, index) => (
							<tr key={index}>
								<th scope="row" className="align-middle ">
									<span className="px-1">{index + 1}</span>
								</th>
								<td className="align-middle">
									<input
										type="text"
										className="form-control"
										value={section.input1}
										onChange={(e) =>
											handleSupplementaryInsuranceChange(
												index,
												"input1",
												e.target.value
											)
										}
										placeholder={
											language === "fa" ? "نام بیمه" : "Insurance name"
										}
									/>
								</td>
								<td className="align-middle">
									<input
										type="text"
										className="form-control"
										value={section.input2}
										onChange={(e) =>
											handleSupplementaryInsuranceChange(
												index,
												"input2",
												e.target.value
											)
										}
										placeholder={
											language === "fa"
												? "درصد سهم بیمه"
												: "Contribution percentage"
										}
									/>
								</td>
								<td className="align-middle">
									<button
										id="btn-delete"
										className="rounded-circle btn p-0 m-1 m-md-3"
										type="button"
										onClick={() => removeSupplementaryInsuranceSection(index)}
									>
										<img
											src="\images\red-delete.png"
											className="custom-admin-btn rounded-circle"
										/>
									</button>
								</td>
							</tr>
						))}
						<tr>
							<td colSpan={4} className="align-middle ">
								{/* Add Button for new rows */}
								<div
									id="btn-add"
									className="d-flex justify-content-center align-items-center "
								>
									<button
										className="rounded-circle btn p-0 m-1"
										type="button"
										onClick={addSupplementaryInsuranceSection}
									>
										<img
											src="\images\green-add.png"
											className="custom-admin-btn rounded-circle"
										/>
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* Submit and Cancel buttons */}
			<div className="d-flex justify-content-evenly px-3 py-2 my-2 ">
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
					{language === "fa" ? "ذخیره تغیرات" : "Save Changes"}
				</button>
			</div>
		</div>
	);
}

export default AdminDashboardInsurancePageContent;
