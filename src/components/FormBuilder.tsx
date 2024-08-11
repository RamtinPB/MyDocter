import { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

interface Schema {
	title?: string;
	type: string;
	properties: {
		[key: string]: {
			type: string;
			title: string;
			[key: string]: any;
		};
	};
}

function FormBuilder() {
	const [schema, setSchema] = useState<Schema>({
		title: "",
		type: "object",
		properties: {},
	});

	const [newElementType, setNewElementType] = useState<
		"string" | "number" | "boolean" | "radio" | "select" | "text-checkbox"
	>("string");

	const [newElementLabel, setNewElementLabel] = useState("");
	const [options, setOptions] = useState<string[]>([]);
	const [serviceId, setServiceId] = useState<string>("");

	const addFormElement = () => {
		let newElement: any;

		if (newElementType === "radio" || newElementType === "select") {
			newElement = {
				type: newElementType === "radio" ? "string" : "string",
				title: newElementLabel,
				enum: options,
			};
		} else if (newElementType === "text-checkbox") {
			newElement = {
				type: "object",
				title: newElementLabel,
				properties: {
					text: { type: "string", title: "Text" },
					disable: {
						type: "boolean",
						title: "Disable Text",
						description: "Check to disable text input",
					},
				},
				dependencies: {
					disable: {
						oneOf: [
							{
								properties: {
									disable: { const: true },
								},
							},
							{
								properties: {
									disable: { const: false },
									text: { type: "string", title: "Text" },
								},
							},
						],
					},
				},
			};
		} else {
			newElement = {
				type: newElementType,
				title: newElementLabel,
			};
		}

		const newElementKey = newElementLabel || `element_${Date.now()}`;

		setSchema({
			...schema,
			properties: {
				...schema.properties,
				[newElementKey]: newElement,
			},
		});

		// Reset fields after adding the element
		setNewElementLabel("");
		setOptions([]);
	};

	const handleDeleteElement = (key: string) => {
		const updatedProperties = { ...schema.properties };
		delete updatedProperties[key];

		setSchema({
			...schema,
			properties: updatedProperties,
		});
	};

	const handleAddOption = () => {
		setOptions([...options, ""]);
	};

	const handleOptionChange = (index: number, value: string) => {
		const updatedOptions = [...options];
		updatedOptions[index] = value;
		setOptions(updatedOptions);
	};

	const saveFormSchema = () => {
		const storedForms = JSON.parse(localStorage.getItem("customForms") || "{}");
		storedForms[serviceId] = schema;
		localStorage.setItem("customForms", JSON.stringify(storedForms));
		alert("Form schema saved successfully!");
	};

	return (
		<div className="container mt-5">
			<div className="mb-3">
				<label htmlFor="serviceId" className="form-label">
					Service ID
				</label>
				<input
					type="text"
					id="serviceId"
					className="form-control"
					value={serviceId}
					onChange={(e) => setServiceId(e.target.value)}
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="formTitle" className="form-label">
					Form Title (Optional)
				</label>
				<input
					type="text"
					id="formTitle"
					className="form-control"
					value={schema.title || ""}
					onChange={(e) =>
						setSchema({ ...schema, title: e.target.value || undefined })
					}
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="elementType" className="form-label">
					Element Type
				</label>
				<select
					id="elementType"
					className="form-select"
					value={newElementType}
					onChange={(e) =>
						setNewElementType(
							e.target.value as
								| "string"
								| "number"
								| "boolean"
								| "radio"
								| "select"
								| "text-checkbox"
						)
					}
				>
					<option value="string">Text Input</option>
					<option value="number">Number Input</option>
					<option value="boolean">Checkbox</option>
					<option value="radio">Radio Buttons</option>
					<option value="select">Dropdown Select</option>
					<option value="text-checkbox">Text with Checkbox</option>
				</select>
			</div>

			<div className="mb-3">
				<label htmlFor="elementLabel" className="form-label">
					Label
				</label>
				<input
					type="text"
					id="elementLabel"
					className="form-control"
					value={newElementLabel}
					onChange={(e) => setNewElementLabel(e.target.value)}
				/>
			</div>

			{(newElementType === "radio" || newElementType === "select") && (
				<div className="mb-3">
					<label className="form-label">Options</label>
					{options.map((option, index) => (
						<div key={index} className="d-flex align-items-center mb-2">
							<input
								type="text"
								className="form-control me-2"
								value={option}
								onChange={(e) => handleOptionChange(index, e.target.value)}
							/>
						</div>
					))}
					<button className="btn btn-secondary mt-2" onClick={handleAddOption}>
						Add Option
					</button>
				</div>
			)}

			<button className="btn btn-primary mb-3" onClick={addFormElement}>
				Add Element
			</button>

			<button className="btn btn-success mb-3" onClick={saveFormSchema}>
				Save Form
			</button>

			<div className="mt-4">
				<h3>Form Preview:</h3>
				<Form schema={schema} validator={validator}>
					{Object.keys(schema.properties).map((key) => (
						<button
							key={key}
							className="btn btn-danger mb-3"
							onClick={() => handleDeleteElement(key)}
						>
							Delete {key}
						</button>
					))}
				</Form>
			</div>
		</div>
	);
}

export default FormBuilder;
