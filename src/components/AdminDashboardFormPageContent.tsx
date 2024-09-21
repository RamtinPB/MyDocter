import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";

function AdminDashboardFormPageContent() {
	const { language } = useLanguage(); // Get language and toggle function from context

	const [formFields, setFormFields] = useState<any[]>([]);
	const [formSections, setFormSections] = useState<{ [key: string]: any[] }>(
		{}
	);

	const [initialFormFields, setInitialFormFields] = useState<any[]>([]);
	const [initialFormSections, setInitialFormSections] = useState<{
		[key: string]: any[];
	}>({});

	useEffect(() => {
		fetch("/db.json")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				// Update state for form fields
				setFormFields(data.formFields);

				const sections = data.formFieldsIE[0]; // Adjust based on structure
				setFormSections(sections);

				// Set initial state for revert on cancel
				setInitialFormFields(JSON.parse(JSON.stringify(data.formFields))); // Deep copy
				setInitialFormSections(
					JSON.parse(JSON.stringify(data.formFieldsIE[0]))
				); // Deep copy
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	// @ts-ignore
	const handleChange = () => {};

	// @ts-ignore
	const handleSubmit = () => {
		// Collect and prepare data to be sent to the backend
		const updatedData = {
			formFields,
			formSections,
		};

		console.log("Updated Data to Send:", updatedData);

		// Send to backend using fetch/axios etc.
		// Example:
		// fetch('/your-backend-endpoint', {
		//   method: 'POST',
		//   headers: { 'Content-Type': 'application/json' },
		//   body: JSON.stringify(updatedData),
		// }).then(response => {
		//   if (!response.ok) throw new Error('Error in updating');
		//   return response.json();
		// }).catch(error => console.error('Update error:', error));
	};

	// @ts-ignore
	const handleCancel = () => {
		// Reset form fields and sections to their original initial values (deep copy)
		setFormFields(JSON.parse(JSON.stringify(initialFormFields)));
		setFormSections(JSON.parse(JSON.stringify(initialFormSections)));
		// window.location.reload();
	};

	const sectionNameMap = {
		"اطلاعات پایه": "Basic Information",
		"تاریخچه سلامتی و بیماری": "Health and Illness History",
		"حساسیت ها": "Allergies",
		"محدودیت ها و توانایی ها": "Limitations and Abilities",
		"سابقه مصرف دارو (اختیاری)": "Medication History (Optional)",
		"بیماران خانم": "Female Patients",
		"انجام فعالیت های روزانه زندگی": "Performing daily life activities",
		// Add any additional sections here
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
					{formFields.map((field, index) => {
						return (
							<div key={index} className="col-6 py-2 px-5">
								<input
									type="checkbox"
									checked={field.required}
									onChange={() => {
										const updatedFields = [...formFields];
										updatedFields[index].required =
											!updatedFields[index].required;
										setFormFields(updatedFields);
									}}
									className="form-check-input shadow-sm mx-2"
								/>
								<label htmlFor={field.name} className="form-label">
									{language === "fa" ? field.label : field.labelEN}
								</label>
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
				{Object.keys(formSections).map((section, index) => {
					return (
						<div key={index}>
							<h4 className="text-center pt-4">
								{language === "fa"
									? section
									: sectionNameMap[section as keyof typeof sectionNameMap]}
							</h4>
							<hr className=" rounded-pill mx-4 my-2" />
							<div
								className={`row row-cols-2 mt-4 mb-5`}
								style={{ direction: language === "fa" ? "rtl" : "ltr" }}
							>
								{Array.isArray(formSections[section]) &&
									formSections[section].map((field: any, index: number) => {
										if (field.type === "placeholder") {
											return null;
										}
										return (
											<div key={index} className="col-6 py-2 px-5">
												<input
													type="checkbox"
													checked={field.required}
													onChange={() => {
														const updatedSections = { ...formSections };
														updatedSections[section][index].required =
															!updatedSections[section][index].required;
														setFormSections(updatedSections);
													}}
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
					);
				})}
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
