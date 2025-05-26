import {
	useEffect,
	useRef,
	useState,
	forwardRef,
	useImperativeHandle,
} from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../cssFiles/textOverflow.css";

import pdfIcon from "../assets/icons/fileIcons/file-pdf-duotone-solid.svg";
import zipIcon from "../assets/icons/fileIcons/file-zipper-duotone-solid.svg";
import fileIcon from "../assets/icons/fileIcons/file-duotone-solid.svg";
import imgIcon from "../assets/icons/fileIcons/file-image-duotone-solid.svg";
import { useAuth } from "./AuthContext";

function getFileExtension(fileName: string): string {
	// Split the file name by dots and return the last part as the extension
	const parts = fileName.split(".");
	return parts.length > 1 ? parts.pop() || "" : ""; // Exclude the dot (e.g., "png")
}

interface FileData {
	fileName: string;
	fileType: string;
	fileUrl: string;
	file: File;
	tag: string;
}

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

interface serviceSubmitDataProps {
	formInputs: {
		tag: string; // Field identifier
		value: string; // Field value
	}[];
}

const icons = {
	pdf: pdfIcon,
	zip: zipIcon,
	rar: zipIcon,
	jpg: imgIcon,
	jpeg: imgIcon,
	png: imgIcon,
	default: fileIcon,
};

// Function to get the appropriate icon based on file extension
const getIconForFileType = (fileName: string) => {
	const extension = fileName
		.split(".")
		.pop()
		?.toLowerCase() as keyof typeof icons;
	return icons[extension] || icons["default"];
};

export interface FormRenderHandle {
	submitForm: () => void;
	getFormValues: () => any; // Adjust the return type if you know the structure of form values
}

