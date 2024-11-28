import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

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

interface ErrorResponseData {
	errorCode: number;
	message?: string;
}

function FormBuilder() {
	const { id } = useParams();

	const { language } = useLanguage(); // Get language and toggle function from context

	const [serviceFormFieldData, setServiceFormFieldData] = useState<
		serviceFormFieldProps[]
	>([]);

	const [initialServiceFormFieldData, setInitialServiceFormFieldData] =
		useState<serviceFormFieldProps[]>([]);

	const [fieldLabel, setFieldLabel] = useState("");
	const [fieldLabelEN, setFieldLabelEN] = useState("");

	const [fieldDescription, setFieldDescription] = useState("");
	const [fieldDescriptionEN, setFieldDescriptionEN] = useState("");

	const [fieldTag, setFieldTag] = useState("");

	const [fieldType, setFieldType] =
		useState<serviceFormFieldProps["type"]>("string");

	const [fieldRequired, setFieldRequired] = useState(false);
	const [fieldEnabled, setFieldEnabled] = useState(false);

	const [fieldAllowedFormats, setfieldAllowedFormats] = useState("");

	// const [dataUpdateFlag, setDataUpdateFlag] = useState(false);

	useEffect(() => {
		axiosInstance
			.post(
				"/api/Service/GetServiceFormFields",
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
				setInitialServiceFormFieldData(newData);
			})
			.catch((error) => {
				console.error("API request failed, trying local db.json", error);
				alert(
					language === "fa"
						? "دریافت اطلاعات ذخیره شده فرم سرویس ناموفق بود "
						: "Failed to capture the previouslly saved service form data."
				);
			});
	}, []);

	const addFormField = (newFormField: serviceFormFieldProps) => {
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

		if (serviceFormFieldData.some((field) => field.tag === fieldTag.trim())) {
			alert(
				language === "fa" ? "شناسه ورودی تکراری است." : "Duplicate input tag."
			);
			return;
		}

		setServiceFormFieldData((prevFields) => [
			...prevFields,
			{ ...newFormField, tag: fieldTag.trim() },
		]);

		// Reset all field-specific states
		setFieldLabel("");
		setFieldLabelEN("");

		setFieldTag("");

		setFieldRequired(false);
		setFieldEnabled(false);

		setfieldAllowedFormats(""); // Clear allowed formats for "file"
	};

	const handleDeleteField = (index: number) => {
		setServiceFormFieldData((prevFields) =>
			prevFields.filter((_, i) => i !== index)
		);
	};

	const saveServiceFormFieldData = async () => {
		try {
			// Create a Set of existing tags in serviceFormFieldData for quick lookups
			const existingTags = new Set(
				initialServiceFormFieldData.map((field) => field.tag)
			);
			console.log(existingTags);

			// Iterate over all form fields
			for (const field of serviceFormFieldData) {
				if (existingTags.has(field.tag)) {
					console.warn(`Field ${field.tag} already exists locally. Skipping.`);
					continue;
				}

				const apiData = {
					serviceId: Number(id),
					type: mapTypeToApiType(field.type), // Map the type using mapTypeToApiType
					tag: field.tag, // Use the tag for unique identification
					label: field.label, // Farsi label
					labelEN: field.labelEN, // English label
					description: field.description, // Farsi description
					descriptionEN: field.descriptionEN, // English description
					required: field.required, // Required field logic
					maxLength: field.maxLength, // Max length for input
					allowedFormats: field.allowedFormats, // Allowed formats (e.g., regex)
					enabled: field.enabled, // Enabled status
				};

				try {
					// Send each field to the API
					const response = await axiosInstance.post(
						"/api/Admin/AddServiceFormField",
						apiData
					);

					if (response.status === 200) {
						console.log(`Field ${field.tag} saved successfully!`);
					} else {
						throw new Error(`Unexpected response: ${response.status}`);
					}
				} catch (err) {
					// Cast the error to AxiosError to access its properties
					const error = err as AxiosError<ErrorResponseData>;

					// Handle API errors
					if (
						error.response?.status === 400 &&
						error.response?.data?.errorCode === 1027
					) {
						// Log and continue if the field already exists
						console.log(`Field ${field.tag} already exists. Skipping.`);
						continue;
					} else {
						// Re-throw for unexpected errors
						throw new Error(
							`Failed to save form field ${field.tag}: ${error.message}`
						);
					}
				}
			}
		} catch (error) {
			console.error("Error saving form fields:", error);
			alert(
				"Failed to save one or more fields. Check the console for details."
			);
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
			case "checkbox":
				return 0; // boolean
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
			case 10:
				return "checkbox"; // boolean
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
				field.tag === fieldTag ? { ...field, required: isRequired } : field
			)
		);
	};

	const handleEnabledChange = (fieldTag: string, isEnabled: boolean) => {
		setServiceFormFieldData((prevFields) =>
			prevFields.map((field) =>
				field.tag === fieldTag ? { ...field, enabled: isEnabled } : field
			)
		);
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
					value={fieldType}
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
						{language === "fa" ? "ورودی متن (طولانی)" : "Text Input (long)"}
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
						{language === "fa" ? "تیتر ورودی" : "Input label (Farsi)"}
					</label>
					<input
						type="text"
						id="FieldLabel"
						className="form-control"
						value={fieldLabel}
						onChange={(e) => setFieldLabel(e.target.value)}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						required={true}
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
						value={fieldLabelEN}
						onChange={(e) => setFieldLabelEN(e.target.value)}
						placeholder={"Write your input"}
						style={{ direction: "ltr" }}
						required={true}
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
						value={fieldTag}
						onChange={(e) => {
							setFieldTag(e.target.value);
						}}
						placeholder="Example: exampleIllness"
						style={{ direction: "ltr" }}
						required={true}
					/>
				</div>

				<div className="my-4">
					<label htmlFor="FieldDescription" className="form-label">
						{language === "fa" ? "توضیحات ورودی" : "Input description (Farsi)"}
					</label>
					<input
						type="text"
						id="FieldDescription"
						className="form-control"
						value={fieldDescription}
						onChange={(e) => setFieldDescription(e.target.value)}
						placeholder={
							language === "fa" ? "متن خود را وارد کنید" : "Write your input"
						}
						required={true}
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
						value={fieldDescriptionEN}
						onChange={(e) => setFieldDescriptionEN(e.target.value)}
						placeholder={"Write your input"}
						style={{ direction: "ltr" }}
						required={true}
					/>
				</div>

				{fieldType === "file" && (
					<div className="my-4">
						<label htmlFor="FieldAllowedFormats" className="form-label">
							{language === "fa"
								? "فرمت های مجاز ورودی"
								: "Input allowed file formats"}
						</label>
						<input
							type="text"
							id="FieldAllowedFormats"
							className="form-control"
							value={fieldAllowedFormats}
							onChange={(e) => setfieldAllowedFormats(e.target.value)}
							placeholder="jpeg, jpg, rar, zip, txt, pdf, etc."
							style={{ direction: "ltr" }}
							required={fieldType === "file"}
						/>
					</div>
				)}
			</div>

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
								fieldType === "string" || fieldType === "longString" ? 256 : 0,
							allowedFormats: fieldAllowedFormats,
						})
					}
				>
					{language === "fa" ? "اضافه کردن ورودی" : "Add input"}
				</button>
			</div>

			<div
				className=" pt-3 mt-5"
				style={{ direction: language === "fa" ? "rtl" : "ltr" }}
			>
				<h3 className="mb-4">
					{language === "fa" ? "پیش نمایش فرم:" : "Form Preview:"}
				</h3>
				<div
					className="row row-cols-1 g-4 g-md-5 my-1"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					{serviceFormFieldData.map((field, index) => {
						const isCheckbox = field.type === "checkbox";
						const isText = field.type === "string";
						const isTextLong = field.type === "longString";
						const isDate = field.type === "date";
						const isFile = field.type === "file";
						const isNumber = field.type === "integer" || field.type === "float";

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
										style={{ direction: language === "fa" ? "rtl" : "ltr" }}
									>
										<div
											className={`d-flex flex-column justify-content-center align-items-${
												language === "fa" ? "start" : "end"
											} my-2`}
											style={{ direction: language === "fa" ? "rtl" : "ltr" }}
										>
											<div className="d-flex flex-row justify-content-between align-items-center">
												<label htmlFor={field.tag} className="form-label mx-2 ">
													{language === "fa" ? field.label : field.labelEN}
												</label>
												<div className="px-5">
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
															handleRequiredChange(field.tag, e.target.checked)
														}
														className="form-check-input shadow-sm"
														required={true}
													/>
												</div>
												<div className="px-3">
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
															handleEnabledChange(field.tag, e.target.checked)
														}
														className="form-check-input shadow-sm"
														required={true}
													/>
												</div>
											</div>
											<input
												type={isNumber ? "number" : field.type}
												step={step as string}
												min={0}
												id={field.tag}
												name={field.tag}
												onInput={(e) => {
													const target = e.target as HTMLInputElement; // Type assertion
													const inputValue = target.value; // Get the input value

													if (step === "1") {
														// For integers: Remove non-numeric characters and round to integer
														const sanitizedValue = inputValue.replace(
															/[^0-9]/g,
															""
														); // Keep only digits
														target.value = sanitizedValue
															? Math.round(Number(sanitizedValue)).toString()
															: "";
													} else if (step === "any") {
														// For floats: Allow numbers with decimals
														const sanitizedValue = inputValue.replace(
															/[^0-9.]/g,
															""
														); // Keep only digits and decimal point
														const decimalCount = (
															sanitizedValue.match(/\./g) || []
														).length; // Count decimals

														if (decimalCount > 1) {
															// Prevent multiple decimal points
															target.value = sanitizedValue.substring(
																0,
																sanitizedValue.lastIndexOf(".")
															);
														} else {
															target.value = sanitizedValue; // Allow valid float
														}
													} else {
														// Default behavior for other input types
														target.defaultValue = inputValue;
													}
												}}
												className={`form-control text-${
													language === "fa" ? "end" : "start"
												} shadow-sm `}
												placeholder={
													(language === "fa"
														? field.description
														: field.descriptionEN) || ""
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
											{language === "fa" ? field.label : field.labelEN}
										</label>
										<input
											type="checkbox"
											id={field.tag}
											name={field.tag}
											onInput={(e) =>
												(e.currentTarget.defaultValue = e.currentTarget.value)
											}
											className="form-check-input shadow-sm"
										/>
									</div>
								)}
								{isTextLong && (
									<div className="d-flex flex-column my-2">
										<label htmlFor={field.tag} className="py-2">
											{language === "fa" ? field.label : field.labelEN}
										</label>
										<textarea
											className={`form-control text-${
												language === "fa" ? "end" : "start"
											} h-100`}
											onInput={(e) =>
												(e.currentTarget.defaultValue = e.currentTarget.value)
											}
											rows={3}
											placeholder={
												language === "fa"
													? "متن خود را وارد کنید"
													: "Write your input"
											}
											style={{
												resize: "none",
											}}
										></textarea>
									</div>
								)}
								<div
									className={`d-flex justify-content-${
										language === "fa" ? "end" : "start"
									}  align-items-center my-2`}
									style={{ direction: language === "fa" ? "ltr" : "rtl" }}
								>
									<button
										className="btn btn-danger btn-sm rounded-3"
										onClick={() => handleDeleteField(index)}
									>
										{language === "fa"
											? "حذف ".concat(field.label)
											: "Delete ".concat(field.labelEN)}
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
					onClick={saveServiceFormFieldData}
				>
					{language === "fa" ? "ذخیره فرم" : "Save Form"}
				</button>
			</div>
		</div>
	);
}

export default FormBuilder;
