import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "/src/cssFiles/customColors.css";
import "/src/cssFiles/userIEInformation.css";
import axiosInstance from "../myAPI/axiosInstance";
import { useLanguage } from "../components/LanguageContext";

interface UserInfo {
	userGender: string;
}

interface UserIEFormData {
	[key: string]: any;
}

const initialFormData: UserIEFormData = {};

function UserIEInformation() {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	const [formSections, setFormSections] = useState<{ [key: string]: any[] }>(
		{}
	);
	const [validationSchemaData, setValidationSchemaData] = useState<any[]>([]);

	const [openIndexes, setOpenIndexes] = useState<number[]>([]); // Track which sections are open

	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		// Fetch all data in a single request
		fetch("/db.json")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				// Update state for userInfo
				setUserInfo(data.userInfo);

				// Update form values with userInfoIE data
				formik.setValues(data.userInfoIE);

				// Update form fields
				const sections = data.formFieldsIE[0]; // Adjust based on structure
				setFormSections(sections);

				// Update validation schema data
				setValidationSchemaData(data.validationSchemaDataIE);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	const validationSchema = Yup.object().shape(
		validationSchemaData.reduce((acc, rule) => {
			let fieldSchema: Yup.AnySchema = Yup.mixed();

			// Determine the type of the field
			switch (rule.type) {
				case "string":
					fieldSchema = Yup.string();
					break;
				case "date":
					fieldSchema = Yup.date();
					break;
				default:
					fieldSchema = Yup.mixed();
			}

			// Apply common rules
			if (rule.matches && rule.type === "string") {
				fieldSchema = (fieldSchema as Yup.StringSchema).matches(
					new RegExp(language === "fa" ? rule.matches[0] : rule.matchesEN[0]),
					language === "fa" ? rule.matches[1] : rule.matchesEN[1]
				);
			}
			if (rule.email) {
				fieldSchema = (fieldSchema as Yup.StringSchema).email(
					language === "fa" ? rule.email : rule.emailEN
				);
			}

			// Apply conditional rules
			if (rule.when) {
				const [depField, conditions] = rule.when;
				fieldSchema = fieldSchema.when(depField, {
					is: conditions.is,
					then: (schema) => {
						let thenSchema = schema;
						if (conditions.then.matches) {
							thenSchema = (thenSchema as Yup.StringSchema).matches(
								new RegExp(
									language === "fa"
										? conditions.then.matches[0]
										: conditions.then.matchesEN[0]
								),
								language === "fa"
									? conditions.then.matches[1]
									: conditions.then.matchesEN[1]
							);
						}
						if (conditions.then.required === false) {
							thenSchema = thenSchema.notRequired();
						} else if (conditions.then.required) {
							thenSchema = thenSchema.required(
								language === "fa"
									? conditions.then.required
									: conditions.then.requiredEN
							);
						}
						return thenSchema;
					},
					otherwise: (schema) => {
						let otherwiseSchema = schema;
						if (conditions.otherwise.matches) {
							otherwiseSchema = (otherwiseSchema as Yup.StringSchema).matches(
								new RegExp(
									language === "fa"
										? conditions.otherwise.matches[0]
										: conditions.otherwise.matchesEN[0]
								),
								language === "fa"
									? conditions.otherwise.matches[1]
									: conditions.otherwise.matchesEN[1]
							);
						}
						if (conditions.otherwise.required === false) {
							otherwiseSchema = otherwiseSchema.notRequired();
						} else if (conditions.otherwise.required) {
							otherwiseSchema = otherwiseSchema.required(
								language === "fa"
									? conditions.otherwise.required
									: conditions.otherwise.requiredEN
							);
						}
						return otherwiseSchema;
					},
				});
			} else {
				// Apply default required rule if no 'when' condition is specified
				if (rule.required) {
					fieldSchema = fieldSchema.required(
						language === "fa" ? rule.required : rule.requiredEN
					);
				} else if (rule.optional) {
					fieldSchema = fieldSchema.notRequired();
				}
			}

			// Assign the field schema to the accumulator object
			acc[rule.name] = fieldSchema as Yup.Schema<any>;
			return acc;
		}, {} as Yup.ObjectSchema<any>)
	);

	const formik = useFormik({
		initialValues: initialFormData,
		validationSchema,
		onSubmit: (values) => {
			axiosInstance
				.post("/submitInitialEvaluation", values)
				.then((response) => {
					console.log(
						"initial evaluation updated successfully:",
						response.data
					);
				})
				.catch((error) => {
					console.error("Error updating initial evaluation:", error);
				});
		},
		validateOnBlur: true,
		validateOnChange: true,
	});

	const toggleForm = (index: number) => {
		setOpenIndexes((prevOpenIndexes) =>
			prevOpenIndexes.includes(index)
				? prevOpenIndexes.filter((i) => i !== index)
				: [...prevOpenIndexes, index]
		);
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
		<div className="custom-bg-4 min-vh-100">
			<div className="container d-flex flex-column">
				<form
					onSubmit={formik.handleSubmit}
					className="needs-validation my-5"
					noValidate
				>
					<div className="accordion" id="accordionExample">
						{Object.keys(formSections).map(
							(section, index) =>
								!(section === "id") &&
								!(
									userInfo?.userGender === "مرد" && section === "بیماران خانم"
								) && (
									<div
										className="accordion-item shadow-sm rounded-5 mb-5"
										key={index}
									>
										<div
											className="accordion-header border border-2 border-primary rounded-5 d-flex justify-content-end align-items-center p-2"
											id={`heading${index}`}
											style={{ direction: language === "fa" ? "ltr" : "rtl" }}
										>
											<h4 className="mb-0  mx-2 mx-md-3 mx-lg-4">
												{language === "fa"
													? section
													: sectionNameMap[
															section as keyof typeof sectionNameMap
													  ]}
											</h4>
											<img
												src="/images/plus-border.png"
												alt="+"
												className={`custom-btn img-fluid m-0 p-0 btn-toggle collapsed ${
													openIndexes.includes(index) ? "rotate" : ""
												}`}
												onClick={() => toggleForm(index)}
												data-bs-toggle="collapse"
												data-bs-target={`#collapse${index}`}
												itemType="button"
												aria-expanded={false}
												aria-controls={`collapse${index}`}
											/>
										</div>
										<div
											id={`collapse${index}`}
											className={`accordion-collapse collapse `}
										>
											<div
												className={`accordion-body text-${
													language === "fa" ? "end" : "start"
												} pt-0 mb-1`}
											>
												<div
													className="row d-flex align-items-start g-5 my-1"
													style={{
														direction: language === "fa" ? "rtl" : "ltr",
													}}
												>
													{Array.isArray(formSections[section]) &&
														formSections[section].map(
															(field: any, idx: number) => {
																if (field.type === "placeholder") {
																	return (
																		<h6 key={idx} className="col-6 mb-2">
																			{language === "fa"
																				? field.name
																				: field.nameEN}
																			{(language === "fa"
																				? field.name
																				: field.nameEN) && <hr />}
																		</h6>
																	); // Empty column for placeholder
																}
																const isSelect = field.type === "select";
																const isCheckbox = field.checkboxName;
																const isCheckMenu = field.type === "checkmenu";
																const isRadio = field.type === "radio";

																return (
																	<div
																		key={idx}
																		className="col-6 d-flex flex-column mb-2"
																		style={{
																			direction:
																				language === "fa" ? "ltr" : "rtl",
																		}}
																	>
																		<label
																			htmlFor={field.name}
																			className="form-label"
																		>
																			{language === "fa"
																				? field.label
																				: field.labelEN}
																		</label>
																		{isSelect ? (
																			<select
																				id={field.name}
																				name={field.name}
																				value={formik.values[field.name]}
																				onChange={formik.handleChange}
																				onBlur={formik.handleBlur}
																				className={`form-select text-${
																					language === "fa" ? "end" : "start"
																				}
																				 shadow-sm select-resize ${
																						formik.touched[field.name] &&
																						formik.errors[field.name]
																							? "is-invalid"
																							: ""
																					}`}
																				required={field.required}
																				disabled={
																					formik.values[field.checkboxName]
																				}
																			>
																				<option value="" disabled>
																					{field.placeholder || "..."}
																				</option>
																				{(language === "fa"
																					? field.options
																					: field.optionsEN
																				).map((option: string, i: number) => (
																					<option key={i} value={option}>
																						{option}
																					</option>
																				))}
																			</select>
																		) : isCheckMenu ? (
																			<div
																				className="d-flex flex-column checkmenu"
																				style={{
																					direction:
																						language === "fa" ? "rtl" : "ltr",
																				}}
																			>
																				{field.options.map(
																					(option: any, i: number) => (
																						<div
																							key={i}
																							className={`d-flex justify-content-start mt-2`}
																						>
																							<input
																								type="checkbox"
																								id={option.name}
																								name={option.name}
																								checked={
																									formik.values[option.name] ||
																									false
																								}
																								onChange={() => {
																									formik.setFieldValue(
																										option.name,
																										!formik.values[option.name] // Toggle the value
																									);
																								}}
																								onBlur={formik.handleBlur}
																								className={`form-check-input ${
																									formik.touched[option.name] &&
																									formik.errors[option.name]
																										? "is-invalid"
																										: ""
																								}`}
																							/>
																							<label
																								htmlFor={option.name}
																								className={`form-check-label ${
																									language === "fa"
																										? "me-3"
																										: "ms-3"
																								} `}
																							>
																								{language === "fa"
																									? option.label
																									: option.labelEN}
																							</label>
																						</div>
																					)
																				)}
																			</div>
																		) : isRadio ? (
																			field.options.map(
																				(option: any, i: number) => (
																					<div key={i} className="form-check">
																						<input
																							type="radio"
																							id={`${field.name}-${i}`}
																							name={field.name}
																							value={option.value}
																							checked={
																								formik.values[field.name] ===
																								option.value
																							}
																							onChange={formik.handleChange}
																							onBlur={formik.handleBlur}
																							className={`form-check-input ${
																								formik.touched[field.name] &&
																								formik.errors[field.name]
																									? "is-invalid"
																									: ""
																							}`}
																						/>
																						<label
																							htmlFor={`${field.name}-${i}`}
																							className="form-check-label"
																						>
																							{option.label}
																						</label>
																					</div>
																				)
																			)
																		) : (
																			<input
																				type={field.type}
																				id={field.name}
																				name={field.name}
																				value={formik.values[field.name]}
																				onChange={formik.handleChange}
																				onBlur={formik.handleBlur}
																				className={`form-control text-${
																					language === "fa" ? "end" : "start"
																				} shadow-sm ${
																					formik.touched[field.name] &&
																					formik.errors[field.name]
																						? "is-invalid"
																						: ""
																				}`}
																				required={field.required}
																				disabled={
																					formik.values[field.checkboxName]
																				}
																				placeholder={
																					(language === "fa"
																						? field.placeholder
																						: field.placeholderEN) || ""
																				}
																			/>
																		)}
																		{isCheckbox && field.checkboxLabel && (
																			<div
																				className={`d-flex justify-content-end mt-2`}
																			>
																				<input
																					type="checkbox"
																					id={field.checkboxName}
																					name={field.checkboxName}
																					checked={
																						formik.values[field.checkboxName] ||
																						false
																					}
																					onChange={(e) => {
																						formik.setFieldValue(
																							field.checkboxName,
																							e.target.checked
																						);
																					}}
																					className="form-check-input shadow-sm"
																				/>
																				<label
																					htmlFor={field.checkboxName}
																					className={`form-check-label ${
																						language === "fa" ? "ms-3" : "me-3"
																					}`}
																				>
																					{language === "fa"
																						? field.checkboxLabel
																						: field.checkboxLabelEN}
																				</label>
																			</div>
																		)}
																		{formik.touched[field.name] &&
																			formik.errors[field.name] && (
																				<div className="invalid-feedback">
																					{formik.errors[field.name] as string}
																				</div>
																			)}
																	</div>
																);
															}
														)}
												</div>
											</div>
										</div>
									</div>
								)
						)}
					</div>
					<div className="d-flex justify-content-center mt-4 mt-md-5">
						<button
							type="submit"
							className="btn btn-primary rounded-pill fs-6 px-4 py-2"
						>
							{language === "fa" ? "ذخیره" : "Save"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default UserIEInformation;
