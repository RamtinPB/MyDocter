import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "/src/cssFiles/customColors.css";
import "/src/cssFiles/userIEInformation.css";
import axiosInstance from "../myAPI/axiosInstance";
import { useLanguage } from "../components/LanguageContext";

interface validationSchemaIEDataProps {
	name: string;
	required: boolean;
	type: string;
	checkboxName: string;

	matches: string;
	matchesMessage: string;

	matchesEN: string;
	matchesMessageEN: string;

	requiredMessage: string;
	requiredMessageEN: string;
}

interface formFieldsIEProps {
	name: string;
	type: string;
	required: boolean;

	parent: string;

	group: string;
	groupEN: string;

	label: string;
	labelEN: string;

	placeholder: string;
	placeholderEN: string;

	options: string;
	optionsEN: string;

	checkboxName: string;
	checkboxLabel: string;
	checkboxLabelEN: string;
}

// Create a utility function to process the data
const processData = (
	data: any[]
): {
	formFieldsProps: formFieldsIEProps[];
	validationSchemaData: validationSchemaIEDataProps[];
} => {
	const formFields: formFieldsIEProps[] = data.map((field) => ({
		name: field.name,
		type: field.type,
		required: field.required, // Assuming this is already a boolean
		parent: field.parent,
		group: field.group,
		groupEN: field.groupEN,
		label: field.label,
		labelEN: field.labelEN,
		placeholder: field.placeholder,
		placeholderEN: field.placeholderEN,
		options: field.options, // Assuming options might be an array
		optionsEN: field.optionsEN, // Assuming optionsEN might be an array
		checkboxName: field.checkboxName,
		checkboxLabel: field.checkboxLabel,
		checkboxLabelEN: field.checkboxLabelEN,
	}));

	const validationSchemaData: validationSchemaIEDataProps[] = data
		.filter((field) => field.type || field.matches || field.checkboxName)
		.map((field) => ({
			name: field.name,
			required: field.required,
			type: field.type,
			matches: field.matches,
			matchesMessage: field.matchesMessage,
			matchesEN: field.matchesEN,
			matchesMessageEN: field.matchesMessageEN,
			requiredMessage: field.requiredMessage,
			requiredMessageEN: field.requiredMessageEN,
			checkboxName: field.checkboxName,
		}));

	return { formFieldsProps: formFields, validationSchemaData };
};

interface UserInfo {
	gender: string;
	age?: string;
}

interface UserIEFormData {
	// Basic Information
	weight?: string;
	height?: string;
	age?: string;
	bodyMassIndex?: string; // Optional field

	// Health and Illness History
	illnessHistory?: string;
	noIllnessHistory?: boolean;

	illnessHistoryInFamily?: string;
	noIllnessHistoryInFamily?: boolean;

	userFamilyMemberRelation?: string;

	bloodTransfusionHistory?: string;
	bloodTransfusionReactionHistory?: string;
	noBloodTransfusionReactionHistory?: boolean;

	riskFactors?: string[];
	pets?: string;
	noPets?: boolean;
	sleepStatus?: string;
	sleepIssues?: string;
	noSleepIssues?: boolean;

	// Allergies
	allergyToDrug?: string;
	noAllergyToDrug?: boolean;
	allergyToDrugReaction?: string;
	allergyToFood?: string;
	noAllergyToFood?: boolean;
	allergyToFoodReaction?: string;

	// Disabilities and Capabilities
	hearingDisability?: string;
	noHearingDisability?: boolean;
	sightDisability?: string;
	noSightDisability?: boolean;
	disabilityOrAmputation?: string;
	noDisabilityOrAmputation?: boolean;
	assistiveDevicesProsthetics?: string[]; // For the checkmenu type

	// Daily Activities
	ableToEat?: string;
	ableToDress?: string;
	ableToBathe?: string;
	ableToGoToBathroom?: string;
	ableToFreelyMove?: string;

	// Medication History (Optional)
	regularDrugUseHistory?: string;

	// Women-specific Information
	pregnancyStatus?: string;
	lactationStatus?: string;
}

const initialFormData: UserIEFormData = {
	weight: "",
	height: "",
	age: "",
	illnessHistory: "",
	illnessHistoryInFamily: "",
	bloodTransfusionHistory: "",
	bloodTransfusionReactionHistory: "",
	pets: "",
	sleepStatus: "",
	sleepIssues: "",
	allergyToDrug: "",
	allergyToFood: "",
	hearingDisability: "",
	sightDisability: "",
	disabilityOrAmputation: "",
	ableToEat: "",
	ableToDress: "",
	ableToBathe: "",
	ableToGoToBathroom: "",
	ableToFreelyMove: "",
	pregnancyStatus: "",
	lactationStatus: "",

	noIllnessHistory: false,
	noIllnessHistoryInFamily: false,
	noBloodTransfusionReactionHistory: false,
	noPets: false,
	noSleepIssues: false,
	noAllergyToDrug: false,
	noAllergyToFood: false,
	noHearingDisability: false,
	noSightDisability: false,
	noDisabilityOrAmputation: false,
};

