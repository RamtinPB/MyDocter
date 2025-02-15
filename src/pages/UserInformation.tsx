import { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import "/src/cssFiles/customColors.css";
import "/src/cssFiles/userInformation.css";
import axiosInstance from "../myAPI/axiosInstance";
import { useLanguage } from "../components/LanguageContext";
import { useProfile } from "../components/ProfileContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

interface insuranceDataProps {
	id: number;
	companyName: string;
	companyNameEN: string;
	type: number;
	discountPercentage: number;
}

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
	required: boolean;
	enabled: boolean;

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
		enabled: field.boolean,
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
	fixedPhoneNumber: string;
	email: string;
	gender: string;
	insuranceType: string | null;
	insuranceId: number | null;
	supplementaryInsuranceType: string | null;
	supplementalInsuranceId: number | null;
	nationalCode: string | null;
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
	fixedPhoneNumber: "",
	email: "",
	gender: "",
	insuranceType: "",
	insuranceId: 0,
	supplementaryInsuranceType: "",
	supplementalInsuranceId: 0,
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
	if (isIranian === "ایرانی" || isIranian === "Iranian") return true;
	if (isIranian === "غیر ایرانی" || isIranian === "non-Iranian") return false;
	return Boolean(isIranian);
}

function convertIsIranianToString(
	isIranian: boolean | undefined,
	language: string
): string {
	if (isIranian === true) return language === "fa" ? "ایرانی" : "Iranian";
	if (isIranian === false)
		return language === "fa" ? "غیر ایرانی" : "non-Iranian";
	return "";
}

function convertIsMarriedToBoolean(
	isMarried: string | boolean | undefined
): boolean {
	if (isMarried === "متاهل" || isMarried === "Engaged") return true;
	if (isMarried === "مجرد" || isMarried === "Single") return false;
	return Boolean(isMarried);
}

function convertIsMarriedToString(
	isMarried: boolean | undefined,
	language: string
): string {
	if (isMarried === true) return language === "fa" ? "متاهل" : "Engaged";
	if (isMarried === false) return language === "fa" ? "مجرد" : "Single";
	return "";
}

function handleConditionalEmptyFields(values: UserFormData): UserFormData {
	if (values.noInsurance) values.insuranceType = null;
	if (values.noNationalCode) values.nationalCode = null;
	if (values.noSupplementaryInsurance)
		values.supplementaryInsuranceType = null;
	return values;
}

function handleConditionalEmptyFieldsForFront(
	values: UserFormData
): UserFormData {
	if (values.insuranceType === "") values.noInsurance = true;
	if (values.nationalCode === "") values.noNationalCode = true;
	if (values.supplementaryInsuranceType === "")
		values.noSupplementaryInsurance = true;
	return values;
}

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

function convertGenderToFrontData(gender: string, language: string): string {
	if (gender === "Male") return language === "fa" ? "مرد" : "Male";
	if (gender === "Female") return language === "fa" ? "زن" : "Female";
	if (gender === "Other") return "";
	return "";
}

function convertGenderToEnum(gender: string): string {
	if (gender === "مرد" || gender === "Male") return "Male";
	if (gender === "زن" || gender === "Female") return "Female";
	if (gender === "") return "Other";
	return "";
}

function convertEducationLevelToEnum(educationLevel: string): string {
	if (educationLevel === "بی سواد" || educationLevel === "None")
		return "None";
	if (educationLevel === "ابتدایی" || educationLevel === "Primary")
		return "Primary";
	if (educationLevel === "دیپلم" || educationLevel === "Diploma")
		return "Diploma";
	if (educationLevel === "کاردانی" || educationLevel === "Associate")
		return "Associate";
	if (educationLevel === "کارشناسی" || educationLevel === "Bachelor")
		return "Bachelor";
	if (educationLevel === "کارشناسی ارشد" || educationLevel === "Master")
		return "Master";
	if (educationLevel === "دکترا" || educationLevel === "PHD") return "PHD";
	if (educationLevel === "فوق دکترا" || educationLevel === "PostDoc")
		return "PostDoc";
	return "";
}

function convertEducationLevelToFrontData(
	educationLevel: string,
	language: string
): string {
	if (educationLevel === "None")
		return language === "fa" ? "بی سواد" : "None";
	if (educationLevel === "Primary")
		return language === "fa" ? "ابتدایی" : "Primary";
	if (educationLevel === "Diploma")
		return language === "fa" ? "دیپلم" : "Diploma";
	if (educationLevel === "Associate")
		return language === "fa" ? "کاردانی" : "Associate";
	if (educationLevel === "Bachelor")
		return language === "fa" ? "کارشناسی" : "Bachelor";
	if (educationLevel === "Master")
		return language === "fa" ? "کارشناسی ارشد" : "Master";
	if (educationLevel === "PHD") return language === "fa" ? "دکترا" : "PHD";
	if (educationLevel === "PostDoc")
		return language === "fa" ? "فوق دکترا" : "PostDoc";
	return "";
}

