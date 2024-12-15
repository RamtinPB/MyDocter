import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";
import "../cssFiles/textOverflow.css";

import pdfIcon from "../assets/icons/fileIcons/file-pdf-duotone-solid.svg";
import zipIcon from "../assets/icons/fileIcons/file-zipper-duotone-solid.svg";
import fileIcon from "../assets/icons/fileIcons/file-duotone-solid.svg";
import imgIcon from "../assets/icons/fileIcons/file-image-duotone-solid.svg";
import { fileTypeFromBlob } from "file-type";

// Utility function to format date
const formatDateToISO = (dateValue: string): string => {
	try {
		// Parse the input value to a JavaScript Date object
		const parsedDate = new Date(dateValue);

		// Format the date as 'YYYY-MM-DD'
		return parsedDate.toISOString().split("T")[0];
	} catch {
		// Handle invalid date formats gracefully
		return "";
	}
};

interface FileData {
	fileName: string;
	fileType: string;
	fileUrl: string;
	file: File;
	tag: string;
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

interface Input {
	type: string;
	value: string;
	label: string;
	labelEN: string;
}

interface PurchasedServiceProps {
	inputs?: Input[];
}

interface FormRenderFilledProps {
	purchasedServiceData?: PurchasedServiceProps; // Accepts the entire object
}

function FormRenderFilled({ purchasedServiceData }: FormRenderFilledProps) {
	const { language } = useLanguage();
	const [transformedInputs, setTransformedInputs] = useState<Input[]>([]);
	const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]); // State to store uploaded files
	const processedFileIdsRef = useRef(new Set());

	useEffect(() => {
		if (purchasedServiceData?.inputs) {
			const inputs = purchasedServiceData.inputs;

			// Group file-type items by label
			const groupedFiles: Record<string, string[]> = {};
			const nonFileItems: Input[] = [];

			inputs.forEach((item) => {
				if (item.type === "File") {
					if (!groupedFiles[item.label]) {
						groupedFiles[item.label] = [];
					}
					groupedFiles[item.label].push(item.value);
				} else {
					// Collect non-file items without changes
					nonFileItems.push(item);
				}
			});

			// Transform grouped file items into a single item per label
			const transformedFileItems = Object.entries(groupedFiles).map(
				([label, values]) => ({
					type: "File",
					value: values.join("-"), // Concatenate values with a "-"
					label,
					labelEN: inputs.find(
						(item) => item.type === "File" && item.label === label
					)?.labelEN, // No labelEN used, or keep it null if required
				})
			);

			// Combine non-file items with transformed file items
			setTransformedInputs([
				...nonFileItems,
				...transformedFileItems,
			] as Input[]);
		}
	}, [purchasedServiceData]);

	useEffect(() => {
		if (!transformedInputs) return;

		const fileTypeInputs = transformedInputs.filter(
			(item) => item.type === "File"
		); // Filter for file-type items

		fileTypeInputs.forEach((fileInput) => {
			const fileIds = fileInput.value.split("-"); // Extract file IDs from the value string

			fileIds.forEach((fileId) => {
				if (processedFileIdsRef.current.has(fileId)) {
					// Skip API call if the fileId has already been processed
					return;
				}

				// Add the fileId to the Set to mark it as processed
				processedFileIdsRef.current.add(fileId);

				axiosInstance
					.post(
						"/api/File/GetFile",
						{ fileId: fileId },
						{
							responseType: "blob", // Binary data handling
						}
					)
					.then(async (response) => {
						const blob = new Blob([response.data], {
							type:
								response.headers["content-type"] ||
								"application/octet-stream",
						});

						const headerFileName =
							response.headers["content-disposition"]?.match(
								/filename="(.+)"/
							)?.[1] || Date.now();

						const fileType = await fileTypeFromBlob(blob); // Infer file type

						const fileExtension = fileType?.ext
							? `.${fileType.ext}`
							: ""; // Get the file extension (e.g., ".pdf")
						const mimeType = fileType?.mime || blob.type;

						// Append the file extension if it's not already in the file name
						const fileName = String(headerFileName).endsWith(
							fileExtension
						)
							? headerFileName
							: `${headerFileName}${fileExtension}`;

						const file = new File([blob], fileName, {
							type: mimeType,
						});
						const fileUrl = URL.createObjectURL(blob);

						// Construct the file data object
						const fileData = {
							fileName,
							fileType: fileExtension,
							fileUrl,
							file,
							tag: fileInput.label, // Use the input's label as the tag
						};

						// Update the state immediately
						setUploadedFiles((prevFiles) => [
							...prevFiles,
							fileData,
						]);
					})
					.catch((error) => {
						console.error(
							`Failed to fetch file for ID: ${fileId}`,
							error
						);
					});
			});
		});
	}, [transformedInputs]);

	console.log(uploadedFiles);
	console.log(transformedInputs);

	// const mapApiTypeToType = (type: number): string | null => {
	// 	switch (type) {
	// 		case 0:
	// 			return "string"; // Text Input
	// 		case 1:
	// 			return "integer";
	// 		case 2:
	// 			return "float";
	// 		// case 10:
	// 		// 	return "checkbox";
	// 		case 3:
	// 			return "date";
	// 		case 4:
	// 			return "file";
	// 		default:
	// 			return null; // Default or unknown type
	// 	}
	// };
	// type: text=0, integer=1, float=2, date=3, file=4,

	return (
		<div className="container text-center mt-4">
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
					{transformedInputs.map((field, index) => {
						const isCheckbox =
							field.type.toLowerCase() === "checkbox";
						const isText = field.type.toLowerCase() === "text";
						const isTextLong =
							field.type.toLowerCase() === "longString";
						const isDate = field.type.toLowerCase() === "date";
						const isFile = field.type.toLowerCase() === "file";
						const isNumber =
							field.type.toLowerCase() === "integer" ||
							field.type.toLowerCase() === "float";

						return (
							<div
								className="my-2"
								key={`${field.label}-${index}`}
							>
								{(isText || isNumber) && (
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
											<div className="d-flex flex-row justify-content-between align-items-center">
												<label
													htmlFor={field.label}
													className="form-label mx-2 "
												>
													{language === "fa"
														? field.label
														: field.labelEN}
												</label>
											</div>
											<input
												type={
													isNumber
														? "number"
														: field.type.toLowerCase()
												}
												id={field.label}
												name={field.label}
												value={field.value} // Bind Formik's values
												className={`form-control text-${
													language === "fa"
														? "end"
														: "start"
												} shadow-sm`}
												readOnly
											/>
										</div>
									</div>
								)}
								{isDate && (
									<div
										className="col mb-2"
										style={{
											direction:
												language === "fa"
													? "rtl"
													: "ltr",
										}}
										key={`${field.label}-${index}`}
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
											<div className="d-flex flex-row justify-content-between align-items-center">
												<label
													htmlFor={field.label}
													className="form-label mx-2 "
												>
													{language === "fa"
														? field.label
														: field.labelEN}
												</label>
											</div>
											<input
												type={field.type.toLowerCase()}
												id={field.label}
												name={field.label}
												value={
													field.value
														? formatDateToISO(
																field.value
															)
														: ""
												} // Bind Formik's values
												className={`form-control text-${
													language === "fa"
														? "end"
														: "start"
												} shadow-sm`}
												readOnly
											/>
										</div>
									</div>
								)}
								{isFile && (
									<div
										className="col mb-2"
										style={{
											direction:
												language === "fa"
													? "rtl"
													: "ltr",
										}}
										key={`${field.label}-${index}`}
									>
										<div
											className={`d-flex flex-column justify-content-center align-items-${
												language === "fa"
													? "start"
													: "end"
											} my-2`}
											style={{
												direction:
													language === "fa"
														? "rtl"
														: "ltr",
											}}
										>
											<div className="d-flex flex-row justify-content-between align-items-center">
												<label
													htmlFor={field.label}
													className="form-label mx-2 "
												>
													{language === "fa"
														? field.label
														: field.labelEN}
												</label>
											</div>
											<div
												className="d-flex justify-content-between border border-2 shadow-sm rounded-4 p-2 w-100"
												style={{ direction: "ltr" }}
											>
												<div
													className={`d-flex flex-wrap justify-content-start align-items-center`}
												>
													{/* Display uploaded files with icons */}
													{uploadedFiles.map(
														(file, index) => (
															<div className="d-flex flex-column p-1 mx-1">
																<a
																	href={
																		file.fileUrl
																	}
																	key={index}
																	className="d-flex flex-column justify-content-center align-items-center d-block "
																	download={
																		file.fileName
																	}
																>
																	<img
																		src={getIconForFileType(
																			file.fileType
																		)}
																		alt={`${file.fileName} Icon`}
																		className="custom-file-icon"
																	/>
																	<span
																		className={`scrollable-text text-center mt-1`}
																	>
																		{
																			file.fileName
																		}
																	</span>
																</a>
															</div>
														)
													)}
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
										key={`${field.label}-${index}`}
									>
										<label
											htmlFor={field.label}
											className="form-check-label mx-2"
										>
											{language === "fa"
												? field.label
												: field.labelEN}
										</label>
										<input
											type="checkbox"
											id={field.label}
											name={field.label}
											className="form-check-input shadow-sm"
											readOnly
										/>
									</div>
								)}
								{isTextLong && (
									<div
										className="d-flex flex-column my-2"
										key={`${field.label}-${index}`}
									>
										<label
											htmlFor={field.label}
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
											} h-100 shadow-sm `}
											name={field.label}
											id={field.label}
											value={field.value}
											readOnly
											style={{
												resize: "none",
											}}
										></textarea>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default FormRenderFilled;
