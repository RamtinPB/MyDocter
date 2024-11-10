import { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import "/src/cssFiles/customColors.css";
import "/src/cssFiles/userInformation.css";
import axiosInstance from "../myAPI/axiosInstance";
import { useLanguage } from "../components/LanguageContext";

// Define a type for the relevant fields to filter
interface validationSchemaDataProps {
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

interface formFieldsProps {
	name: string;
	type: string;
	required: string;

	label: string;
	labelEN: string;

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
	formFieldsProps: formFieldsProps[];
	validationSchemaData: validationSchemaDataProps[];
} => {
	const formFields: formFieldsProps[] = data.map((field) => ({
		name: field.name,
		type: field.type,
		required: field.required, // Assuming this is already a boolean
		label: field.label,
		labelEN: field.labelEN,
		options: field.options, // Assuming options might be an array
		optionsEN: field.optionsEN, // Assuming optionsEN might be an array
		checkboxName: field.checkboxName,
		checkboxLabel: field.checkboxLabel,
		checkboxLabelEN: field.checkboxLabelEN,
	}));

	const validationSchemaData: validationSchemaDataProps[] = data
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

interface UserFormData {
	name: string;
	lastName: string;
	phoneNumber: string;
	email: string;
	gender: string;
	insuranceType: string;
	supplementaryInsuranceType: string;
	nationalCode: string;
	isIranian: string | boolean;
	isMarried: string | boolean;
	noInsurance: boolean;
	noNationalCode: boolean;
	noSupplementaryInsurance: boolean;
	residenceProvince: string;
	residenceCity: string;
	residenceAddress: string;
	residencePostalCode: string;
	educationLevel: string;
	birthdate: string;
}

const initialFormData: UserFormData = {
	name: "",
	lastName: "",
	phoneNumber: "",
	email: "",
	gender: "",
	insuranceType: "",
	supplementaryInsuranceType: "",
	nationalCode: "",
	isIranian: "",
	isMarried: "",
	noInsurance: false,
	noNationalCode: false,
	noSupplementaryInsurance: false,
	residenceProvince: "",
	residenceCity: "",
	residenceAddress: "",
	residencePostalCode: "",
	educationLevel: "",
	birthdate: "",
};

function convertIsIranianToBoolean(
	isIranian: string | boolean | undefined
): boolean {
	if (isIranian === "ایرانی") return true;
	if (isIranian === "غیر ایرانی") return false;
	return Boolean(isIranian);
}

function convertIsMarriedToBoolean(
	isMarried: string | boolean | undefined
): boolean {
	if (isMarried === "متاهل") return true;
	if (isMarried === "مجرد") return false;
	return Boolean(isMarried);
}

function convertIsIranianToString(isIranian: boolean | undefined): string {
	if (isIranian === true) return "ایرانی";
	if (isIranian === false) return "غیر ایرانی";
	return "";
}

function convertIsMarriedToString(isMarried: boolean | undefined): string {
	if (isMarried === true) return "متاهل";
	if (isMarried === false) return "مجرد";
	return "";
}

function handleConditionalEmptyFields(values: UserFormData): UserFormData {
	if (values.noInsurance) values.insuranceType = "";
	if (values.noNationalCode) values.nationalCode = "";
	if (values.noSupplementaryInsurance) values.supplementaryInsuranceType = "";
	return values;
}

// function handleConditionalEmptyFieldsForFront(
// 	values: UserFormData
// ): UserFormData {
// 	if (values.insuranceType === "" || values.insuranceType === null)
// 		values.noInsurance = true;
// 	if (values.nationalCode === "" || values.nationalCode === null)
// 		values.noNationalCode = true;
// 	if (
// 		values.supplementaryInsuranceType === "" ||
// 		values.supplementaryInsuranceType === null
// 	)
// 		values.noSupplementaryInsurance = true;
// 	return values;
// }

function formatBirthdateToYYYYMMDD(birthdate: string): string {
	// Check if the birthdate is in a valid format, otherwise return an empty string
	if (!birthdate) return "";

	try {
		// Convert the birthdate to a Date object and format as "YYYY-MM-DD"
		return new Date(birthdate).toISOString().split("T")[0];
	} catch (error) {
		console.error("Invalid birthdate format:", birthdate);
		return "";
	}
}

function convertGenderToFrontData(gender: string): string {
	if (gender === "Male") return "مرد";
	if (gender === "Female") return "زن";
	if (gender === "Other") return "";
	return "";
}

function convertGenderToEnum(gender: string): string {
	if (gender === "مرد") return "Male";
	if (gender === "زن") return "Female";
	if (gender === "") return "Other";
	return "";
}

function convertEducationLevelToEnum(educationLevel: string): string {
	if (educationLevel === "کم سواد") return "None";
	if (educationLevel === "ابتدایی") return "Primary";
	if (educationLevel === "دیپلم") return "Diploma";
	if (educationLevel === "کاردانی") return "Associate";
	if (educationLevel === "کارشناسی") return "Bachelor";
	if (educationLevel === "کارشناسی ارشد") return "Master";
	if (educationLevel === "دکترا") return "PHD";
	if (educationLevel === "فوق دکترا") return "PostDoc";
	return "";
}

function convertEducationLevelToFrontData(educationLevel: string): string {
	if (educationLevel === "None") return "کم سواد";
	if (educationLevel === "Primary") return "ابتدایی";
	if (educationLevel === "Diploma") return "دیپلم";
	if (educationLevel === "Associate") return "کاردانی";
	if (educationLevel === "Bachelor") return "کارشناسی";
	if (educationLevel === "Master") return "کارشناسی ارشد";
	if (educationLevel === "PHD") return "دکترا";
	if (educationLevel === "PostDoc") return "فوق دکترا";
	return "";
}

function UserInformation() {
	const [formFields, setFormFields] = useState<any[]>([]);
	const [validationSchemaData, setValidationSchemaData] = useState<any[]>([]);

	const [profilePicture, setProfilePicture] = useState<string | null>(null);
	const { language } = useLanguage(); // Get language and toggle function from context

	const fileInputRef = useRef<HTMLInputElement>(null);

	// fetch user data
	useEffect(() => {
		axiosInstance
			.post("/api/User/GetUserData") // Call the API to get user data
			.then((response) => {
				const data = response.data;
				console.log(data);

				// Populate form fields with API response
				// Convert `isIranian` and `isMarried` booleans to strings
				const formattedData = {
					...data,
					//...handleConditionalEmptyFieldsForFront(data),
					isIranian: convertIsIranianToString(data.isIranian),
					isMarried: convertIsMarriedToString(data.isMarried),
					profilePicture: data.profileImageUrl,
					birthdate: formatBirthdateToYYYYMMDD(data.birthdate),
					gender: convertGenderToFrontData(data.gender),
					educationLevel: convertEducationLevelToFrontData(data.educationLevel),
				};

				// Populate form fields with the formatted response
				formik.setValues(formattedData);

				// Set profile picture if available
				if (data.profileImageUrl) {
					setProfilePicture(data.profileImageUrl);
				}
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
						// Update form values with user info from db.json
						formik.setValues(data.userInfo);

						// Set profile picture if available
						if (data.userInfo.profilePicture) {
							setProfilePicture(data.userInfo.profilePicture);
						}
					})
					.catch((jsonError) => {
						console.error(
							"Failed to fetch user data from both API and db.json",
							jsonError
						);
					});
			});
	}, []);

	// Assuming that formData comes as a single structure from the API
	useEffect(() => {
		axiosInstance
			.post("/api/User/GetUserDataFormFields") // API call for form data and validation
			.then((response) => {
				const data = response.data;

				const {
					formFieldsProps: newFormFields,
					validationSchemaData: newValidationSchemaData,
				} = processData(data);

				setFormFields(newFormFields);
				setValidationSchemaData(newValidationSchemaData);

				//console.log(newFormFields);
				//console.log(newValidationSchemaData);
			})
			.catch((error) => {
				console.error("API request failed, trying local db.json", error);

				fetch("/db.json")
					.then((response) => response.json())
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
							"Failed to fetch data from both API and db.json",
							jsonError
						);
					});
			});
	}, []);

	// Create the Yup validation schema based on validationSchemaData
	const validationSchema = Yup.object().shape(
		validationSchemaData.reduce((acc, rule) => {
			let fieldSchema: Yup.AnySchema = Yup.mixed();

			// Determine the type of the field
			switch (rule.type) {
				case "text":
					fieldSchema = Yup.string();
					break;
				case "date":
					fieldSchema = Yup.date();
					break;
				case "select":
					fieldSchema = Yup.string();
					break;
				case "email":
					fieldSchema = Yup.string();
					break;
				default:
					fieldSchema = Yup.mixed();
			}

			// Apply common rules
			if (rule.matches && rule.type === "text") {
				fieldSchema = (fieldSchema as Yup.StringSchema).matches(
					new RegExp(language === "fa" ? rule.matches : rule.matchesEN),
					language === "fa" ? rule.matchesMessage : rule.matchesMessageEN
				);
			}
			if (rule.name === "email") {
				fieldSchema = (fieldSchema as Yup.StringSchema).email(
					language === "fa" ? rule.matchesMessage : rule.matchesMessageEN
				);
			}

			// Apply conditional rules
			if (rule.checkboxName) {
				const depField = rule.checkboxName;
				fieldSchema = fieldSchema.when(depField, {
					is: true,
					then: (schema) => {
						let thenSchema = schema;
						thenSchema = thenSchema.notRequired();
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
		validationSchema: validationSchema,

		onSubmit: async (values) => {
			const updatedData: UserFormData = {
				...handleConditionalEmptyFields(values),
				isIranian: convertIsIranianToBoolean(values.isIranian),
				isMarried: convertIsMarriedToBoolean(values.isMarried),
				gender: convertGenderToEnum(values.gender),
				educationLevel: convertEducationLevelToEnum(values.educationLevel),
			};

			try {
				// Send the transformed data to the update API
				await axiosInstance.post("/api/User/UpdateUserData", updatedData);
				console.log("User data updated successfully");
			} catch (error) {
				console.error("Error updating user data:", error);
			}
		},
		validateOnBlur: true,
		validateOnChange: true,
		validateOnMount: true,
	});

	const handleProfilePictureChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];

			// Update the profile picture preview
			setProfilePicture(URL.createObjectURL(selectedFile));

			// Prepare FormData for API upload
			const formData = new FormData();
			formData.append("profilePicture", selectedFile);

			try {
				// Upload profile picture
				const uploadResponse = await axiosInstance.post(
					"/UploadProfileImage",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);

				// Extract the uploaded image URL from the response
				const profileImageUrl = uploadResponse.data.profileImageUrl;

				// Update the user's data with the new profile picture URL
				await axiosInstance.post("/api/User/UpdateUserData", {
					profileImageUrl,
				});

				// Update local profile picture state with the new URL
				setProfilePicture(profileImageUrl);

				console.log(
					"Profile picture uploaded and user data updated successfully."
				);
			} catch (error) {
				console.error("Error uploading profile picture:", error);
			}
		}
	};

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<div className="custom-bg-4 min-vh-100">
			<div className="container d-flex flex-column">
				<form onSubmit={formik.handleSubmit} className="mt-4 mt-md-5">
					<div className="custom-bg-1 d-flex justify-content-around rounded-5 shadow p-3 mb-4">
						<button
							className="btn btn-light shadow rounded-pill  my-auto"
							onClick={() => setProfilePicture(null)}
						>
							<span>{language === "fa" ? "حذف عکس" : "Delete Picture"}</span>
						</button>
						{profilePicture ? (
							<img
								src={profilePicture}
								alt="Profile"
								className="custom-user-icon-pic rounded-circle border border-3 border-light my-auto"
							/>
						) : (
							<FaUser
								className="custom-user-icon-pic rounded-circle border border-3 border-light p-2 p-md-3 my-auto"
								color="white"
							/>
						)}
						<button
							className="btn btn-light shadow rounded-pill my-auto"
							type="button"
							style={{ cursor: "pointer" }}
							onClick={handleButtonClick}
						>
							<span>{language === "fa" ? "انتخاب عکس" : "Upload Picture"}</span>
							<input
								type="file"
								accept="image/*"
								ref={fileInputRef}
								onChange={handleProfilePictureChange}
								style={{ display: "none" }}
							/>
						</button>
					</div>
				</form>
				<form
					onSubmit={formik.handleSubmit}
					className="needs-validation"
					noValidate
				>
					<div
						className={`bg-white text-${
							language === "fa" ? "end" : "start"
						} shadow rounded-5 px-4 px-md-5 py-4 py-md-5 mb-5`}
					>
						<h2>{language === "fa" ? "اطلاعات کاربر" : "User Information"}</h2>
						<div
							className="row row-cols-2 g-4 g-md-5 my-1"
							style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						>
							{formFields.map((field, index) => {
								const isSelect = field.type === "select";
								const isCheckbox = field.checkboxName;

								return (
									<div
										key={index}
										className="col mb-2"
										style={{ direction: language === "fa" ? "rtl" : "ltr" }}
									>
										<label htmlFor={field.name} className="form-label">
											{language === "fa" ? field.label : field.labelEN}
										</label>
										{isSelect ? (
											<select
												id={field.name}
												name={field.name}
												value={String(
													formik.values[field.name as keyof UserFormData] || ""
												)}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												className={`form-select select-resize text-${
													language === "fa" ? "end" : "start"
												} shadow-sm ${
													formik.touched[field.name as keyof UserFormData] &&
													formik.errors[field.name as keyof UserFormData]
														? "is-invalid"
														: ""
												}`}
												required={field.required}
												disabled={
													!!formik.values[
														field.checkboxName as keyof UserFormData
													]
												}
											>
												<option value="">...</option>
												{(language === "fa" ? field.options : field.optionsEN)
													.split(",")
													.map((option: string, i: number) => (
														<option key={i} value={option}>
															{option}
														</option>
													))}
											</select>
										) : (
											<input
												type={field.type}
												id={field.name}
												name={field.name}
												value={String(
													formik.values[field.name as keyof UserFormData] || ""
												)}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												className={`form-control text-${
													language === "fa" ? "end" : "start"
												} shadow-sm ${
													formik.touched[field.name as keyof UserFormData] &&
													formik.errors[field.name as keyof UserFormData]
														? "is-invalid"
														: ""
												}`}
												required={field.required}
												disabled={
													!!formik.values[
														field.checkboxName as keyof UserFormData
													]
												}
												placeholder={
													(language === "fa"
														? field.placeholder
														: field.placeholderEN) || ""
												}
											/>
										)}
										{isCheckbox && (
											<div
												className={`text-${
													language === "fa" ? "end" : "start"
												} mt-2`}
											>
												<label
													htmlFor={field.checkboxName}
													className="form-check-label mx-2"
												>
													{language === "fa"
														? field.checkboxLabel
														: field.checkboxLabelEN}
												</label>
												<input
													type="checkbox"
													id={field.checkboxName}
													name={field.checkboxName}
													checked={Boolean(
														formik.values[
															field.checkboxName as keyof UserFormData
														]
													)}
													onChange={(e) => {
														formik.setFieldValue(
															field.checkboxName,
															e.target.checked
														);
													}}
													className="form-check-input shadow-sm"
												/>
											</div>
										)}
										{formik.touched[field.name as keyof UserFormData] &&
											formik.errors[field.name as keyof UserFormData] && (
												<div className="invalid-feedback">
													{
														formik.errors[
															field.name as keyof UserFormData
														] as string
													}
												</div>
											)}
									</div>
								);
							})}
						</div>
						<div className="d-flex justify-content-center mt-4 mt-md-5">
							<button
								type="submit"
								className="btn btn-primary rounded-pill px-3 py-2"
							>
								{language === "fa" ? "ذخیره" : "Save"}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default UserInformation;
