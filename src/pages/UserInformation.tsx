import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import "/src/cssFiles/customColors.css";
import "/src/cssFiles/userInformation.css";
import axiosInstance from "../myAPI/axiosInstance";
import { useLanguage } from "../components/LanguageContext";

interface UserFormData {
	[key: string]: any;
}

const initialFormData: UserFormData = {};

function UserInformation() {
	const [formFields, setFormFields] = useState<any[]>([]);

	const [profilePicture, setProfilePicture] = useState<string | null>(null);

	const [validationSchemaData, setValidationSchemaData] = useState<any[]>([]);

	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		axiosInstance
			.post("/api/User/GetUserData") // Call the API to get user data
			.then((response) => {
				const data = response.data;

				// Populate form fields with API response
				formik.setValues({
					...data,
					profilePicture: data.profileImageUrl,
				});

				// Set profile picture if available
				if (data.profileImageUrl) {
					setProfilePicture(data.profileImageUrl);
				}
			})
			.catch((error) => {
				console.error("API request failed, trying local db.json", error);

				// Fetch from local db.json if API fails
				fetch("/db.json")
					.then((response) => {
						if (!response.ok) {
							throw new Error("Failed to fetch data from db.json");
						}
						return response.json();
					})
					.then((data) => {
						// Update state for validation schema data (if any)
						setValidationSchemaData(data.validationSchemaData);

						// Update state for form fields
						setFormFields(data.formFields);

						// Update form values with user info from db.json
						formik.setValues(data.userInfo);

						// Set profile picture if available
						if (data.userInfo.profilePicture) {
							setProfilePicture(data.userInfo.profilePicture);
						}
					})
					.catch((jsonError) => {
						console.error(
							"Failed to fetch data from both API and db.json",
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
				.post("/api/User/UpdateUserData", values)
				.then((response) =>
					console.log("User information updated:", response.data)
				)
				.catch((error) => console.error("Error updating user info:", error));
		},
		validateOnBlur: true,
		validateOnChange: true,
	});

	const handleProfilePictureChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files && e.target.files[0]) {
			setProfilePicture(URL.createObjectURL(e.target.files[0])); // Show preview

			const formData = new FormData();
			formData.append("profilePicture", e.target.files[0]);

			axios
				.post("/api/upload-profile-picture", formData)
				.then((response) =>
					console.log("Profile picture uploaded:", response.data)
				)
				.catch((error) =>
					console.error("Error uploading profile picture:", error)
				);
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
							style={{ cursor: "pointer" }}
						>
							<span>{language === "fa" ? "انتخاب عکس" : "Upload Picture"}</span>
							<input
								type="file"
								accept="image/*"
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
												value={formik.values[field.name]}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												className={`form-select select-resize text-${
													language === "fa" ? "end" : "start"
												} shadow-sm ${
													formik.touched[field.name] &&
													formik.errors[field.name]
														? "is-invalid"
														: ""
												}`}
												required={field.required}
												disabled={formik.values[field.checkboxName]}
											>
												<option value="">...</option>
												{(language === "fa"
													? field.options
													: field.optionsEN
												).map((option: string, i: number) => (
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
												disabled={formik.values[field.checkboxName]}
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
													checked={Boolean(formik.values[field.checkboxName])}
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
										{formik.touched[field.name] &&
											formik.errors[field.name] && (
												<div className="invalid-feedback">
													{formik.errors[field.name] as string}
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
