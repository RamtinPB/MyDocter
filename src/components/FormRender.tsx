import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { useLanguage } from "./LanguageContext";

// Custom FieldTemplate for form layout
const CustomFieldTemplate = ({
	id,
	classNames,
	label,
	help,
	errors,
	children,
}: any) => (
	<div className={`form-group ${classNames} py-1 mb-2`}>
		{/* Only show label if it's not related to text-checkbox */}
		{label && !label.includes("TextCheckbox") && (
			<label htmlFor={id}>{label}</label>
		)}
		{children}
		{errors}
		{help}
	</div>
);

function FormRender() {
	const [schema, setSchema] = useState<any>(null);
	const [uiSchema, setUiSchema] = useState<any>({});
	const { id } = useParams<{ id: string }>();
	const { language } = useLanguage();

	useEffect(() => {
		const storedForms = JSON.parse(localStorage.getItem("customForms") || "{}");
		if (storedForms[id as string]) {
			const formSchema = { ...storedForms[id as string] };

			// Don't touch the form title here, keep it as is
			setSchema(formSchema);

			// Prepare uiSchema dynamically based on the form schema
			const newUiSchema: any = {};
			Object.keys(storedForms[id as string].properties).forEach((key) => {
				const element = storedForms[id as string].properties[key];

				// Handle text-checkbox element
				if (
					element.type === "object" &&
					element.properties.text &&
					element.properties.disable
				) {
					newUiSchema[key] = {
						"ui:order": ["text", "disable"],
						text: {
							"ui:disabled": element.properties.disable === true,
							"ui:options": { label: false }, // No label for text input
						},
						disable: {
							"ui:widget": "checkbox",
							"ui:options": { label: false }, // No label for checkbox to avoid double titles
						},
					};
				}
				// Handle radio buttons
				else if (element.type === "string" && element.enum) {
					newUiSchema[key] = {
						"ui:widget": "radio",
					};
				}
				// Handle checkboxes (boolean fields)
				else if (element.type === "boolean") {
					newUiSchema[key] = {
						"ui:widget": "checkbox",
						"ui:options": { label: element.title },
					};
				}
				// Handle all other input types
				else {
					newUiSchema[key] = {
						"ui:widget": "text",
						"ui:options": {
							classNames: "mb-3", // Default styling
						},
					};
				}
			});

			setUiSchema(newUiSchema);
		}
	}, [id]);

	const handleSubmit = ({ formData }: any) => {
		const purchaseId = `${id}_${Date.now()}`;
		const storedData = JSON.parse(localStorage.getItem("formData") || "{}");

		// Store the submitted form data under the service ID
		storedData[id as string] = storedData[id as string] || {};
		storedData[id as string][purchaseId] = formData;

		localStorage.setItem("formData", JSON.stringify(storedData));

		// Optionally send form data to backend
		fetch("/api/submit-form", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id, purchaseId, formData }),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Form submitted successfully:", data);
			})
			.catch((error) => {
				console.error("Error submitting form:", error);
			});

		alert("Form submitted successfully!");
	};

	return (
		<div className="container text-center mt-5">
			{schema ? (
				<Form
					schema={schema}
					validator={validator}
					onSubmit={handleSubmit}
					className={`text-${language === "fa" ? "end" : "start"}`}
					uiSchema={uiSchema}
					templates={{
						FieldTemplate: CustomFieldTemplate,
					}}
				>
					{/* Submit Button */}
					<div className="d-flex justify-content-center mt-3">
						<button type="submit" className="btn btn-primary rounded-pill px-3">
							{language === "fa" ? "ثبت" : "Submit"}
						</button>
					</div>
				</Form>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}

export default FormRender;
