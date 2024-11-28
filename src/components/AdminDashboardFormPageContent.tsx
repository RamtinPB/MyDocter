import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";

interface payloadProps {
	formFieldId: number;
	required: boolean;
	enabled: boolean;
}

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

	const [formFieldsData, setFormFieldsData] = useState<formFieldsProps[]>([]);
	const [formFieldsIEData, setFormFieldsIEData] = useState<formFieldsProps[]>(
		[]
	);

	const [changedData, setChangedData] = useState<payloadProps[]>([]);
	const [changedDataIE, setChangedDataIE] = useState<payloadProps[]>([]);

	// fetch user information form fields
	useEffect(() => {
		axiosInstance
			.post("/api/Admin/GetUserInformationFormFields") // Call the API to get user data
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
			.post("/api/Admin/GetUserDataFormFields") // API call for form data and validation
			.then((response) => {
				const data = response.data;

				setFormFieldsData(data);
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

	useEffect(() => {
		setChangedData([]);
		setChangedDataIE([]);
	}, [dataUpdateFlag]);

	// Handle changes to the "required" checkbox
	const handleRequiredChange = (
		formFieldId: number,
		isIEData: boolean,
		newValue: boolean
	) => {
		const updateData = (data: formFieldsProps[]) =>
			data.map((field) =>
				field.id === formFieldId ? { ...field, required: newValue } : field
			);

		if (isIEData) {
			// Update the IE form fields state
			setFormFieldsIEData((prevData) => updateData(prevData));

			// Update the changedDataIE
			setChangedDataIE((prevChanged) => {
				const updatedField: payloadProps = {
					formFieldId,
					required: newValue,
					enabled:
						formFieldsIEData.find((f) => f.id === formFieldId)?.enabled ??
						false,
				};

				const exists = prevChanged.find((f) => f.formFieldId === formFieldId);
				return exists
					? prevChanged.map((f) =>
							f.formFieldId === formFieldId ? updatedField : f
					  )
					: [...prevChanged, updatedField];
			});
		} else {
			// Update the form fields state
			setFormFieldsData((prevData) => updateData(prevData));

			// Update the changedData
			setChangedData((prevChanged) => {
				const updatedField: payloadProps = {
					formFieldId,
					required: newValue,
					enabled:
						formFieldsData.find((f) => f.id === formFieldId)?.enabled ?? false,
				};

				const exists = prevChanged.find((f) => f.formFieldId === formFieldId);
				return exists
					? prevChanged.map((f) =>
							f.formFieldId === formFieldId ? updatedField : f
					  )
					: [...prevChanged, updatedField];
			});
		}
	};

	// Handle changes to the "enabled" checkbox
	const handleEnabledChange = (
		formFieldId: number,
		isIEData: boolean,
		newValue: boolean
	) => {
		const updateData = (data: formFieldsProps[]) =>
			data.map((field) =>
				field.id === formFieldId ? { ...field, enabled: newValue } : field
			);

		if (isIEData) {
			// Update the IE form fields state
			setFormFieldsIEData((prevData) => updateData(prevData));

			// Update the changedDataIE
			setChangedDataIE((prevChanged) => {
				const updatedField: payloadProps = {
					formFieldId,
					required:
						formFieldsIEData.find((f) => f.id === formFieldId)?.required ??
						false,
					enabled: newValue,
				};

				const exists = prevChanged.find((f) => f.formFieldId === formFieldId);
				return exists
					? prevChanged.map((f) =>
							f.formFieldId === formFieldId ? updatedField : f
					  )
					: [...prevChanged, updatedField];
			});
		} else {
			// Update the form fields state
			setFormFieldsData((prevData) => updateData(prevData));

			// Update the changedData
			setChangedData((prevChanged) => {
				const updatedField: payloadProps = {
					formFieldId,
					required:
						formFieldsData.find((f) => f.id === formFieldId)?.required ?? false,
					enabled: newValue,
				};

				const exists = prevChanged.find((f) => f.formFieldId === formFieldId);
				return exists
					? prevChanged.map((f) =>
							f.formFieldId === formFieldId ? updatedField : f
					  )
					: [...prevChanged, updatedField];
			});
		}
	};

	const handleSubmit = async () => {
		if (changedData.length !== 0) {
			try {
				// Send the data to the API
				await axiosInstance.post(
					"/api/Admin/UpdateUserDataFormFields",
					changedData
				);
				console.log("user data form fields data submitted successfully");
				alert(
					language === "fa"
						? "بروزرسانی تنظیمات صفحه اطلاعات کاربر موفق بود"
						: "user information form fields data updated"
				);
			} catch (error) {
				console.error("Error submitting user data form fields data:", error);
				alert(
					language === "fa"
						? "بروزرسانی تنظیمات صفحه اطلاعات کاربر ناموفق بود"
						: "user information form fields data update failed"
				);
			}
		}
		if (changedDataIE.length !== 0) {
			try {
				// Send the data to the API
				await axiosInstance.post(
					"/api/Admin/UpdateUserInformationFormFields",
					changedDataIE
				);
				console.log("user information form fields data submitted successfully");
				alert(
					language === "fa"
						? "بروزرسانی تنظیمات صفحه اطلاعات ارزیابی اولیه کاربر موفق بود"
						: "user initial evaluation form fields data updated"
				);
			} catch (error) {
				console.error(
					"Error submitting user information form fields data:",
					error
				);
				alert(
					language === "fa"
						? "بروزرسانی تنظیمات صفحه اطلاعات ارزیابی اولیه کاربر ناموفق بود"
						: "user initial evaluation form fields data update failed"
				);
			}
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
						return (
							<div key={index} className="col-6 d-flex flex-column py-3 px-5">
								<h6
									className="px-2 "
									style={{
										direction: language === "fa" ? "ltr" : "rtl",
									}}
								>
									{language === "fa" ? field.label : field.labelEN}
								</h6>
								<div className="d-flex ">
									<input
										type="checkbox"
										checked={field.required}
										onChange={(e) =>
											handleRequiredChange(field.id, false, e.target.checked)
										}
										className="form-check-input shadow-sm mx-2"
									/>
									<label htmlFor={field.name} className="form-label">
										{language === "fa"
											? "(الزامی / غیر الزامی)"
											: "Required / Not Required"}
									</label>
								</div>
								<div className="d-flex">
									<input
										type="checkbox"
										checked={field.enabled}
										onChange={(e) =>
											handleEnabledChange(field.id, false, e.target.checked)
										}
										className="form-check-input shadow-sm mx-2"
									/>
									<label htmlFor={field.name} className="form-label">
										{language === "fa"
											? "(فعال / غیر فعال)"
											: "Enabled / Not Enabled"}
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
							sampleField &&
							sampleField.group && (
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
													<div key={index} className="col-6 py-3 px-5">
														<h6
															className="px-2 "
															style={{
																direction: language === "fa" ? "ltr" : "rtl",
															}}
														>
															{language === "fa" ? field.label : field.labelEN}
														</h6>
														<input
															type="checkbox"
															checked={field.required}
															onChange={(e) =>
																handleRequiredChange(
																	field.id,
																	true,
																	e.target.checked
																)
															}
															className="form-check-input shadow-sm mx-2"
														/>
														<label htmlFor={field.name} className="form-label">
															{language === "fa"
																? "(الزامی / غیر الزامی)"
																: "Required / Not Required"}
														</label>
														<div className="d-flex">
															<input
																type="checkbox"
																checked={field.enabled}
																onChange={(e) =>
																	handleEnabledChange(
																		field.id,
																		true,
																		e.target.checked
																	)
																}
																className="form-check-input shadow-sm mx-2"
															/>
															<label
																htmlFor={field.name}
																className="form-label"
															>
																{language === "fa"
																	? "(فعال / غیر فعال)"
																	: "Enabled / Not Enabled"}
															</label>
														</div>
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
