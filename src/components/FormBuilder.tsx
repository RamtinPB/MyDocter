import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";
import { useParams } from "react-router-dom";
import "../cssFiles/textOverflow.css";

interface serviceFormFieldProps {
	id: number;
	type: string; // "string" | "number" | "boolean" | "radio" | "select" | "date" | "file"  | "text-checkbox"
	tag: string;

	label: string;
	labelEN: string;

	description: string;
	descriptionEN: string;

	required: boolean;
	enabled: boolean;

	maxLength: number;
	allowedFormats: string;
}

function FormBuilder() {
	const { id } = useParams();

	const { language } = useLanguage(); // Get language and toggle function from context

	const [serviceFormFieldData, setServiceFormFieldData] = useState<
		serviceFormFieldProps[]
	>([]);

	const [fieldLabel, setFieldLabel] = useState("");
	const [fieldLabelEN, setFieldLabelEN] = useState("");

	const [fieldDescription, setFieldDescription] = useState("");
	const [fieldDescriptionEN, setFieldDescriptionEN] = useState("");

	const [fieldTag, setFieldTag] = useState("");

	const [fieldType, setFieldType] =
		useState<serviceFormFieldProps["type"]>("string");

	const [fieldRequired, setFieldRequired] = useState(false);
	const [fieldEnabled, setFieldEnabled] = useState(true);

	const [fieldAllowedFormats, setfieldAllowedFormats] = useState("");

	const [dataUpdateFlag, setDataUpdateFlag] = useState(false);
	const [dataEditFlag, setDataEditFlag] = useState(false);

	useEffect(() => {
		axiosInstance
			.post(
				"/api/Admin/GetAllServiceFormFields",
				{
					serviceId: id,
				},
				{
					withCredentials: true,
				}
			)
			.then((response) => {
				const data = response.data;
				const newData = Array.isArray(data)
					? data.map((item) => ({
							...item,
							type: mapApiTypeToType(item.type),
						}))
					: [];
				setServiceFormFieldData(newData);
			})
			.catch(async (error) => {
				alert(
					language === "fa"
						? "دریافت اطلاعات ذخیره شده فرم سرویس ناموفق بود "
						: "Failed to capture the previouslly saved service form data."
				);
				console.error(
					"API request failed, trying local db.json",
					error
				);

				try {
					const response = await fetch("/ServiceFormFields.json"); // Adjust path if necessary
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					const data = await response.json();
					const selectedService = data.find(
						(s: { serviceId: any }) => `${s.serviceId}` === id
					);
					if (selectedService) {
						const newData = Array.isArray(selectedService)
							? data.map((item: { type: number }) => ({
									...item,
									type: mapApiTypeToType(item.type),
								}))
							: [];
						setServiceFormFieldData(newData);
					}
				} catch (err) {
					console.error("Failed to fetch services", err);
				}
			});
	}, [dataUpdateFlag]);

	const addFormField = async (newFormField: serviceFormFieldProps) => {
		if (!fieldTag.trim()) {
			alert(
				language === "fa"
					? "لطفاً شناسه خاص ورودی را وارد کنید."
					: "Please enter a valid tag."
			);
			return;
		}

		if (fieldTag.includes(" ")) {
			alert(
				language === "fa"
					? "شناسه خاص ورودی نمی‌تواند حاوی فاصله باشد. لطفاً از '_' استفاده کنید."
					: "The tag cannot contain spaces. Please use '_' instead."
			);
			return;
		}

		if (
			serviceFormFieldData.some((field) => field.tag === fieldTag.trim())
		) {
			alert(
				language === "fa"
					? "شناسه ورودی تکراری است."
					: "Duplicate input tag."
			);
			return;
		}

		if (fieldAllowedFormats) {
			// Check if the fieldAllowedFormats is a valid format
			if (
				!/^([a-zA-Z0-9]+)(,[a-zA-Z0-9]+)*$/.test(fieldAllowedFormats) && // Case 1: Comma-separated list like "jpeg,jpg,png"
				!/^[a-zA-Z0-9]+$/.test(fieldAllowedFormats) // Case 2: Single format like "jpeg"
			) {
				// Invalid format, return
				alert(
					language === "fa"
						? "فرمز های غیر مجاز برای ورود نوع فایل وارد شده است"
						: "Invalid allowed file format entered"
				);
				return;
			}
		}

		const apiData = {
			serviceId: Number(id),
			type: mapTypeToApiType(newFormField.type), // Map the type using mapTypeToApiType
			tag: newFormField.tag, // Use the tag for unique identification
			label: newFormField.label, // Farsi label
			labelEN: newFormField.labelEN, // English label
			description: newFormField.description, // Farsi description
			descriptionEN: newFormField.descriptionEN, // English description
			required: newFormField.required, // Required newFormField logic
			maxLength: newFormField.maxLength, // Max length for input
			allowedFormats: newFormField.allowedFormats, // Allowed formats (e.g., regex)
			enabled: newFormField.enabled, // Enabled status
		};

		try {
			// Send each field to the API
			const response = await axiosInstance.post(
				"/api/Admin/AddServiceFormField",
				apiData
			);

			if (response.status === 200) {
				console.log(`Field ${newFormField.tag} saved successfully!`);
			} else {
				throw new Error(`Unexpected response: ${response.status}`);
			}
		} catch (error) {
			console.error("Error saving form fields:", error);
			alert(
				"Failed to save one or more fields. Check the console for details."
			);
		} finally {
			// Reset all field-specific states
			setFieldLabel("");
			setFieldLabelEN("");

			setFieldDescription("");
			setFieldDescriptionEN("");

			setFieldTag("");

			setFieldRequired(false);
			setFieldEnabled(false);

			setfieldAllowedFormats(""); // Clear allowed formats for "file"
		}
		setDataUpdateFlag((prev) => !prev);
	};

	const handleDeleteField = async (
		formFieldToDelete: serviceFormFieldProps
	) => {
		try {
			// Send each field to the API
			const response = await axiosInstance.post(
				"/api/Admin/RemoveServiceFormField",
				{ formFieldId: formFieldToDelete.id }
			);

			if (response.status === 200) {
				console.log(
					`Field ${formFieldToDelete.tag} saved successfully!`
				);
			} else {
				throw new Error(`Unexpected response: ${response.status}`);
			}
		} catch (error) {
			console.error("Error saving form fields:", error);
			alert(
				"Failed to save one or more fields. Check the console for details."
			);
		}
		setDataUpdateFlag((prev) => !prev);
	};

	const defaultFormFieldData = () => {
		// Reset all field-specific states
		setFieldLabel("");
		setFieldLabelEN("");

		setFieldDescription("");
		setFieldDescriptionEN("");

		setFieldTag("");
		setFieldType("string");

		setFieldRequired(false);
		setFieldEnabled(false);

		setfieldAllowedFormats(""); // Clear allowed formats for "file"

		setDataEditFlag(false);
	};

	const handleEditFieldState = (formFieldToEdit: serviceFormFieldProps) => {
		// Reset all field-specific states
		setFieldLabel(formFieldToEdit.label);
		setFieldLabelEN(formFieldToEdit.labelEN);

		setFieldDescription(formFieldToEdit.description);
		setFieldDescriptionEN(formFieldToEdit.descriptionEN);

		setFieldTag(formFieldToEdit.tag);
		setFieldType(formFieldToEdit.type);

		setFieldRequired(formFieldToEdit.required);
		setFieldEnabled(formFieldToEdit.enabled);

		setfieldAllowedFormats(formFieldToEdit.allowedFormats); // Clear allowed formats for "file"
		setDataEditFlag(true);
	};

	const editFormField = async (formFieldToEdit: serviceFormFieldProps) => {
		// Find the matching field in serviceFormFieldData by tag
		const matchingField = serviceFormFieldData.find(
			(field) => field.tag === formFieldToEdit.tag
		);
		// Extract the id if a matching field is found
		const formFieldId = matchingField ? matchingField.id : undefined;
		const apiData = {
			serviceId: Number(id),
			formFieldId: formFieldId,
			type: mapTypeToApiType(formFieldToEdit.type), // Map the type using mapTypeToApiType
			tag: formFieldToEdit.tag, // Use the tag for unique identification
			label: formFieldToEdit.label, // Farsi label
			labelEN: formFieldToEdit.labelEN, // English label
			description: formFieldToEdit.description, // Farsi description
			descriptionEN: formFieldToEdit.descriptionEN, // English description
			required: formFieldToEdit.required, // Required formFieldToEdit logic
			maxLength: formFieldToEdit.maxLength, // Max length for input
			allowedFormats: formFieldToEdit.allowedFormats, // Allowed formats (e.g., regex)
			enabled: formFieldToEdit.enabled, // Enabled status
		};
		try {
			// Send each field to the API
			const response = await axiosInstance.post(
				"/api/Admin/EditServiceFormField",
				apiData
			);

			if (response.status === 200) {
				console.log(
					`Field ${formFieldToEdit.tag} edited successfully!`
				);
			} else {
				throw new Error(`Unexpected response: ${response.status}`);
			}
		} catch (error) {
			console.error("Error saving form fields:", error);
			alert(
				"Failed to edit one or more fields. Check the console for details."
			);
		} finally {
			// Reset all field-specific states
			setFieldLabel("");
			setFieldLabelEN("");

			setFieldDescription("");
			setFieldDescriptionEN("");

			setFieldTag("");
			setFieldType("string");

			setFieldRequired(false);
			setFieldEnabled(false);

			setfieldAllowedFormats(""); // Clear allowed formats for "file"

			setDataEditFlag(false);
			setDataUpdateFlag((prev) => !prev);
		}
	};

	const mapTypeToApiType = (type: string): number | null => {
		switch (type) {
			case "string":
				return 0; // Text Input
			case "integer":
				return 1;
			case "float":
				return 2;
			case "date":
				return 3;
			case "file":
				return 4;
			default:
				return null; // Default or unknown type
		}
	};
	// type: text=0, integer=1, float=2, date=3, file=4,

	const mapApiTypeToType = (type: number): string | null => {
		switch (type) {
			case 0:
				return "string"; // Text Input
			case 1:
				return "integer";
			case 2:
				return "float";
			case 3:
				return "date";
			case 4:
				return "file";
			default:
				return null; // Default or unknown type
		}
	};
	// type: text=0, integer=1, float=2, date=3, file=4,

	const handleRequiredChange = (fieldTag: string, isRequired: boolean) => {
		setServiceFormFieldData((prevFields) =>
			prevFields.map((field) =>
				field.tag === fieldTag
					? { ...field, required: isRequired }
					: field
			)
		);
	};

	const handleEnabledChange = (fieldTag: string, isEnabled: boolean) => {
		setServiceFormFieldData((prevFields) =>
			prevFields.map((field) =>
				field.tag === fieldTag
					? { ...field, enabled: isEnabled }
					: field
			)
		);
	};

	const saveFormFieldsData = async () => {
		// Transform the `type` field in the payload
		const transformedPayload = serviceFormFieldData.map((field) => ({
			...field,
			type: mapTypeToApiType(field.type), // Map the type to its numeric value
			formFieldId: field.id,
		}));
		try {
			// Send each field to the API
			const response = await axiosInstance.post(
				"/api/Admin/UpdateServiceFormFields",
				transformedPayload,
				{ withCredentials: true }
			);

			if (response.status === 200) {
				console.log(`Form fields data saved successfully!`);
			}
		} catch (error) {
			console.error("Error saving form fields:", error);
			alert("Failed to save fields. Check the console for details.");
		}
		setDataUpdateFlag((prev) => !prev);
	};

	return (
		<div className="container my-5">
			<div className="my-4">
				<label htmlFor="fieldType" className="form-label">
					{language === "fa" ? "نوع ورودی" : "Input Type"}
				</label>
				<select
					id="fieldType"
					className="form-select"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					value={fieldType || ""}
					onChange={(e) =>
						setFieldType(
							e.target.value as
								| "string"
								| "longString"
								| "integer"
								| "float"
								| "checkbox"
								| "date"
								| "file"
						)
					}
				>
					<option value="string">
						{language === "fa" ? "ورودی متن" : "Text Input"}
					</option>
					<option value="longString">
						{language === "fa"
							? "ورودی متن (طولانی)"
							: "Text Input (long)"}
					</option>
					<option value="integer">
						{language === "fa" ? "ورودی عددی" : "Number Input"}
					</option>
					<option value="float">
						{language === "fa" ? "ورودی اعشاری" : "Number Input"}
					</option>
					<option value="checkbox">
						{language === "fa" ? "ورودی چک باکس" : "Checkbox"}
					</option>
					<option value="date">
						{language === "fa" ? "ورودی تاریخ" : "Date Picker"}
					</option>
					<option value="file">
						{language === "fa" ? "ورودی فایل" : "File Upload"}
					</option>
				</select>
			</div>

			<div
				className="d-flex flex-wrap justify-content-evenly align-items-center"
				style={{ direction: language === "fa" ? "rtl" : "ltr" }}
			>
				<div className="my-4">
					<label htmlFor="FieldLabel" className="form-label">
						{language === "fa"
							? "تیتر ورودی"
							: "Input label (Farsi)"}
					</label>
					<input
						type="text"
						id="FieldLabel"
						className="form-control"
						value={fieldLabel || ""}
						onChange={(e) => setFieldLabel(e.target.value)}
						placeholder={
							language === "fa"
								? "متن خود را وارد کنید"
								: "Write your input"
						}
					/>
				</div>

				<div className="my-4">
					<label htmlFor="FieldLabelEN" className="form-label">
						{language === "fa"
							? "تیتر ورودی (انگلیسی)"
							: "Input label (English)"}
					</label>
					<input
						type="text"
						id="FieldLabelEN"
						className="form-control"
						value={fieldLabelEN || ""}
						onChange={(e) => setFieldLabelEN(e.target.value)}
						placeholder={"Write your input"}
						style={{ direction: "ltr" }}
					/>
				</div>

				<div className="my-4">
					<label htmlFor="FieldTag" className="form-label">
						{language === "fa"
							? "شناسه خاص ورودی (انگلیسی)"
							: "Input exclusive tag (English)"}
					</label>
					<input
						type="text"
						id="FieldTag"
						className="form-control"
						value={fieldTag || ""}
						onChange={(e) => {
							setFieldTag(e.target.value);
						}}
						placeholder="Example: exampleIllness"
						style={{ direction: "ltr" }}
					/>
				</div>

				<div className="my-4">
					<label htmlFor="FieldDescription" className="form-label">
						{language === "fa"
							? "توضیحات ورودی"
							: "Input description (Farsi)"}
					</label>
					<input
						type="text"
						id="FieldDescription"
						className="form-control"
						value={fieldDescription || ""}
						onChange={(e) => setFieldDescription(e.target.value)}
						placeholder={
							language === "fa"
								? "متن خود را وارد کنید"
								: "Write your input"
						}
					/>
				</div>

				<div className="my-4">
					<label htmlFor="FieldDescriptionEN" className="form-label">
						{language === "fa"
							? "توضیحات ورودی (انگلیسی)"
							: "Input description (English)"}
					</label>
					<input
						type="text"
						id="FieldDescriptionEN"
						className="form-control"
						value={fieldDescriptionEN || ""}
						onChange={(e) => setFieldDescriptionEN(e.target.value)}
						placeholder={"Write your input"}
						style={{ direction: "ltr" }}
					/>
				</div>

				{fieldType === "file" && (
					<div className="my-4">
						<label
							htmlFor="FieldAllowedFormats"
							className="form-label"
						>
							{language === "fa"
								? "فرمت های مجاز ورودی"
								: "Input allowed file formats"}
						</label>
						<input
							type="text"
							id="FieldAllowedFormats"
							className="form-control"
							value={fieldAllowedFormats || ""}
							onChange={(e) =>
								setfieldAllowedFormats(e.target.value)
							}
							placeholder="jpeg,jpg,rar,zip,txt,pdf,etc."
							style={{ direction: "ltr" }}
							required={fieldType === "file"}
						/>
					</div>
				)}
			</div>
			{dataEditFlag ? (
				<div
					className="d-flex flex-row justify-content-center align-items-center gap-3 my-4"
					style={{ direction: language === "fa" ? "ltr" : "rtl" }}
				>
					<button
						type="button"
						className="btn-close"
						aria-label="Close"
						onClick={() => defaultFormFieldData()}
					></button>
					<button
						className="btn btn-secondary"
						onClick={() =>
							editFormField({
								id: Number(id),
								type: fieldType, // Use the selected field type
								tag: fieldTag.trim(), // Will be autogenerated in addFormField
								label: fieldLabel,
								labelEN: fieldLabelEN,
								description: fieldDescription,
								descriptionEN: fieldDescriptionEN,
								required: fieldRequired,
								enabled: fieldEnabled,
								maxLength:
									fieldType === "string" ||
									fieldType === "longString"
										? 256
										: 0,
								allowedFormats: fieldAllowedFormats,
							})
						}
					>
						{language === "fa" ? "ویرایش کردن ورودی" : "Edit input"}
					</button>
				</div>
			) : (
				<div className="d-flex flex-row justify-content-center align-items-center my-4">
					<button
						className="btn btn-primary"
						onClick={() =>
							addFormField({
								id: Number(id),
								type: fieldType, // Use the selected field type
								tag: fieldTag.trim(), // Will be autogenerated in addFormField
								label: fieldLabel,
								labelEN: fieldLabelEN,
								description: fieldDescription,
								descriptionEN: fieldDescriptionEN,
								required: fieldRequired,
								enabled: fieldEnabled,
								maxLength:
									fieldType === "string" ||
									fieldType === "longString"
										? 256
										: 0,
								allowedFormats: fieldAllowedFormats,
							})
						}
					>
						{language === "fa" ? "اضافه کردن ورودی" : "Add input"}
					</button>
				</div>
			)}
			<div
				className=" pt-3 mt-5"
				style={{ direction: language === "fa" ? "rtl" : "ltr" }}
			>
				<h3 className="mb-4">
					{language === "fa" ? "پیش نمایش فرم:" : "Form Preview:"}
				</h3>
				<div
					className="row row-cols-lg-2 row-cols-1 g-4 g-md-5 my-1"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					{serviceFormFieldData.map((field) => {
						const isCheckbox = field.type === "checkbox";
						const isText = field.type === "string";
						const isTextLong = field.type === "longString";
						const isDate = field.type === "date";
						const isFile = field.type === "file";
						const isNumber =
							field.type === "integer" || field.type === "float";

						const step =
							field.type === "integer"
								? "1"
								: field.type === "float"
									? "any"
									: undefined;
						return (
							<div className="my-2" key={field.tag}>
								{(isText || isNumber || isDate || isFile) && (
									<div
										className="col mb-2"
										style={{
											direction:
												language === "fa"
													? "rtl"
													: "ltr",
										}}
									>
										<div
											className={`d-flex flex-column justify-content-center align-items-start my-2`}
											style={{
												direction:
													language === "fa"
														? "rtl"
														: "ltr",
											}}
										>
											<div className="d-flex flex-row justify-content-between align-items-center gap-3">
												<label
													htmlFor={field.tag}
													className="form-label mx-2 "
												>
													{language === "fa"
														? field.label
														: field.labelEN}
												</label>
												<div
													className="px-auto d-flex "
													style={{
														direction:
															language === "fa"
																? "rtl"
																: "ltr",
													}}
												>
													<label
														htmlFor={field.tag}
														className="form-check-label mx-2 mb-2"
													>
														{language === "fa"
															? "(الزامی / غیر الزامی)"
															: "Required / Not Required"}
													</label>
													<input
														type="checkbox"
														id="FieldRequired"
														checked={field.required}
														onChange={(e) =>
															handleRequiredChange(
																field.tag,
																e.target.checked
															)
														}
														placeholder={
															(language === "fa"
																? field.description
																: field.descriptionEN) ||
															""
														}
														className="form-check-input shadow-sm"
														required={true}
													/>
												</div>
												<div className="px-auto d-flex ">
													<label
														htmlFor={field.tag}
														className="form-check-label mx-2 mb-2"
													>
														{language === "fa"
															? "(فعال / غیر فعال)"
															: "Enabled / Not Enabled"}
													</label>
													<input
														type="checkbox"
														id="FieldEnabled"
														checked={field.enabled}
														onChange={(e) =>
															handleEnabledChange(
																field.tag,
																e.target.checked
															)
														}
														className="form-check-input shadow-sm"
														required={true}
													/>
												</div>
											</div>
											<input
												type={
													isNumber
														? "number"
														: field.type
												}
												step={step as string}
												min={0}
												id={field.tag}
												name={field.tag}
												onInput={(e) => {
													const target =
														e.target as HTMLInputElement; // Type assertion
													const inputValue =
														target.value; // Get the input value

													if (step === "1") {
														// For integers: Remove non-numeric characters and round to integer
														const sanitizedValue =
															inputValue.replace(
																/[^0-9]/g,
																""
															); // Keep only digits
														target.value =
															sanitizedValue
																? Math.round(
																		Number(
																			sanitizedValue
																		)
																	).toString()
																: "";
													} else if (step === "any") {
														// For floats: Allow numbers with decimals
														const sanitizedValue =
															inputValue.replace(
																/[^0-9.]/g,
																""
															); // Keep only digits and decimal point
														const decimalCount = (
															sanitizedValue.match(
																/\./g
															) || []
														).length; // Count decimals

														if (decimalCount > 1) {
															// Prevent multiple decimal points
															target.value =
																sanitizedValue.substring(
																	0,
																	sanitizedValue.lastIndexOf(
																		"."
																	)
																);
														} else {
															target.value =
																sanitizedValue; // Allow valid float
														}
													} else {
														// Default behavior for other input types
														target.defaultValue =
															inputValue;
													}
												}}
												className={`form-control text-${
													language === "fa"
														? "end"
														: "start"
												} shadow-sm `}
												placeholder={
													(language === "fa"
														? field.description
														: field.descriptionEN) ||
													""
												}
											/>
										</div>
									</div>
								)}
								{isCheckbox && (
									<div
										className={`text-${
											language === "fa" ? "end" : "start"
										} mt-2`}
									>
										<label
											htmlFor={field.tag}
											className="form-check-label mx-2"
										>
											{language === "fa"
												? field.label
												: field.labelEN}
										</label>
										<input
											type="checkbox"
											id={field.tag}
											name={field.tag}
											onInput={(e) =>
												(e.currentTarget.defaultValue =
													e.currentTarget.value)
											}
											className="form-check-input shadow-sm"
										/>
									</div>
								)}
								{isTextLong && (
									<div className="d-flex flex-column my-2">
										<label
											htmlFor={field.tag}
											className="py-2"
										>
											{language === "fa"
												? field.label
												: field.labelEN}
										</label>
										<textarea
											className={`form-control text-${
												language === "fa"
													? "end"
													: "start"
											} h-100`}
											onInput={(e) =>
												(e.currentTarget.defaultValue =
													e.currentTarget.value)
											}
											rows={3}
											placeholder={
												(language === "fa"
													? field.description
													: field.descriptionEN) || ""
											}
											style={{
												resize: "none",
											}}
										></textarea>
									</div>
								)}
								<div
									className={`d-flex justify-content-${
										language === "fa" ? "start" : "end"
									}  align-items-center my-2 gap-2`}
									style={{ direction: "rtl" }}
								>
									<button
										className="btn btn-danger btn-sm rounded-3"
										onClick={() => handleDeleteField(field)}
									>
										{language === "fa"
											? "حذف ".concat(field.label)
											: "Delete ".concat(field.labelEN)}
									</button>
									<button
										className="btn btn-secondary btn-sm rounded-3"
										onClick={() =>
											handleEditFieldState(field)
										}
									>
										{language === "fa"
											? "ویرایش ".concat(field.label)
											: "Edit ".concat(field.labelEN)}
									</button>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<div className="d-flex flex-row justify-content-center align-items-center my-4">
				<button
					className="btn btn-success rounded-pill px-3"
					onClick={() => saveFormFieldsData()}
				>
					{language === "fa" ? "ذخیره فرم" : "Save Form"}
				</button>
			</div>
		</div>
	);
}

export default FormBuilder;