const updateFormFieldsWithInsuranceData = (
	formFields: any[],
	insuranceData: insuranceDataProps[]
) => {
	// Separate insurance data by type
	const type0Data = insuranceData.filter((item) => item.type === 0);
	const type1Data = insuranceData.filter((item) => item.type === 1);

	// Update options for insuranceType and supplementaryInsuranceType
	return formFields.map((field) => {
		if (field.name === "insuranceType") {
			return {
				...field,
				options: type0Data.map((item) => item.companyName).join(","),
				optionsEN: type0Data
					.map((item) => item.companyNameEN)
					.join(","),
			};
		}
		if (field.name === "supplementaryInsuranceType") {
			return {
				...field,
				options: type1Data.map((item) => item.companyName).join(","),
				optionsEN: type1Data
					.map((item) => item.companyNameEN)
					.join(","),
			};
		}
		return field;
	});
};

const getInsuranceIdByName = (
	insuranceType: string | null,
	insuranceData: insuranceDataProps[]
): number | null => {
	if (!insuranceType) return null;

	const match = insuranceData.find(
		(data) =>
			data.companyName === insuranceType ||
			data.companyNameEN === insuranceType
	);

	return match ? match.id : null;
};

const getInsuranceNameById = (
	insuranceId: number | null,
	insuranceData: insuranceDataProps[],
	language: string
): string | null => {
	if (insuranceId === null || !insuranceData.length) return null;

	const match = insuranceData.find((data) => data.id === insuranceId);

	if (!match) return null;

	// Return the appropriate name based on the language
	return language === "fa" ? match.companyName : match.companyNameEN;
};

