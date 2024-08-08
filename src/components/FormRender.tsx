import { useEffect, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

function FormRender() {
  const [schema, setSchema] = useState<any>(null);

  useEffect(() => {
    const savedSchema = localStorage.getItem("customFormSchema");
    if (savedSchema) {
      setSchema(JSON.parse(savedSchema));
    }
  }, []);

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
    <div className="container mt-5">
      <h3>Loaded Form:</h3>
      {schema ? (
        <Form schema={schema} validator={validator} onSubmit={handleSubmit} />
      ) : (
        <p>Loading form...</p>
      )}
    </div>
  );
}

export default FormRender;
