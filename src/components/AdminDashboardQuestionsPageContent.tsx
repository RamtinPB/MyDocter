import { useState } from "react";

interface Section {
	question: string;
	answer: string;
}

function AdminDashboardQuestionsPageContent() {
	const [sections, setSections] = useState<Section[]>([]);

	const addSection = () => {
		setSections([...sections, { question: "", answer: "" }]);
	};

	// Remove a specific section by its index
	const removeSection = (indexToRemove: number) => {
		const newSections = sections.filter((_, index) => index !== indexToRemove);
		setSections(newSections);
	};

	// Handle change in question or answer textarea
	const handleChange = (index: number, field: keyof Section, value: string) => {
		const updatedSections = [...sections];
		updatedSections[index][field] = value;
		setSections(updatedSections);
	};

	return (
		<div className="container custom-bg-4 shadow rounded-5 p-3 mb-5">
			<div className="d-flex flex-column bg-white shadow text-end rounded-5 mx-5 my-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">{"لیست سوالات متداول"}</h3>
				</div>
				{sections.map((section, index) => (
					<div
						key={index}
						id="question-section"
						className="d-flex justify-content-between align-items-center shadow-sm rounded-5 rounded-top-0"
					>
						{/* Delete button for each question section */}
						<button
							id="btn-delete"
							className="rounded-circle btn p-0 m-3"
							type="button"
							onClick={() => removeSection(index)}
						>
							<img
								src="\src\images\red-delete.png"
								className="rounded-circle"
								style={{ width: "40px", height: "40px" }}
							/>
						</button>

						{/* Question and Answer Textareas */}
						<div className="d-flex flex-column w-100">
							<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
								<h4 className="pe-1 me-1">
									{index + 1} {" عنوان سوال"}
								</h4>
								<textarea
									className="form-control text-end border border-1 shadow-sm rounded-4 py-2 my-1"
									rows={3}
									placeholder="متن خود را وارد کنید"
									value={section.question}
									onChange={(e) =>
										handleChange(index, "question", e.target.value)
									}
								></textarea>
							</div>
							<div className="d-flex flex-column px-3 my-4 mx-4 py-2">
								<h4 className="pe-1 me-1">
									{index + 1} {" پاسخ و توضیحات سوال"}
								</h4>
								<textarea
									className="form-control text-end border border-1 shadow-sm rounded-4 py-2 my-1"
									rows={3}
									placeholder="متن خود را وارد کنید"
									value={section.answer}
									onChange={(e) =>
										handleChange(index, "answer", e.target.value)
									}
								></textarea>
							</div>
						</div>
					</div>
				))}

				{/* Add Button for new question sections */}
				<div
					id="btn-add"
					className="d-flex justify-content-center align-items-center shadow-sm rounded-5 rounded-top-0"
				>
					<button
						className="rounded-circle btn p-0 m-3"
						type="button"
						onClick={addSection}
					>
						<img
							src="\src\images\green-add.png"
							className="rounded-circle"
							style={{ width: "40px", height: "40px" }}
						/>
					</button>
				</div>
			</div>
		</div>
	);
}

export default AdminDashboardQuestionsPageContent;