function UserInformation() {
	const [formFields, setFormFields] = useState<any[]>([]);
	const [validationSchemaData, setValidationSchemaData] = useState<any[]>([]);

	const [insuranceData, setInsuranceData] = useState<insuranceDataProps[]>(
		[]
	);

	const { loginState } = useAuth();

	const { language, isLanguageReady } = useLanguage(); // Get language and toggle function from context
	const { triggerImageUpdate } = useProfile();

	const [dataUpdateFlag, setDataUpdateFlag] = useState(false);
	const [profileImageUpdateFlag, setProfileImageUpdateFlag] = useState(false);

	const [profilePicture, setProfilePicture] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const navigate = useNavigate();
	const handleBackClick = () => navigate("/");

	useEffect(() => {
		axiosInstance
			.post("/api/Service/GetInsurances")
			.then((response) => {
				const data = response.data;
				setInsuranceData(data);

				setDataUpdateFlag((prev) => !prev);
			})
			.catch((error) => {
				console.error(
					"API request failed, trying local db.json",
					error
				);

				fetch("/Insurances.json")
					.then((response) => response.json())
					.then((data) => {
						setInsuranceData(data);

						setDataUpdateFlag((prev) => !prev);
					})
					.catch((jsonError) => {
						console.error(
							"Failed to fetch data from both API and db.json",
							jsonError
						);

						setDataUpdateFlag((prev) => !prev);
					});
			});
	}, []);

	// fetch user data
	useEffect(() => {
		if (dataUpdateFlag && isLanguageReady) {
			axiosInstance
				.post("/api/User/GetUserData") // Call the API to get user data
				.then((response) => {
					const data = response.data;

					// Use getInsuranceNameById to map insuranceId and supplementalInsuranceId to names
					const insuranceName = getInsuranceNameById(
						data.insuranceId,
						insuranceData,
						language
					);
					const supplementaryInsuranceName = getInsuranceNameById(
						data.supplementalInsuranceId,
						insuranceData,
						language
					);

					const formattedData = {
						...data,
						...handleConditionalEmptyFieldsForFront(data),
						isIranian: convertIsIranianToString(
							data.isIranian,
							language
						),
						isMarried: convertIsMarriedToString(
							data.isMarried,
							language
						),
						profilePicture: data.profileImageUrl,
						birthdate: formatBirthdateToYYYYMMDD(data.birthdate),
						gender: convertGenderToFrontData(data.gender, language),
						educationLevel: convertEducationLevelToFrontData(
							data.educationLevel,
							language
						),
						insuranceType: (insuranceName as string) || "",
						supplementaryInsuranceType:
							(supplementaryInsuranceName as string) || "",
					};

					// Populate form fields with the formatted response
					formik.setValues(formattedData);
				})
				.catch(async (error) => {
					console.error(
						"API request for user data failed, trying local db.json",
						error
					);
					try {
						const response = await fetch("/UserInformation.json"); // Adjust path if necessary
						if (!response.ok) {
							throw new Error(
								"Failed to fetch data from db.json"
							);
						}
						const data = await response.json();

						// Use getInsuranceNameById to map insuranceId and supplementalInsuranceId to names
						const insuranceName = getInsuranceNameById(
							data.insuranceId,
							insuranceData,
							language
						);
						const supplementaryInsuranceName = getInsuranceNameById(
							data.supplementalInsuranceId,
							insuranceData,
							language
						);

						const formattedData = {
							...data,
							...handleConditionalEmptyFieldsForFront(data),
							isIranian: convertIsIranianToString(
								data.isIranian,
								language
							),
							isMarried: convertIsMarriedToString(
								data.isMarried,
								language
							),
							profilePicture: data.profileImageUrl,
							birthdate: formatBirthdateToYYYYMMDD(
								data.birthdate
							),
							gender: convertGenderToFrontData(
								data.gender,
								language
							),
							educationLevel: convertEducationLevelToFrontData(
								data.educationLevel,
								language
							),
							insuranceType: (insuranceName as string) || "",
							supplementaryInsuranceType:
								(supplementaryInsuranceName as string) || "",
						};

						// Populate form fields with the formatted response
						formik.setValues(formattedData);
					} catch (jsonErr) {
						console.error(
							"Failed to fetch data from both API and db.json",
							jsonErr
						);
					}
				});
		}
	}, [dataUpdateFlag, isLanguageReady]);

	// Assuming that formData comes as a single structure from the API
	useEffect(() => {
		if (dataUpdateFlag) {
			axiosInstance
				.post("/api/User/GetUserDataFormFields") // API call for form data and validation
				.then((response) => {
					const data = response.data;

					const {
						formFieldsProps: newFormFields,
						validationSchemaData: newValidationSchemaData,
					} = processData(data);

					// Update form fields with insurance data
					const updatedFormFields = updateFormFieldsWithInsuranceData(
						newFormFields,
						insuranceData
					);

					setFormFields(updatedFormFields);
					setValidationSchemaData(newValidationSchemaData);
				})
				.catch(async (error) => {
					console.error(
						"API request failed, trying local db.json",
						error
					);
					try {
						const response = await fetch(
							"/UserInformationFormFields.json"
						); // Adjust path if necessary
						if (!response.ok) {
							throw new Error(
								"Failed to fetch data from db.json"
							);
						}
						const data = await response.json();

						const {
							formFieldsProps: newFormFields,
							validationSchemaData: newValidationSchemaData,
						} = processData(data);

						// Update form fields with insurance data
						const updatedFormFields =
							updateFormFieldsWithInsuranceData(
								newFormFields,
								insuranceData
							);

						setFormFields(updatedFormFields);
						setValidationSchemaData(newValidationSchemaData);
					} catch (jsonErr) {
						console.error(
							"Failed to fetch data from both API and db.json",
							jsonErr
						);
					}
				});
		}
	}, [dataUpdateFlag]);

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
					new RegExp(
						language === "fa" ? rule.matches : rule.matchesEN
					),
					language === "fa"
						? rule.matchesMessage
						: rule.matchesMessageEN
				);
			}
			if (rule.name === "email") {
				fieldSchema = (fieldSchema as Yup.StringSchema).email(
					language === "fa"
						? rule.matchesMessage
						: rule.matchesMessageEN
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
							otherwiseSchema = (
								otherwiseSchema as Yup.StringSchema
							).matches(
								new RegExp(
									language === "fa"
										? rule.matches
										: rule.matchesEN
								),
								language === "fa"
									? rule.matchesMessage
									: rule.matchesMessageEN
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
						language === "fa"
							? rule.requiredMessage
							: rule.requiredMessageEN
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
			const insuranceId = getInsuranceIdByName(
				values.insuranceType,
				insuranceData
			);
			const supplementalInsuranceId = getInsuranceIdByName(
				values.supplementaryInsuranceType,
				insuranceData
			);

			const updatedData: UserFormData = {
				...handleConditionalEmptyFields(values),
				isIranian: convertIsIranianToBoolean(values.isIranian),
				isMarried: convertIsMarriedToBoolean(values.isMarried),
				gender: convertGenderToEnum(values.gender),
				educationLevel: convertEducationLevelToEnum(
					values.educationLevel
				),
				insuranceId,
				supplementalInsuranceId,
			};

			try {
				// Send the transformed data to the update API
				await axiosInstance.post(
					"/api/User/UpdateUserData",
					updatedData
				);
				alert(
					language === "fa"
						? "اطلاعات کاربر بروزرسانی شد"
						: "User information updated successfully"
				);
				alert(
					language === "fa"
						? "لطفا فرم ارزیابی اولیه را تکمیل کنید"
						: "Please fill the Initial Evaluation Form"
				);
				navigate("/UserIEInformation");
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

	useEffect(() => {
		axiosInstance
			.post("/api/User/GetProfileImage", {}, { responseType: "blob" }) // Specify blob as the response type
			.then((response) => {
				const imageBlob = response.data; // Binary image data
				const imageUrl = URL.createObjectURL(imageBlob); // Create a URL for the image
				setProfilePicture(imageUrl); // Set the profile picture state
			})
			.catch(async (error) => {
				console.error(
					"API request failed, trying local db.json",
					error
				);
				try {
					const response = await fetch("/ProfileImage.json"); // Adjust path if necessary
					if (!response.ok) {
						throw new Error("Failed to fetch data from db.json");
					}
					const data = await response.json();
					setProfilePicture(data);
				} catch (jsonErr) {
					console.error(
						"Failed to fetch data from both API and db.json",
						jsonErr
					);
					setProfilePicture(null);
				}
			});
	}, [profileImageUpdateFlag]);

	// Clean up the object URL when the component unmounts
	useEffect(() => {
		return () => {
			if (profilePicture) {
				URL.revokeObjectURL(profilePicture);
			}
		};
	}, [profilePicture]);

	const handleProfilePictureChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];

			if (selectedFile.size > 2 * 1024 * 1024) {
				console.error("File is too large. Max size is 2MB.");
				return;
			}
			if (
				!["image/png", "image/jpeg", "image/jpg"].includes(
					selectedFile.type
				)
			) {
				console.error(
					"Invalid file type. Only PNG, JPEG, and JPG are allowed."
				);
				return;
			}

			// Revoke the previous object URL before creating a new one
			if (profilePicture) {
				URL.revokeObjectURL(profilePicture);
			}

			// Update the profile picture preview
			setProfilePicture(URL.createObjectURL(selectedFile));

			// Reset the file input value to allow re-selection of the same file
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}

			// Prepare FormData for API upload
			const formData = new FormData();
			formData.append("file", selectedFile);

			try {
				// Upload profile picture
				await axiosInstance.post(
					"/api/File/UploadProfileImage",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
						withCredentials: true,
					}
				);
				triggerImageUpdate();
				setProfileImageUpdateFlag((prev) => !prev);

				alert(
					language === "fa"
						? "ارسال عکس با موفقیت انجام شد"
						: "Profile picture uploaded."
				);
			} catch (error) {
				console.error("Error uploading profile picture:", error);
				alert(
					language === "fa"
						? "خطا در ارسال عکس"
						: "Profile picture upload failed."
				);
			}
		}
	};

	const handleDeleteProfilePicture = async () => {
		try {
			await axiosInstance.post("/api/File/RemoveProfileImage", {
				withCredentials: true,
			});
			if (profilePicture) {
				URL.revokeObjectURL(profilePicture); // Revoke object URL
			}
			setProfilePicture(null); // Clear local state

			triggerImageUpdate();
			setProfileImageUpdateFlag((prev) => !prev);
			alert(
				language === "fa"
					? "عکس با موفقیت حذف شد."
					: "Picture removed successfully."
			);
		} catch (error) {
			console.error("Error removing profile picture:", error);
			alert(
				language === "fa"
					? "خطا در حذف عکس"
					: "Profile picture removal failed."
			);
		}
	};

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		loginState && (
			<div className="custom-bg-4 min-vh-100">
				<div className="container d-flex flex-column">
					<form
						onSubmit={formik.handleSubmit}
						className="mt-4 mt-md-5"
					>
						<div className="custom-bg-1 d-flex justify-content-around rounded-5 shadow p-3 mb-4">
							<button
								type="button"
								className="btn btn-light shadow rounded-pill  my-auto"
								onClick={handleDeleteProfilePicture}
							>
								<span>
									{language === "fa"
										? "حذف عکس"
										: "Delete Picture"}
								</span>
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
								<span>
									{language === "fa"
										? "انتخاب عکس"
										: "Upload Picture"}
								</span>
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
							<h2>
								{language === "fa"
									? "اطلاعات کاربر"
									: "User Information"}
							</h2>
							<div
								className="row row-cols-2 g-4 g-md-5 my-1"
								style={{
									direction:
										language === "fa" ? "rtl" : "ltr",
								}}
							>
								{formFields.map((field, index) => {
									const isSelect = field.type === "select";
									const isCheckbox = field.checkboxName;

									return (
										(field.enabled === true ||
											field.enabled === null ||
											field.enabled === undefined) && (
											<div
												key={index}
												className="col mb-2"
												style={{
													direction:
														language === "fa"
															? "rtl"
															: "ltr",
												}}
											>
												<label
													htmlFor={field.name}
													className="form-label"
												>
													{language === "fa"
														? field.label
														: field.labelEN}
													<span className="text-danger">
														{field.required && "*"}
													</span>
												</label>
												{isSelect ? (
													<select
														id={field.name}
														name={field.name}
														value={String(
															formik.values[
																field.name as keyof UserFormData
															] || ""
														)}
														onChange={
															formik.handleChange
														}
														onBlur={
															formik.handleBlur
														}
														className={`form-select select-resize text-${
															language === "fa"
																? "end"
																: "start"
														} shadow-sm ${
															formik.touched[
																field.name as keyof UserFormData
															] &&
															formik.errors[
																field.name as keyof UserFormData
															]
																? "is-invalid"
																: ""
														}`}
														required={
															field.required
														}
														disabled={
															!!formik.values[
																field.checkboxName as keyof UserFormData
															]
														}
													>
														<option value="">
															...
														</option>
														{(language === "fa"
															? field.options
															: field.optionsEN
														)
															.split(",")
															.map(
																(
																	option: string,
																	i: number
																) => (
																	<option
																		key={i}
																		value={
																			option
																		}
																	>
																		{option}
																	</option>
																)
															)}
													</select>
												) : (
													<input
														type={field.type}
														id={field.name}
														name={field.name}
														value={String(
															formik.values[
																field.name as keyof UserFormData
															] || ""
														)}
														onChange={
															formik.handleChange
														}
														onBlur={
															formik.handleBlur
														}
														className={`form-control text-${
															language === "fa"
																? "end"
																: "start"
														} shadow-sm ${
															formik.touched[
																field.name as keyof UserFormData
															] &&
															formik.errors[
																field.name as keyof UserFormData
															]
																? "is-invalid"
																: ""
														}`}
														required={
															field.required
														}
														disabled={
															!!formik.values[
																field.checkboxName as keyof UserFormData
															]
														}
														placeholder={
															(language === "fa"
																? field.placeholder
																: field.placeholderEN) ||
															""
														}
													/>
												)}
												{isCheckbox && (
													<div
														className={`text-${
															language === "fa"
																? "end"
																: "start"
														} mt-2`}
													>
														<label
															htmlFor={
																field.checkboxName
															}
															className="form-check-label mx-2"
														>
															{language === "fa"
																? field.checkboxLabel
																: field.checkboxLabelEN}
														</label>
														<input
															type="checkbox"
															id={
																field.checkboxName
															}
															name={
																field.checkboxName
															}
															checked={Boolean(
																formik.values[
																	field.checkboxName as keyof UserFormData
																]
															)}
															onChange={(e) => {
																formik.setFieldValue(
																	field.checkboxName,
																	e.target
																		.checked
																);
															}}
															className="form-check-input shadow-sm"
														/>
													</div>
												)}
												{formik.touched[
													field.name as keyof UserFormData
												] &&
													formik.errors[
														field.name as keyof UserFormData
													] && (
														<div className="invalid-feedback">
															{
																formik.errors[
																	field.name as keyof UserFormData
																] as string
															}
														</div>
													)}
											</div>
										)
									);
								})}
							</div>
							<div className="d-flex flex-column justify-content-center align-items-center gap-4 mt-4 mt-md-5">
								<button
									type="submit"
									className="btn btn-primary rounded-pill px-3 py-2"
									style={{ width: "fit-content" }}
								>
									{language === "fa" ? "ذخیره" : "Save"}
								</button>
								<button
									type="button"
									className="btn btn-warning rounded-pill px-3 py-2"
									onClick={() => handleBackClick()}
									style={{ width: "fit-content" }}
								>
									{language === "fa"
										? "بازگشت به صفحه اصلی"
										: "Go Back to Home Page"}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		)
	);
}

export default UserInformation;
