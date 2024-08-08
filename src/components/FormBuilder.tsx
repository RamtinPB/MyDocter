import { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

function FormBuilder() {
  const [schema, setSchema] = useState({
    title: "Custom Form",
    type: "object",
    properties: {},
  });

  const [newElementType, setNewElementType] = useState<
    "string" | "number" | "boolean"
  >("string");
  const [newElementLabel, setNewElementLabel] = useState("");

  const addFormElement = () => {
    const newElement = {
      type: newElementType,
      title: newElementLabel,
    };
    setSchema({
      ...schema,
      properties: {
        ...schema.properties,
        [newElementLabel]: newElement,
      },
    });
    setNewElementLabel("");
  };

  const saveFormSchema = () => {
    localStorage.setItem("customFormSchema", JSON.stringify(schema));
  };

  return (
    <div className="container mt-5">
      <div className="mb-3">
        <label htmlFor="elementType" className="form-label">
          Element Type
        </label>
        <select
          id="elementType"
          className="form-select"
          value={newElementType}
          onChange={(e) =>
            setNewElementType(e.target.value as "string" | "number" | "boolean")
          }
        >
          <option value="string">Text Input</option>
          <option value="number">Number Input</option>
          <option value="boolean">Checkbox</option>
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
      <button className="btn btn-primary mb-3" onClick={addFormElement}>
        Add Element
      </button>
      <button className="btn btn-success mb-3" onClick={saveFormSchema}>
        Save Form
      </button>
      <div className="mt-4">
        <h3>Form Preview:</h3>
        <Form schema={schema} validator={validator} />
      </div>
    </div>
  );
}
export default FormBuilder;
