import { useEffect, useState } from "react";
import "/src/cssFiles/adminbuttons.css";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";

interface insuranceDataProps {
	id: number;
	companyName: string;
	companyNameEN: string;
	type: number;
	discountPercentage: string;
}

function AdminDashboardInsurancePageContent() {
	const [dataUpdateFlag, setDataUpdateFlag] = useState(false);
	const { language } = useLanguage(); // Get language and toggle function from context

	// Define the state for Basic Insurance Items
	const [insuranceData, setInsuranceData] = useState<insuranceDataProps[]>([]);

	useEffect(() => {
		const fetchInsurances = async () => {
			try {
				const response = await axiosInstance.post("/api/Admin/GetInsurances", {
					serviceType: null,
				});
				if (response.status !== 200) {
					throw new Error("Failed to fetch data from API");
				}

				setInsuranceData(response.data);
			} catch (err) {
				console.error("Failed to fetch services", err);
			}
		};

		fetchInsurances();
	}, [dataUpdateFlag]);

	// Add a new item to the Basic Insurance table
	const addBasicInsurance = async (type: 0 | 1) => {
		const newInsurance = {
			companyName: "",
			companyNameEN: "",
			type: type,
			discountPercentage: 0,
		};
		try {
			await axiosInstance.post("/api/Admin/AddInsurance", newInsurance);
		} catch (error) {
			console.log("Failed to add insurance", error);
		}
		setDataUpdateFlag((prev) => !prev);
	};

	// Remove a specific item from the Basic Insurance table
	const removeInsurance = async (insuranceToRemoveId: number) => {
		try {
			await axiosInstance.post("/api/Admin/RemoveInsurance", {
				id: insuranceToRemoveId,
			});
		} catch (error) {
			console.error("Failed to insurance", error);
		}
		setDataUpdateFlag((prev) => !prev);
	};

	// Handle change in the input fields for Basic Insurance
	const handleInsuranceDataChange = (
		id: number,
		field: "companyName" | "companyNameEN" | "discountPercentage",
		value: string
	) => {
		const updatedItems = insuranceData.map((item) =>
			item.id === id ? { ...item, [field]: value } : item
		);
		setInsuranceData(updatedItems);
	};

	// @ts-ignore
	const handleSubmit = async () => {
		try {
			// Send the data to the API
			await axiosInstance.post("/api/Admin/UpdateInsurances", insuranceData);
			console.log("Data submitted successfully");
		} catch (error) {
			console.error("Error submitting data:", error);
		}
		setDataUpdateFlag((prev) => !prev);
	};

	// @ts-ignore
	const handleCancel = () => {
		setDataUpdateFlag((prev) => !prev);
	};

	const renderInsuranceTables = (type: 0 | 1) => {
		return (
			<tbody>
				{insuranceData
					.filter((item) => item.type === type)
					.map((item) => (
						<tr key={item.id}>
							<th scope="row" className="align-middle">
								<span className="px-1">{item.id}</span>
							</th>
							<td className="align-middle">
								<input
									type="text"
									className="form-control"
									value={item.companyName || ""}
									onChange={(e) =>
										handleInsuranceDataChange(
											item.id,
											"companyName",
											e.target.value
										)
									}
									placeholder={
										language === "fa" ? "نام بیمه" : "Insurance name Farsi"
									}
								/>
							</td>
							<td className="align-middle">
								<input
									type="text"
									className="form-control"
									value={item.companyNameEN || ""}
									onChange={(e) =>
										handleInsuranceDataChange(
											item.id,
											"companyNameEN",
											e.target.value
										)
									}
									placeholder={
										language === "fa"
											? "نام بیمه (انگلیسی)"
											: "Insurance name English"
									}
								/>
							</td>
							<td className="align-middle">
								<input
									type="text"
									className="form-control"
									value={item.discountPercentage || ""}
									onChange={(e) =>
										handleInsuranceDataChange(
											item.id,
											"discountPercentage",
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
									onClick={() => removeInsurance(item.id)}
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
					<td colSpan={5} className="align-middle ">
						{/* Add Button for new rows */}
						<div
							id="btn-add"
							className="d-flex justify-content-center align-items-center "
						>
							<button
								className="rounded-circle btn p-0 m-1"
								type="button"
								onClick={() => addBasicInsurance(type)}
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
		);
	};

	return (
		<div className="container custom-bg-4 shadow rounded-5 p-3 mb-4 mb-md-5">
			<div className="d-flex flex-column bg-white shadow text-end rounded-5 m-3 m-md-4 m-lg-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa" ? "بیمه پایه" : "Basic Insurances"}
					</h3>
				</div>
				<table
					className="table table-hover text-center mb-5"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<thead>
						<tr>
							<th scope="col">
								{language === "fa" ? "شناسه" : "Insurance id"}
							</th>
							<th scope="col">
								{language === "fa" ? "نام بیمه" : "Insurance name Farsi"}
							</th>
							<th scope="col">
								{language === "fa"
									? "نام بیمه (انگلیسی)"
									: "Insurance name English"}
							</th>
							<th scope="col">
								{language === "fa"
									? "درصد سهم بیمه"
									: "Insurance Contribution percentage"}
							</th>
							<th scope="col">{language === "fa" ? "حذف" : "Delete"}</th>
						</tr>
					</thead>
					{renderInsuranceTables(0)}
				</table>
			</div>

			<div className="d-flex flex-column bg-white shadow text-end rounded-5 m-3 m-md-4 m-lg-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa" ? "بیمه تکمیلی" : "Supplementary  Insurances"}
					</h3>
				</div>
				<table
					className="table table-hover text-center mb-5"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<thead>
						<tr>
							<th scope="col">
								{language === "fa" ? "شناسه" : "Insurance id"}
							</th>
							<th scope="col">
								{language === "fa" ? "نام بیمه" : "Insurance name"}
							</th>
							<th scope="col">
								{language === "fa"
									? "نام بیمه (انگلیسی)"
									: "Insurance name English"}
							</th>
							<th scope="col">
								{language === "fa"
									? "درصد سهم بیمه"
									: "Insurance Contribution percentage"}
							</th>
							<th scope="col">{language === "fa" ? "حذف" : "Delete"}</th>
						</tr>
					</thead>
					{renderInsuranceTables(1)}
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
					{language === "fa" ? "ذخیره تغییرات" : "Save Changes"}
				</button>
			</div>
		</div>
	);
}

export default AdminDashboardInsurancePageContent;
