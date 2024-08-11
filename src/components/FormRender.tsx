import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using react-router for navigation
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

function FormRender() {
	const [schema, setSchema] = useState<any>(null);
	const { id } = useParams<{ id: string }>(); // Get the service ID from URL

	useEffect(() => {
		const storedForms = JSON.parse(localStorage.getItem("customForms") || "{}");
		if (storedForms[id as string]) {
			setSchema(storedForms[id as string]);
		}
	}, [id]);

	const handleSubmit = ({ formData }: any) => {
		// Send formData to backend
		fetch("/api/submit-form", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Form submitted successfully:", data);
			})
			.catch((error) => {
				console.error("Error submitting form:", error);
			});
	};

	return (
		<div className="container text-center mt-5">
			<h3>Loaded Form:</h3>
			{schema ? (
				<Form
					schema={schema}
					validator={validator}
					onSubmit={handleSubmit}
					className="text-end"
				/>
			) : (
				<p>Loading form...</p>
			)}
		</div>
	);
}

export default FormRender;
