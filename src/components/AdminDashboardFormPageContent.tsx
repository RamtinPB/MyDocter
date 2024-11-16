import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";

interface formFieldsProps {
	id: number;
	name: string;
	type: string;
	required: boolean;
	enabled: boolean;

	group: string;
	groupEN: string;

	label: string;
	labelEN: string;
}

function AdminDashboardFormPageContent() {
	const { language } = useLanguage(); // Get language and toggle function from context
	const [dataUpdateFlag, setDataUpdateFlag] = useState(false);

	const [formFieldsData, setFormFieldsData] = useState<any[]>([]);
	const [formFieldsIEData, setFormFieldsIEData] = useState<any[]>([]);

	const [changedData, setChangedData] = useState<any[]>([]);
	const [changedDataIE, setChangedDataIE] = useState<any[]>([]);

	// fetch user information form fields
	useEffect(() => {
		axiosInstance
			.post("/api/User/GetUserInformationFormFields") // Call the API to get user data
			.then((response) => {
				const data = response.data;
				setFormFieldsIEData(data);
			})
			.catch((error) => {
				console.error(
					"API request for user data form fields failed, trying local db.json",
					error
				);

				// Fetch from local db.json if API fails
				fetch("/db.json")
					.then((response) => {
						if (!response.ok) {
							throw new Error(
								"Failed to fetch user data form fields from db.json"
							);
						}
						return response.json();
					})
					.then((data) => {
						// Update state for form fields
						setFormFieldsIEData(data.formFields);
					})
					.catch((jsonError) => {
						console.error(
							"Failed to fetch user data form fields from both API and db.json",
							jsonError
						);
					});
			});
	}, [dataUpdateFlag]);

	// Assuming that formData comes as a single structure from the API
	useEffect(() => {
		axiosInstance
			.post("/api/User/GetUserDataFormFields") // API call for form data and validation
			.then((response) => {
				const data = response.data;

				setFormFieldsData(data);

				//console.log(newFormFields);
				//console.log(newValidationSchemaData);
			})
			.catch((error) => {
				console.error("API request failed, trying local db.json", error);

				fetch("/db.json")
					.then((response) => response.json())
					.then((data) => {
						setFormFieldsData(data);
					})
					.catch((jsonError) => {
						console.error(
							"Failed to fetch data from both API and db.json",
							jsonError
						);
					});
			});
	}, [dataUpdateFlag]);

	const handleChange = (id: number, name: string, isIEData: boolean) => {
		const updateData = (data: any[]) => {
			return data.map((field) =>
				field.id === id && field.name === name
					? { ...field, required: !field.required }
					: field
			);
		};

		if (isIEData) {
			setFormFieldsIEData((prevData) => updateData(prevData));

			// Add or update the item in changedDataIE
			setChangedDataIE((prevChanged) => {
				const updatedField = {
					id,
					name,
					required: !formFieldsIEData.find((f) => f.id === id)?.required,
				};
				const exists = prevChanged.find((f) => f.id === id && f.name === name);
				return exists
					? prevChanged.map((f) =>
							f.id === id && f.name === name ? updatedField : f
					  )
					: [...prevChanged, updatedField];
			});
		} else {
			setFormFieldsData((prevData) => updateData(prevData));

			// Add or update the item in changedData
			setChangedData((prevChanged) => {
				const updatedField = {
					id,
					name,
					required: !formFieldsData.find((f) => f.id === id)?.required,
				};
				const exists = prevChanged.find((f) => f.id === id && f.name === name);
				return exists
					? prevChanged.map((f) =>
							f.id === id && f.name === name ? updatedField : f
					  )
					: [...prevChanged, updatedField];
			});
		}
	};

	const handleSubmit = async () => {
		const payload = {
			formFieldsData: changedData,
			formFieldsIEData: changedDataIE,
		};

		try {
			// Send the data to the API
			await axiosInstance.post("/api/Admin/UpdateFormFields", payload);
			console.log("Data submitted successfully");
		} catch (error) {
			console.error("Error submitting data:", error);
		}
		setDataUpdateFlag((prev) => !prev);
	};

	const handleCancel = () => {
		setDataUpdateFlag((prev) => !prev);
	};

	return (
		<div className="container custom-bg-4 shadow rounded-5 p-3 mb-4 mb-md-5">
			{/* User Information Form */}
			<div
				className={`d-flex flex-column bg-white shadow text-${
					language === "fa" ? "end" : "start"
				} rounded-5 m-3 m-md-4 m-lg-5`}
			>
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa" ? "فرم اطلاعات کاربر" : "User Information Form"}
					</h3>
				</div>
				<div
					className={`row row-cols-2 mt-1 mb-5`}
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					{formFieldsData.map((field, index) => {
						function handleChangeEnabled(): void {
							throw new Error("Function not implemented.");
						}

						return (
							<div key={index} className="col-6 d-flex flex-column py-2 px-5">
								<div className="d-flex ">
									<input
										type="checkbox"
										checked={field.required}
										onChange={() => handleChange(field.id, field.name, false)}
										className="form-check-input shadow-sm mx-2"
									/>
									<label htmlFor={field.name} className="form-label">
										{language === "fa" ? field.label : field.labelEN}
									</label>
								</div>

								<div className="d-flex">
									<input
										type="checkbox"
										checked={field.required}
										onChange={() => handleChangeEnabled()}
										className="form-check-input shadow-sm mx-2"
									/>
									<label htmlFor={field.name} className="form-label">
										(فعال / غیر فعال)
									</label>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Initial Evaluation Form */}
			<div
				className={`d-flex flex-column bg-white shadow text-${
					language === "fa" ? "end" : "start"
				} rounded-5 m-3 m-md-4 m-lg-5`}
			>
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa"
							? "فرم ارزیابی اولیه کاربر"
							: "Initial Evaluation Form"}
					</h3>
				</div>
				{Array.from(new Set(formFieldsIEData.map((field) => field.group))).map(
					(group, index) => {
						const sampleField = formFieldsIEData.find(
							(field) => field.group === group
						);
						return (
							!(
								sampleField.group === undefined || sampleField.group === null
							) && (
								<div key={index}>
									<h4 className="text-center pt-4">
										{language === "fa"
											? sampleField.group
											: sampleField.groupEN}
									</h4>
									<hr className=" rounded-pill mx-4 my-2" />
									<div
										className={`row row-cols-2 mt-4 mb-5`}
										style={{ direction: language === "fa" ? "rtl" : "ltr" }}
									>
										{formFieldsIEData
											.filter((field) => field.group === group)
											.map((field: formFieldsProps, index: number) => {
												if (field.type === "placeholder") return null;
												if (field.type === "checkmenu") return null;
												if (field.name === "age") return null;
												if (field.name === "") return null;
												return (
													<div key={index} className="col-6 py-2 px-5">
														<input
															type="checkbox"
															checked={field.required}
															onChange={() =>
																handleChange(field.id, field.name, true)
															}
															className="form-check-input shadow-sm mx-2"
														/>
														<label
															htmlFor={field.name}
															className="form-label"
															style={{
																direction: language === "fa" ? "ltr" : "rtl",
															}}
														>
															{language === "fa" ? field.label : field.labelEN}
														</label>
													</div>
												);
											})}
									</div>
								</div>
							)
						);
					}
				)}
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
	);
}

export default AdminDashboardFormPageContent;
