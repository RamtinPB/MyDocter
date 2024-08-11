import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../cssFiles/customColors.css";

interface UserFormData {
	[key: string]: any;
}

const initialFormData: UserFormData = {};

function UserInformation() {
	const [formFields, setFormFields] = useState<any[]>([]);
	const [profilePicture, setProfilePicture] = useState<string | null>(null);
	const [validationSchemaData, setValidationSchemaData] = useState<any[]>([]);

	useEffect(() => {
		axios
			.get("http://localhost:3001/userInfo")
			.then((response) => {
				formik.setValues(response.data);
				if (response.data.profilePicture) {
					setProfilePicture(response.data.profilePicture);
				}
			})
			.catch((error) => {
				console.error("Error fetching user data:", error);
			});
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:3001/formFields")
			.then((response) => {
				setFormFields(response.data);
			})
			.catch((error) => {
				console.error("Error fetching form fields:", error);
			});
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:3001/validationSchemaData")
			.then((response) => {
				setValidationSchemaData(response.data);
			})
			.catch((error) => {
				console.error("Error fetching custom validation schema:", error);
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
				.post("http://localhost:3001/submit", values)
				.then((response) => {
					console.log("User information updated successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error updating user information:", error);
				});
		},
		validateOnBlur: true,
		validateOnChange: true,
	});

	const handleProfilePictureChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files && e.target.files[0]) {
			setProfilePicture(URL.createObjectURL(e.target.files[0]));

			const formData = new FormData();
			formData.append("profilePicture", e.target.files[0]);

			axios
				.post("/api/upload-profile-picture", formData)
				.then((response) => {
					console.log("Profile picture uploaded successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error uploading profile picture:", error);
				});
		}
	};

	return (
		<div className="custom-bg-4">
			<div className="container d-flex flex-column">
				<form onSubmit={formik.handleSubmit} className="mt-5">
					<div className="custom-bg-1 d-flex justify-content-evenly rounded-5 shadow gap-5 mb-4">
						<div>
							<button
								type="button"
								className="btn btn-light btn-sm shadow rounded-pill px-1 py-2 my-4"
								style={{ width: "150px" }}
								onClick={() => setProfilePicture(null)}
							>
								حذف عکس
							</button>
						</div>
						<div>
							{profilePicture ? (
								<img
									src={profilePicture}
									alt="Profile"
									className="rounded-circle border border-3 border-light my-4"
									style={{ width: "200px", height: "200px" }}
								/>
							) : (
								<FaUser
									className=" rounded-circle border border-3 border-light p-3 my-4"
									style={{ width: "200px", height: "200px" }}
									color="white"
								/>
							)}
						</div>
						<div>
							<label
								className="btn btn-light btn-sm shadow rounded-pill px-1 py-2 my-4"
								style={{ cursor: "pointer", width: "150px" }}
							>
								انتخاب عکس
								<input
									type="file"
									accept="image/*"
									onChange={handleProfilePictureChange}
									style={{ display: "none" }}
								/>
							</label>
						</div>
					</div>
				</form>
				<form
					onSubmit={formik.handleSubmit}
					className="needs-validation"
					noValidate
				>
					<div className="text-end bg-white shadow rounded-5 px-5 py-5 mb-3">
						<h2>اطلاعات کاربر</h2>
						<div
							className="row row-cols-2 g-5 my-1"
							style={{ direction: "rtl" }}
						>
							{formFields.map((field, index) => {
								const isSelect = field.type === "select";
								const isCheckbox = field.checkboxName;

								return (
									<div
										key={index}
										className="col mb-2"
										style={{ direction: "ltr" }}
									>
										<label htmlFor={field.name} className="form-label">
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
												disabled={formik.values[field.checkboxName]}
											>
												<option value="">...</option>
												{field.options.map((option: string, i: number) => (
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
												className={`form-control text-end shadow-sm ${
													formik.touched[field.name] &&
													formik.errors[field.name]
														? "is-invalid"
														: ""
												}`}
												required={field.required}
												disabled={formik.values[field.checkboxName]}
												placeholder={field.placeholder || ""}
											/>
										)}
										{isCheckbox && (
											<div className="text-end mt-2">
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
							})}
						</div>
						<div className="d-flex justify-content-center mt-5">
							<button
								type="submit"
								className="btn btn-primary rounded-pill px-3 py-2"
							>
								ذخیره
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default UserInformation;