const FormRender = forwardRef<FormRenderHandle, any>((_props, ref) => {
	const { id } = useParams<{ id: string }>();
	const { language } = useLanguage();
	const { loginState } = useAuth();

	const [serviceFormFieldData, setServiceFormFieldData] = useState<
		serviceFormFieldProps[]
	>([]);

	const [serviceSubmitData] = useState<serviceSubmitDataProps>({
		formInputs: [],
	});

	const [uploadedFiles, setUploadedFiles] = useState<
		Record<string, FileData[]>
	>({});
	const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

	const initialValues = serviceFormFieldData.reduce(
		(values, field: serviceFormFieldProps) => {
			const matchingInput = serviceSubmitData.formInputs?.find(
				(input: { tag: string }) => input.tag === field.tag
			);
			values[field.tag] = matchingInput ? matchingInput.value : ""; // Default to empty string
			return values;
		},
		{} as Record<string, string>
	);

	useEffect(() => {
		if (!loginState) return;
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
			})
			.catch((error) => {
				console.error(
					"API request failed, trying local db.json",
					error
				);
				alert(
					language === "fa"
						? "دریافت اطلاعات ذخیره شده فرم سرویس ناموفق بود "
						: "Failed to capture the previouslly saved service form data."
				);
			});
	}, []);

	// Create the Yup validation schema based on validationSchemaData
	const validationSchema = Yup.object().shape(
		serviceFormFieldData.reduce((acc, field) => {
			if (field.type === "file") {
				return acc;
			}

			let fieldSchema: Yup.AnySchema; // Start with a generic AnySchema

			// Determine the type of the field and assign the correct schema type
			switch (field.type) {
				case "string":
					fieldSchema = Yup.string(); // Use string schema for string fields
					break;
				case "longString":
					fieldSchema = Yup.string(); // Use string schema for string fields
					break;
				case "date":
					fieldSchema = Yup.date(); // Use date schema for date fields
					break;
				case "integer":
					fieldSchema = Yup.number();
					break;
				case "float":
					fieldSchema = Yup.number();
					break;
				case "checkbox":
					fieldSchema = Yup.boolean(); // Use boolean schema for boolean fields
					break;
				default:
					fieldSchema = Yup.mixed(); // Use mixed for all other types
			}

			// Apply validations based on field properties if the field is enabled
			if (field.enabled) {
				if (field.required) {
					fieldSchema = fieldSchema.required(
						language === "fa"
							? "این فیلد الزامی است"
							: "This field is required"
					);
				}

				// Apply max length validation only if the field type is a string
				if (field.maxLength) {
					fieldSchema = (fieldSchema as Yup.StringSchema).max(
						field.maxLength,
						language === "fa"
							? `حداکثر طول مجاز ${field.maxLength} کاراکتر است`
							: `Maximum length is ${field.maxLength} characters`
					);
				}

				// Add schema to accumulator
				acc[field.tag] = fieldSchema;
			}

			return acc;
		}, {} as Yup.ObjectShape) // Initialize as an empty Yup object schema
	);

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,

		onSubmit: async (values: any) => {
			// Array to hold formInputs
			const formInputs: { tag: string; value: string }[] = [];

			try {
				// Upload each file in uploadedFiles and update formInputs with the fileId
				for (const [, files] of Object.entries(uploadedFiles)) {
					for (const file of files) {
						const formData = new FormData(); // Create a new FormData instance

						// Append data to FormData (including the binary file)
						formData.append("serviceId", String(id)); // Example of adding other data
						formData.append("FileTag", file.tag); // Add the tag for the file
						formData.append(
							"FileFormat",
							file.fileType.split("/").pop() || "unknown"
						); // Extract file format
						formData.append("File", file.file); // This is the actual file (with binary data)

						// Send the file to the API
						const response = await axiosInstance.post(
							"/api/File/UploadFile",
							formData,
							{
								headers: {
									"Content-Type": "multipart/form-data", // Ensure correct content type for file upload
								},
							}
						);

						if (response.status === 200) {
							// Add the fileId to formInputs
							formInputs.push({
								tag: file.tag, // Tag associated with the file input
								value: response.data.fileId.toString(),
							});
						}
					}
				}

				// Add other form fields to formInputs (non-file inputs)
				Object.entries(values).forEach(([tag, value]) => {
					formInputs.push({ tag, value: String(value) });
				});

				// Prepare final payload
				const payload = {
					serviceId: id,
					formInputs,
				};

				// Send the final payload to the service purchase API
				const purchaseResponse = await axiosInstance.post(
					"/api/Service/PurchaseService",
					payload,
					{ withCredentials: true }
				);

				if (purchaseResponse.status === 200) {
					alert(
						language === "fa"
							? "سرویس خریداری شد"
							: "Service purchased successfully"
					);
				}
			} catch (error) {
				console.error("Error updating user data:", error);
				alert(
					language === "fa"
						? "خرید سرویس ناموفق بود"
						: "Service purchase failed"
				);
			}
		},
		validateOnBlur: true,
		validateOnChange: true,
		validateOnMount: true,
	});

	// Define methods to expose
	useImperativeHandle(ref, () => ({
		submitForm: formik.handleSubmit,
		getFormValues: () => formik.values,
	}));

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

	const handleFileChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		tag: string
	) => {
		const files = Array.from(event.target.files || []);
		const filesWithTags = files.map((file) => ({
			fileName: file.name,
			fileType: getFileExtension(file.name),
			fileUrl: URL.createObjectURL(file), // For preview
			file,
			tag,
		}));

		setUploadedFiles((prev) => ({
			...prev,
			[tag]: [...(prev[tag] || []), ...filesWithTags], // Add files for the specific tag
		}));
	};

	const handleFileDelete = (fileIndex: number, tag: string) => {
		setUploadedFiles((prevFiles) => ({
			...prevFiles,
			[tag]: prevFiles[tag].filter((_, index) => index !== fileIndex),
		}));
	};

	return (
		<div className="container text-center my-4">
			<div
				// className=" pt-3 mt-5"
				style={{ direction: language === "fa" ? "rtl" : "ltr" }}
			>
				<div
					className="row row-cols-lg-2 row-cols-1 g-4 g-md-5 my-1"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					{loginState ? (
						serviceFormFieldData.map(
							(field: serviceFormFieldProps) => {
								const isCheckbox = field.type === "checkbox";
								const isText = field.type === "string";
								const isTextLong = field.type === "longString";
								const isDate = field.type === "date";
								const isFile = field.type === "file";
								const isNumber =
									field.type === "integer" ||
									field.type === "float";

								const step =
									field.type === "integer"
										? "1"
										: field.type === "float"
											? "any"
											: undefined;

								// Parse allowed formats
								const allowedFormats = field.allowedFormats
									? field.allowedFormats
											.split(",") // Split by commas
											.map(
												(format) => `.${format.trim()}`
											) // Add a leading dot for file extensions
											.filter((format) => format !== ".") // Remove empty or invalid formats
											.join(",") // Rejoin as a comma-separated list
									: ""; // Default to accepting no formats if empty

								return (
									field.enabled && (
										<div className="my-2" key={field.tag}>
											{(isText || isNumber || isDate) && (
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
																language ===
																"fa"
																	? "rtl"
																	: "ltr",
														}}
													>
														<div className="d-flex flex-row justify-content-between align-items-center">
															<label
																htmlFor={
																	field.tag
																}
																className="form-label mx-2 "
															>
																{language ===
																"fa"
																	? field.label
																	: field.labelEN}
															</label>
														</div>
														<input
															type={
																isNumber
																	? "number"
																	: field.type
															}
															step={
																step as string
															}
															min={0}
															id={field.tag}
															name={field.tag}
															value={
																formik.values[
																	field.tag
																] || ""
															} // Bind Formik's values
															onChange={
																formik.handleChange
															} // Bind Formik's onChange
															onBlur={
																formik.handleBlur
															} // Trigger validation on blur
															className={`form-control text-${
																language ===
																"fa"
																	? "end"
																	: "start"
															} shadow-sm ${
																formik.touched[
																	field.tag
																] &&
																formik.errors[
																	field.tag
																]
																	? "is-invalid"
																	: ""
															}`} // Highlight errors
															placeholder={
																(language ===
																"fa"
																	? field.description
																	: field.descriptionEN) ||
																""
															}
														/>

														{formik.touched[
															field.tag
														] &&
															formik.errors[
																field.tag
															] && (
																<div
																	className={`invalid-feedback text-${
																		language ===
																		"fa"
																			? "end"
																			: "start"
																	}`}
																>
																	{
																		formik
																			.errors[
																			field
																				.tag
																		] as keyof serviceSubmitDataProps
																	}
																</div>
															)}
													</div>
												</div>
											)}
											{isFile && (
												<div
													key={field.tag}
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
																language ===
																"fa"
																	? "rtl"
																	: "ltr",
														}}
													>
														<div className="d-flex flex-row justify-content-between align-items-center">
															<label
																htmlFor={
																	field.tag
																}
																className="form-label mx-2 "
															>
																{language ===
																"fa"
																	? field.label
																	: field.labelEN}
															</label>
														</div>
														<div
															className="d-flex justify-content-between border border-2 shadow-sm rounded-4 p-2 w-100"
															style={{
																direction:
																	"ltr",
															}}
														>
															<div
																className={`d-flex flex-wrap justify-content-start align-items-center gap-3 `}
															>
																{/* Display uploaded files with icons */}
																{uploadedFiles[
																	field.tag
																]?.map(
																	(
																		file,
																		index
																	) => (
																		<div
																			key={
																				index
																			}
																			className="d-flex flex-column  p-1 mx-1"
																		>
																			<a
																				href={
																					file.fileUrl
																				}
																				download
																				className="d-flex flex-column justify-content-center align-items-center d-block"
																			>
																				<img
																					src={getIconForFileType(
																						file.fileName
																					)}
																					alt={`${file.fileName} Icon`}
																					className="custom-file-icon"
																				/>
																				<span className="scrollable-text text-center mt-1">
																					{
																						file.fileName
																					}
																				</span>
																			</a>
																			<button
																				className="btn btn-sm btn-danger rounded-pill mt-1"
																				onClick={() =>
																					handleFileDelete(
																						index,
																						field.tag
																					)
																				}
																			>
																				{language ===
																				"fa"
																					? "حذف"
																					: "Delete"}
																			</button>
																		</div>
																	)
																)}
															</div>

															{/* Upload button for this section */}
															<div className="d-flex flex-wrap justify-content-end align-items-center">
																<button
																	type="button"
																	className="btn btn-outline-secondary ms-2"
																	onClick={() =>
																		fileInputRefs.current?.[
																			field
																				.tag
																		]?.click()
																	}
																>
																	<i className="fas fa-file-upload"></i>
																	{language ===
																	"fa"
																		? "ارسال فایل"
																		: "Upload"}
																</button>
																<input
																	type="file"
																	ref={(el) =>
																		(fileInputRefs.current[
																			field.tag
																		] = el)
																	}
																	style={{
																		display:
																			"none",
																	}}
																	onChange={(
																		e
																	) =>
																		handleFileChange(
																			e,
																			field.tag
																		)
																	}
																	multiple
																	accept={
																		allowedFormats ||
																		""
																	}
																/>
															</div>
														</div>
													</div>
												</div>
											)}
											{isCheckbox && (
												<div
													key={field.tag}
													className={`text-${
														language === "fa"
															? "end"
															: "start"
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
												<div
													className="d-flex flex-column my-2"
													key={field.tag}
												>
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
														} h-100 shadow-sm ${
															formik.touched[
																field.tag
															] &&
															formik.errors[
																field.tag
															]
																? "is-invalid"
																: ""
														}`}
														name={field.tag}
														id={field.tag}
														rows={3}
														value={
															formik.values[
																field.tag
															]
														} // Bind Formik's values
														onChange={
															formik.handleChange
														} // Bind Formik's onChange
														onBlur={
															formik.handleBlur
														} // Trigger validation on blur
														placeholder={
															language === "fa"
																? "متن خود را وارد کنید"
																: "Write your input"
														}
														style={{
															resize: "none",
														}}
													></textarea>

													{formik.touched[
														field.tag
													] &&
														formik.errors[
															field.tag
														] && (
															<div className="invalid-feedback text-start">
																{
																	formik
																		.errors[
																		field
																			.tag
																	] as keyof serviceSubmitDataProps
																}
															</div>
														)}
												</div>
											)}
										</div>
									)
								);
							}
						)
					) : (
						<p
							className="text-center p-0 p-md-auto m-auto"
							style={{
								direction: "ltr",
							}}
							dangerouslySetInnerHTML={{
								__html:
									(language === "fa"
										? `جهت دسترسی به این امکانات، لطفاً <a href="/login" style="color: blue; text-decoration: inherit;">وارد</a> حساب کاربری خود شوید`
										: `To access the following features, please <a href="/login" style="color: blue; text-decoration: inherit;">Log in</a> to your account.`) +
									"<br>" +
									(language === "fa"
										? `در صورت عدم وجود حساب کاربری، لطفاً <a href="/signUp" style="color: blue; text-decoration: inherit;">ثبت نام</a> کنید`
										: `If you don’t have an account, kindly <a href="/signUp" style="color: blue; text-decoration: inherit;">Sign up</a> to get started.`),
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
});
export default FormRender;
