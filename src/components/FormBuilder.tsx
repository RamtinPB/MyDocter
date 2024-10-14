import { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { useLanguage } from "./LanguageContext";

// Define uiSchema type with index signature
interface UiSchema {
	[key: string]: any; // Or a more specific type based on your form schema structure
}

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
	const { language } = useLanguage(); // Get language and toggle function from context

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

	const [uiSchema, setUiSchema] = useState<UiSchema>({});
	const [checkboxLabel, setCheckboxLabel] = useState("");

	// Helper function to get the correct widget based on the element type
	const getUiWidget = (elementType: string) => {
		switch (elementType) {
			case "radio":
				return "radio";
			case "select":
				return "select";
			case "text-checkbox":
				return "text"; // Treat text-checkbox as text input for ui purposes
			case "boolean":
				return "checkbox"; // Use checkbox for boolean types
			default:
				return "text"; // Default to text input for other types
		}
	};

	// Helper function to get the correct class names based on the element type
	const getClassNames = (elementType: string) => {
		switch (elementType) {
			case "radio":
				return " mb-3"; // Radio-specific class names
			case "select":
				return " mb-3"; // Dropdown select class names
			case "text-checkbox":
				return " mb-3"; // Shared class for text-checkbox
			case "checkbox":
				return "mb-3";
			default:
				return " mb-3"; // Default class for other types (e.g., text, number)
		}
	};

	const addFormElement = () => {
		let newElement: any;

		if (newElementType === "radio" || newElementType === "select") {
			newElement = {
				type: "string",
				title: newElementLabel,
				enum: options, // Define options for radio and select
			};
		} else if (newElementType === "text-checkbox") {
			newElement = {
				type: "object",
				properties: {
					text: { type: "string", title: "Text" }, // Text input label remains "Text"
					disable: {
						type: "boolean",
						title: checkboxLabel, // Use the separate label for the checkbox
					},
				},
				dependencies: {
					disable: {
						oneOf: [
							{
								properties: {
									disable: { const: true },
									text: { type: "string", title: "Text", readOnly: true }, // Disable the text input
								},
							},
							{
								properties: {
									disable: { const: false },
									text: { type: "string", title: "Text", readOnly: false }, // Enable the text input
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

		// Update schema
		setSchema({
			...schema,
			properties: {
				...schema.properties,
				[newElementKey]: newElement,
			},
		});

		// Update uiSchema with classNames for styling
		const newUiSchema = {
			...uiSchema,
			[newElementKey]: {
				"ui:widget": getUiWidget(newElementType), // Set widget type dynamically
				"ui:options": {
					classNames: getClassNames(newElementType), // Set class names dynamically for styling
				},
			},
		};

		// For text-checkbox, set specific uiSchema for text and disable fields
		if (newElementType === "text-checkbox") {
			newUiSchema[newElementKey] = {
				...newUiSchema[newElementKey], // Preserve existing fields
				"ui:order": ["text", "disable"], // Set the order: text first, then checkbox
				text: {
					"ui:disabled": schema.properties[newElementKey]?.disable === true, // Dynamically disable text
					"ui:options": { label: false }, // Hide the label for the text input
				},
				disable: {
					"ui:options": { label: checkboxLabel }, // Set the label for the checkbox
				},
			};
		}

		setUiSchema(newUiSchema);

		// Reset fields after adding the element
		setNewElementLabel("");
		setCheckboxLabel(""); // Reset the checkbox label field
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

	const handleDeleteOption = (index: number) => {
		const updatedOptions = options.filter(
			(_, optionIndex) => optionIndex !== index
		);
		setOptions(updatedOptions);
	};

	const saveFormSchema = () => {
		const storedForms = JSON.parse(localStorage.getItem("customForms") || "{}");
		storedForms[serviceId] = schema;
		localStorage.setItem("customForms", JSON.stringify(storedForms));
		alert("Form schema saved successfully!");
	};

	return (
		<div className="container my-5">
			<div className="my-4">
				<label htmlFor="serviceId" className="form-label">
					{language === "fa" ? "شناسه سرویس" : "Service ID"}
				</label>
				<input
					type="text"
					id="serviceId"
					className="form-control"
					value={serviceId}
					onChange={(e) => setServiceId(e.target.value)}
				/>
			</div>

			<div className="my-4">
				<label htmlFor="formTitle" className="form-label">
					{language === "fa" ? "تیتر فرم (اختیاری)" : "Form Title (Optional)"}
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

			<div className="my-4">
				<label htmlFor="elementType" className="form-label">
					{language === "fa" ? "نوع ورودی" : "Input Type"}
				</label>
				<select
					id="elementType"
					className="form-select"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
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
					<option value="string">
						{language === "fa" ? "ورودی نوشته ای" : "Text Input"}
					</option>
					<option value="number">
						{language === "fa" ? "ورودی رقمی" : "Number Input"}
					</option>
					<option value="boolean">
						{language === "fa" ? "ورودی چک باکس" : "Checkbox"}
					</option>
					<option value="radio">
						{language === "fa" ? "ورودی گزینشی" : "Radio Buttons"}
					</option>
					<option value="select">
						{language === "fa" ? "ورودی کشویی" : "Dropdown Select"}
					</option>
					<option value="text-checkbox">
						{language === "fa"
							? "ورودی نوشته ای همراه چک باکس"
							: "Text with Checkbox"}
					</option>
				</select>
			</div>

			<div className="my-4">
				<label htmlFor="elementLabel" className="form-label">
					{language === "fa" ? "تیتر ورودی" : "Label"}
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
				<div
					className="my-4"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<label className="form-label">
						{language === "fa" ? "گزینه ها" : "Options"}
					</label>

					{options.length === 0 ? (
						<p className="text-muted">
							{language === "fa"
								? "هیچ گزینه ای اضافه نشده است."
								: "No options have been added."}
						</p>
					) : (
						options.map((option, index) => (
							<div key={index} className="d-flex align-items-center mb-2">
								<input
									type="text"
									className="form-control mx-2"
									value={option}
									onChange={(e) => handleOptionChange(index, e.target.value)}
								/>
								<button
									className="btn btn-danger mx-2"
									onClick={() => handleDeleteOption(index)}
								>
									{language === "fa" ? "حذف" : "Delete"}
								</button>
							</div>
						))
					)}

					<button className="btn btn-secondary mt-2" onClick={handleAddOption}>
						{language === "fa" ? "اضافه کردن گزینه" : "Add Option"}
					</button>
				</div>
			)}

			{newElementType === "text-checkbox" && (
				<div className="my-4">
					<label className="form-label">
						{language === "fa" ? "عنوان چک باکس" : "Checkbox Label"}
					</label>
					<input
						type="text"
						className="form-control"
						value={checkboxLabel}
						onChange={(e) => setCheckboxLabel(e.target.value)}
					/>
				</div>
			)}

			<div className="d-flex flex-row justify-content-center align-items-center my-4">
				<button className="btn btn-primary" onClick={addFormElement}>
					{language === "fa" ? "اضافه کردن ورودی" : "Add input"}
				</button>
			</div>

			<div
				className=" pt-3 mt-5"
				style={{ direction: language === "fa" ? "rtl" : "ltr" }}
			>
				<h3 className="mb-5">
					{language === "fa" ? "پیش نمایش فرم:" : "Form Preview:"}
				</h3>
				<Form schema={schema} uiSchema={uiSchema} validator={validator}>
					<div className="d-flex flex-wrap justify-content-center align-items-center">
						{Object.keys(schema.properties).length === 0 ? (
							<p className="text-muted">
								{language === "fa"
									? "هیچ ورودی ای اضافه نشده است."
									: "No inputs have been added."}
							</p>
						) : (
							Object.keys(schema.properties).map((key) => (
								<button
									key={key}
									className="btn btn-danger m-3"
									style={{ direction: language === "fa" ? "ltr" : "rtl" }}
									onClick={() => handleDeleteElement(key)}
								>
									{language === "fa" ? `${key} حذف` : `Delete ${key}`}
								</button>
							))
						)}
					</div>
				</Form>
			</div>

			<div className="d-flex flex-row justify-content-center align-items-center my-4">
				<button className="btn btn-success" onClick={saveFormSchema}>
					{language === "fa" ? "ذخیره فرم" : "Save Form"}
				</button>
			</div>
		</div>
	);
}

export default FormBuilder;
