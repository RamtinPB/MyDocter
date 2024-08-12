import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using react-router for navigation
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

function FormRenderFilled() {
	const [schema, setSchema] = useState<any>(null);
	const [formData, setFormData] = useState<any>(null);
	const { id, purchaseId } = useParams<{ id: string; purchaseId: string }>(); // Get the service ID and purchase ID from URL

	useEffect(() => {
		// Retrieve the form schema using the service ID
		const storedForms = JSON.parse(localStorage.getItem("customForms") || "{}");
		const storedData = JSON.parse(localStorage.getItem("formData") || "{}");

		if (storedForms[id as string]) {
			setSchema(storedForms[id as string]);
		}

		// Retrieve the form data using the purchase ID
		if (
			storedData[id as string] &&
			storedData[id as string][purchaseId as string]
		) {
			setFormData(storedData[id as string][purchaseId as string]);
		}
	}, [id, purchaseId]);

	return (
		<div className="container text-center mt-5">
			<h3>Filled Form:</h3>
			{schema && formData ? (
				<Form
					schema={schema}
					formData={formData}
					disabled={true} // Makes the form read-only
					liveValidate={true} // Disables editing
					className="text-start"
					validator={validator}
				/>
			) : (
				<p>Loading form data...</p>
			)}
		</div>
	);
}

export default FormRenderFilled;
