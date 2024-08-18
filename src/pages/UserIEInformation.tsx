import { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import "/src/cssFiles/customColors.css";
import "/src/cssFiles/userIEInformation.css";

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

	useEffect(() => {
		axios
			.get("http://localhost:3001/userInfo")
			.then((response) => {
				setUserInfo(response.data);
			})
			.catch((error) => {
				console.log("Error fetching userInfo data:", error);
			});
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:3001/userInfoIE")
			.then((response) => {
				formik.setValues(response.data);
			})
			.catch((error) => {
				console.error("Error fetching userIE data:", error);
			});
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:3001/formFieldsIE")
			.then((response) => {
				const sections = response.data[0];
				setFormSections(sections);
			})
			.catch((error) => {
				console.error("Error fetching form fields:", error);
			});
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:3001/validationSchemaDataIE")
			.then((response) => {
				setValidationSchemaData(response.data);
			})
			.catch((error) => {
				console.error("Error fetching custom validation schema:", error);
			});
	}, []);

	// Function to clean form sections by filtering out unwanted properties

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
					new RegExp(rule.matches[0]),
					rule.matches[1]
				);
			}
			if (rule.email) {
				fieldSchema = (fieldSchema as Yup.StringSchema).email(rule.email);
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
								new RegExp(conditions.then.matches[0]),
								conditions.then.matches[1]
							);
						}
						if (conditions.then.required === false) {
							thenSchema = thenSchema.notRequired();
						} else if (conditions.then.required) {
							thenSchema = thenSchema.required(conditions.then.required);
						}
						return thenSchema;
					},
					otherwise: (schema) => {
						let otherwiseSchema = schema;
						if (conditions.otherwise.matches) {
							otherwiseSchema = (otherwiseSchema as Yup.StringSchema).matches(
								new RegExp(conditions.otherwise.matches[0]),
								conditions.otherwise.matches[1]
							);
						}
						if (conditions.otherwise.required === false) {
							otherwiseSchema = otherwiseSchema.notRequired();
						} else if (conditions.otherwise.required) {
							otherwiseSchema = otherwiseSchema.required(
								conditions.otherwise.required
							);
						}
						return otherwiseSchema;
					},
				});
			} else {
				// Apply default required rule if no 'when' condition is specified
				if (rule.required) {
					fieldSchema = fieldSchema.required(rule.required);
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
			axios
				.post("http://localhost:3001/submitInitialEvaluation", values)
				.then((response) => {
					console.log(
						"UserIE information updated successfully:",
						response.data
					);
				})
				.catch((error) => {
					console.error("Error updating userIE information:", error);
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

	return (
		<div className="custom-bg-4">
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
										>
											<h4 className="mb-0 ms-auto me-2 me-md-3 me-lg-4">
												{section}
											</h4>
											<img
												src="/src/images/plus-border.png"
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
											<div className="accordion-body text-end pt-0 mb-1">
												<div
													className="row row-cols-2 g-5 my-1"
													style={{ direction: "rtl" }}
												>
													{Array.isArray(formSections[section]) &&
														formSections[section].map(
															(field: any, idx: number) => {
																if (field.type === "placeholder") {
																	return (
																		<h6 key={idx} className="col mb-2">
																			{field.name}
																			{field.name && <hr />}
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
																		className="col mb-2"
																		style={{ direction: "ltr" }}
																	>
																		<label
																			htmlFor={field.name}
																			className="form-label"
																		>
																			{field.label}
																		</label>
																		{isSelect ? (
																			<select
																				id={field.name}
																				name={field.name}
																				value={formik.values[field.name]}
																				onChange={formik.handleChange}
																				onBlur={formik.handleBlur}
																				className={`form-select text-end shadow-sm ${
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
																				{field.options.map(
																					(option: string, i: number) => (
																						<option key={i} value={option}>
																							{option}
																						</option>
																					)
																				)}
																			</select>
																		) : isCheckMenu ? (
																			<div
																				className="checkmenu "
																				style={{ direction: "rtl" }}
																			>
																				{field.options.map(
																					(option: any, i: number) => (
																						<div
																							key={i}
																							className=" form-check "
																						>
																							<label
																								htmlFor={option.name}
																								className="form-check-label"
																							>
																								{option.label}
																							</label>
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
																				className={`form-control text-end shadow-sm ${
																					formik.touched[field.name] &&
																					formik.errors[field.name]
																						? "is-invalid"
																						: ""
																				}`}
																				required={field.required}
																				disabled={
																					formik.values[field.checkboxName]
																				}
																				placeholder={field.placeholder || ""}
																			/>
																		)}
																		{isCheckbox && field.checkboxLabel && (
																			<div className="text-end mt-2">
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
																					className="form-check-label ms-3"
																				>
																					{field.checkboxLabel}
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
							ذخیره
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default UserIEInformation;
