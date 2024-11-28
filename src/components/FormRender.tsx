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

import pdfIcon from "../assets/icons/fileIcons/file-pdf-duotone-solid.svg";
import zipIcon from "../assets/icons/fileIcons/file-zipper-duotone-solid.svg";
import fileIcon from "../assets/icons/fileIcons/file-duotone-solid.svg";
import imgIcon from "../assets/icons/fileIcons/file-image-duotone-solid.svg";

interface FileData {
	fileName: string;
	fileType: string;
	fileUrl: string;
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

const FormRender = forwardRef<FormRenderHandle, any>((props, ref) => {
	const { id } = useParams<{ id: string }>();
	const { language } = useLanguage();

	const [serviceFormFieldData, setServiceFormFieldData] = useState<
		serviceFormFieldProps[]
	>([]);

	const [serviceSubmitData, setServiceSubmitData] =
		useState<serviceSubmitDataProps>({
			formInputs: [],
		});

	const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]); // State to store uploaded files
	const fileInputRef = useRef<HTMLInputElement>(null);

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
				console.error("API request failed, trying local db.json", error);
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
				case "file":
					fieldSchema = Yup.mixed(); // Use boolean schema for boolean fields
					break;
				default:
					fieldSchema = Yup.mixed(); // Use mixed for all other types
			}

			// Apply validations based on field properties if the field is enabled
			if (field.enabled) {
				if (field.required) {
					fieldSchema = fieldSchema.required(
						language === "fa" ? "این فیلد الزامی است" : "This field is required"
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
			try {
				// Send the transformed data to the update API
				await axiosInstance.post("/api/User/UpdateUserData", values);
				alert(
					language === "fa"
						? "اطلاعات کاربر بروزرسانی شد"
						: "User information updated successfully"
				);
			} catch (error) {
				console.error("Error updating user data:", error);
				alert(
					language === "fa"
						? "بروزرسان اطلاعات کاربر ناموفق بود"
						: "User information update failed"
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

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []); // Get selected files
		const newFiles = files.map((file) => ({
			fileName: file.name,
			fileType: file.type,
			fileUrl: URL.createObjectURL(file),
		}));

		// Update the state with newly uploaded files
		setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
	};

	const handleFileDelete = (fileIndex: number) => {
		setUploadedFiles((prevFiles) =>
			prevFiles.filter((_, index) => index !== fileIndex)
		);
	};

	const handleFileUploadClick = () => {
		fileInputRef.current?.click(); // Trigger file input click
	};

	return (
		<div className="container text-center my-4">
			<div
				// className=" pt-3 mt-5"
				style={{ direction: language === "fa" ? "rtl" : "ltr" }}
			>
				{/* <h3 className="mb-4">
					{language === "fa" ? "پیش نمایش فرم:" : "Form Preview:"}
				</h3> */}
				<div
					className="row row-cols-2 g-4 g-md-5 my-1"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					{serviceFormFieldData.map((field: serviceFormFieldProps) => {
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
							field.enabled && (
								<div className="my-2" key={field.tag}>
									{(isText || isNumber || isDate) && (
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
													<label
														htmlFor={field.tag}
														className="form-label mx-2 "
													>
														{language === "fa" ? field.label : field.labelEN}
													</label>
												</div>
												<input
													type={isNumber ? "number" : field.type}
													step={step as string}
													min={0}
													id={field.tag}
													name={field.tag}
													value={formik.values[field.tag]} // Bind Formik's values
													onChange={formik.handleChange} // Bind Formik's onChange
													onBlur={formik.handleBlur} // Trigger validation on blur
													className={`form-control text-${
														language === "fa" ? "end" : "start"
													} shadow-sm ${
														formik.touched[field.tag] &&
														formik.errors[field.tag]
															? "is-invalid"
															: ""
													}`} // Highlight errors
													placeholder={
														(language === "fa"
															? field.description
															: field.descriptionEN) || ""
													}
												/>

												{formik.touched[field.tag] &&
													formik.errors[field.tag] && (
														<div
															className={`invalid-feedback text-${
																language === "fa" ? "end" : "start"
															}`}
														>
															{
																formik.errors[
																	field.tag
																] as keyof serviceSubmitDataProps
															}
														</div>
													)}
											</div>
										</div>
									)}
									{isFile && (
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
													<label
														htmlFor={field.tag}
														className="form-label mx-2 "
													>
														{language === "fa" ? field.label : field.labelEN}
													</label>
												</div>
												<div
													className="d-flex justify-content-between border border-2 shadow-sm rounded-4 p-2 my-2 w-100"
													style={{ direction: "ltr" }}
												>
													<div
														className={`d-flex flex-wrap justify-content-start align-items-center`}
													>
														{/* Display uploaded files with icons */}
														{uploadedFiles.map((file, index) => (
															<div className="d-flex flex-column p-1 mx-1">
																<a
																	href={file.fileUrl}
																	key={index}
																	className="d-flex flex-column justify-content-center align-items-center d-block "
																	download
																>
																	<img
																		src={getIconForFileType(file.fileName)}
																		alt={`${file.fileName} Icon`}
																		className="custom-file-icon"
																	/>
																	<span
																		className={`scrollable-text text-center mt-1`}
																	>
																		{file.fileName}
																	</span>
																</a>
																{/* Delete Button */}
																<button
																	className="btn btn-sm btn-danger rounded-pill mt-1"
																	onClick={() => handleFileDelete(index)}
																>
																	{language === "fa" ? "حذف" : "Delete"}
																</button>
															</div>
														))}
													</div>
													<div className="d-flex flex-wrap justify-content-end align-items-center">
														{/* Upload button */}
														<button
															type="button"
															className="btn btn-outline-secondary ms-2"
															onClick={handleFileUploadClick}
														>
															<i className="fas fa-file-upload"></i>
															{language === "fa" ? "ارسال فایل" : "Upload"}
														</button>
														{/* Hidden file input */}
														<input
															type="file"
															ref={fileInputRef}
															style={{ display: "none" }}
															onChange={handleFileChange}
															multiple // Allow multiple file selection
														/>
													</div>
												</div>
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
												} h-100 shadow-sm ${
													formik.touched[field.tag] && formik.errors[field.tag]
														? "is-invalid"
														: ""
												}`}
												name={field.tag}
												id={field.tag}
												rows={3}
												value={formik.values[field.tag]} // Bind Formik's values
												onChange={formik.handleChange} // Bind Formik's onChange
												onBlur={formik.handleBlur} // Trigger validation on blur
												placeholder={
													language === "fa"
														? "متن خود را وارد کنید"
														: "Write your input"
												}
												style={{
													resize: "none",
												}}
											></textarea>

											{formik.touched[field.tag] &&
												formik.errors[field.tag] && (
													<div className="invalid-feedback text-start">
														{
															formik.errors[
																field.tag
															] as keyof serviceSubmitDataProps
														}
													</div>
												)}
										</div>
									)}
								</div>
							)
						);
					})}
				</div>
			</div>
		</div>
	);
});
export default FormRender;