function UserIEInformation() {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

	const [formFields, setFormFields] = useState<any[]>([]);
	const [validationSchemaData, setValidationSchemaData] = useState<any[]>([]);

	const [openIndexes, setOpenIndexes] = useState<number[]>([]); // Track which sections are open

	const { language } = useLanguage(); // Get language and toggle function from context

	// fetch user data
	useEffect(() => {
		axiosInstance
			.post("/api/User/GetUserData") // Call the API to get user data
			.then((response) => {
				const data = response.data;

				// Update state for userInfo
				setUserInfo(data);
			})
			.catch((error) => {
				console.error(
					"API request for user data failed, trying local db.json",
					error
				);

				// Fetch from local db.json if API fails
				fetch("/db.json")
					.then((response) => {
						if (!response.ok) {
							throw new Error("Failed to fetch user data from db.json");
						}
						return response.json();
					})
					.then((data) => {
						// Update state for userInfo
						setUserInfo(data.userInfo);
					})
					.catch((jsonError) => {
						console.error(
							"Failed to fetch user data from both API and db.json",
							jsonError
						);
					});
			});
	}, []);

	// fetch user information data
	useEffect(() => {
		axiosInstance
			.post("/api/User/GetUserInformation") // Call the API to get user data
			.then((response) => {
				const data = response.data;

				// Update form values with userInfoIE data
				formik.setValues(data);
				console.log(data);
			})
			.catch((error) => {
				console.error(
					"API request for user data failed, trying local db.json",
					error
				);

				// Fetch from local db.json if API fails
				fetch("/db.json")
					.then((response) => {
						if (!response.ok) {
							throw new Error("Failed to fetch user data from db.json");
						}
						return response.json();
					})
					.then((data) => {
						// Update form values with userInfoIE data
						formik.setValues(data.userInfoIE);
					})
					.catch((jsonError) => {
						console.error(
							"Failed to fetch user data from both API and db.json",
							jsonError
						);
					});
			});
	}, []);

	// fetch user information form fields
	useEffect(() => {
		axiosInstance
			.post("/api/User/GetUserInformationFormFields") // Call the API to get user data
			.then((response) => {
				const data = response.data;

				const {
					formFieldsProps: newFormFields,
					validationSchemaData: newValidationSchemaData,
				} = processData(data);

				setFormFields(newFormFields);
				setValidationSchemaData(newValidationSchemaData);

				console.log(newFormFields);
				console.log(newValidationSchemaData);
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
						const {
							formFieldsProps: newFormFields,
							validationSchemaData: newValidationSchemaData,
						} = processData(data);

						setFormFields(newFormFields);
						setValidationSchemaData(newValidationSchemaData);

						console.log(newFormFields);
						console.log(newValidationSchemaData);
					})
					.catch((jsonError) => {
						console.error(
							"Failed to fetch user data form fields from both API and db.json",
							jsonError
						);
					});
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
				case "select":
					fieldSchema = Yup.string();
					break;
				default:
					fieldSchema = Yup.mixed();
			}

			// Apply common rules
			if (rule.matches && rule.type === "string") {
				fieldSchema = (fieldSchema as Yup.StringSchema).matches(
					new RegExp(language === "fa" ? rule.matches : rule.matchesEN),
					language === "fa" ? rule.matchesMessage : rule.matchesMessageEN
				);
			}

			// Apply conditional rules
			if (rule.checkboxName && rule.required) {
				const depField = rule.checkboxName;
				fieldSchema = fieldSchema.when(depField, {
					is: true,
					then: (schema) => {
						let thenSchema = schema;
						thenSchema = thenSchema.notRequired().nullable();
						return thenSchema;
					},
					otherwise: (schema) => {
						let otherwiseSchema = schema;
						if (rule.matches) {
							otherwiseSchema = (otherwiseSchema as Yup.StringSchema).matches(
								new RegExp(language === "fa" ? rule.matches : rule.matchesEN),
								language === "fa" ? rule.matchesMessage : rule.matchesMessageEN
							);
						}
						if (rule.required) {
							otherwiseSchema = otherwiseSchema.required(
								language === "fa"
									? rule.requiredMessage
									: rule.requiredMessageEN
							);
						}
						return otherwiseSchema;
					},
				});
			} else {
				// Apply default required rule if no 'when' condition is specified
				if (rule.required) {
					fieldSchema = fieldSchema.required(
						language === "fa" ? rule.requiredMessage : rule.requiredMessageEN
					);
				} else {
					fieldSchema = fieldSchema.notRequired().nullable();
				}
			}

			// Assign the field schema to the accumulator object
			acc[rule.name] = fieldSchema as Yup.Schema<any>;
			return acc;
		}, {} as Yup.ObjectSchema<any>)
	);

	const formik = useFormik({
		initialValues: initialFormData,
		validationSchema: validationSchema,

		onSubmit: async (values) => {
			try {
				// Send the transformed data to the update API
				await axiosInstance.post("/api/User/UpdateUserInformation", values);
				console.log("User data updated successfully");
				console.log(formik.errors);
			} catch (error) {
				console.error("Error updating user data:", error);
			}
		},
		validateOnBlur: true,
		validateOnChange: true,
		validateOnMount: true,
	});

	const toggleForm = (index: number) => {
		setOpenIndexes((prevOpenIndexes) =>
			prevOpenIndexes.includes(index)
				? prevOpenIndexes.filter((i) => i !== index)
				: [...prevOpenIndexes, index]
		);
	};

	const handleTestSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		console.log(formik.errors);
		formik.handleSubmit();
	};

	return (
		<div className="custom-bg-4 min-vh-100">
			<div className="container d-flex flex-column">
				<form
					onSubmit={handleTestSubmit}
					className="needs-validation my-5"
					noValidate
				>
					<div className="accordion" id="accordionExample">
						{Array.from(new Set(formFields.map((field) => field.group))).map(
							(group, index) => {
								const sampleField = formFields.find(
									(field) => field.group === group
								);
								return (
									!(group === undefined || group === null) &&
									!(userInfo?.gender === "مرد" && group === "بیماران خانم") && (
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
														? sampleField.group
														: sampleField.groupEN}
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
														{formFields
															.filter((field) => field.group === group)
															.map((field: formFieldsIEProps, idx: number) => {
																if (field.type === "placeholder") {
																	return (
																		<h6 key={idx} className="col-6 mb-2">
																			{field.name}
																			{field.name && <hr />}
																		</h6>
																	); // Empty column for placeholder
																}
																const isSelect = field.type === "select";
																const isCheckbox = field.checkboxName;
																const isCheckMenu = field.type === "checkmenu";

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
																				value={String(
																					formik.values[
																						field.name as keyof UserIEFormData
																					] || ""
																				)}
																				onChange={formik.handleChange}
																				onBlur={formik.handleBlur}
																				className={`form-select text-${
																					language === "fa" ? "end" : "start"
																				}
																				 shadow-sm select-resize ${
																						formik.touched[
																							field.name as keyof UserIEFormData
																						] &&
																						formik.errors[
																							field.name as keyof UserIEFormData
																						]
																							? "is-invalid"
																							: ""
																					}`}
																				required={field.required}
																				disabled={
																					!!formik.values[
																						field.checkboxName as keyof UserIEFormData
																					]
																				}
																			>
																				<option value="" disabled>
																					{field.placeholder || "..."}
																				</option>
																				{(language === "fa"
																					? field.options
																					: field.optionsEN
																				)
																					.split(",")
																					.map((option: string, i: number) => (
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
																				{formFields
																					.filter(
																						(item) => item.parent === field.name
																					)
																					.map((option, i) => (
																						<div
																							key={i}
																							className={`d-flex justify-content-start mt-2`}
																						>
																							<input
																								type="checkbox"
																								id={option.name}
																								name={option.name}
																								checked={
																									!!formik.values[
																										option.name as keyof UserIEFormData
																									] || false
																								}
																								onChange={() => {
																									formik.setFieldValue(
																										option.name,
																										!formik.values[
																											option.name as keyof UserIEFormData
																										] // Toggle the value
																									);
																								}}
																								onBlur={formik.handleBlur}
																								className={`form-check-input ${
																									formik.touched[
																										option.name as keyof UserIEFormData
																									] &&
																									formik.errors[
																										option.name as keyof UserIEFormData
																									]
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
																					))}
																			</div>
																		) : (
																			<input
																				type={field.type}
																				id={field.name}
																				name={field.name}
																				value={String(
																					formik.values[
																						field.name as keyof UserIEFormData
																					] || ""
																				)}
																				onChange={formik.handleChange}
																				onBlur={formik.handleBlur}
																				className={`form-control text-${
																					language === "fa" ? "end" : "start"
																				} shadow-sm ${
																					formik.touched[
																						field.name as keyof UserIEFormData
																					] &&
																					formik.errors[
																						field.name as keyof UserIEFormData
																					]
																						? "is-invalid"
																						: ""
																				}`}
																				required={field.required}
																				disabled={
																					!!formik.values[
																						field.checkboxName as keyof UserIEFormData
																					]
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
																						!!formik.values[
																							field.checkboxName as keyof UserIEFormData
																						] || false
																					}
																					onChange={(e) => {
																						formik.setFieldValue(
																							field.checkboxName,
																							e.target.checked
																						);

																						if (e.target.checked) {
																							formik.setFieldValue(
																								field.name,
																								""
																							);
																						}
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
																		{formik.touched[
																			field.name as keyof UserIEFormData
																		] &&
																			formik.errors[
																				field.name as keyof UserIEFormData
																			] && (
																				<div className="invalid-feedback">
																					{String(
																						formik.errors[
																							field.name as keyof UserIEFormData
																						]
																					)}
																				</div>
																			)}
																	</div>
																);
															})}
													</div>
												</div>
											</div>
										</div>
									)
								);
							}
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
