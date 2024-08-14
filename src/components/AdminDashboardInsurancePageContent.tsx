import { useState } from "react";

function AdminDashboardInsurancePageContent() {
	// Define the state for sections
	const [sections, setSections] = useState<
		{ input1: string; input2: string }[]
	>([]);

	// Add a new section to the table
	const addSection = () => {
		setSections([...sections, { input1: "", input2: "" }]);
	};

	// Remove a specific section by its index
	const removeSection = (indexToRemove: number) => {
		const newSections = sections.filter((_, index) => index !== indexToRemove);
		setSections(newSections);
	};

	// Handle change in the input fields
	const handleChange = (
		index: number,
		field: "input1" | "input2",
		value: string
	) => {
		const updatedSections = [...sections];
		updatedSections[index][field] = value;
		setSections(updatedSections);
	};

	const handleSubmit = () => {};

	const handleCancel = () => {};

	return (
		<div className="container custom-bg-4 shadow rounded-5 p-3 mb-5">
			<div className="d-flex flex-column bg-white shadow text-end rounded-5 mx-5 my-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">{"بیمه پایه"}</h3>
				</div>
				<table
					className="table table-hover text-center mb-5"
					style={{ direction: "rtl" }}
				>
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">نام بیمه</th>
							<th scope="col">درصد سهم بیمه</th>
							<th scope="col">حذف</th>
						</tr>
					</thead>
					<tbody>
						{sections.map((section, index) => (
							<tr key={index}>
								<th scope="row" className="align-middle">
									{index + 1}
								</th>
								<td className="align-middle">
									<input
										type="text"
										className="form-control"
										value={section.input1}
										onChange={(e) =>
											handleChange(index, "input1", e.target.value)
										}
										placeholder="نام بیمه"
									/>
								</td>
								<td className="align-middle">
									<input
										type="text"
										className="form-control"
										value={section.input2}
										onChange={(e) =>
											handleChange(index, "input2", e.target.value)
										}
										placeholder="سهم بیمه"
									/>
								</td>
								<td className="align-middle">
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
								</td>
							</tr>
						))}
						<tr>
							<td colSpan={4} className="align-middle ">
								{/* Add Button for new rows */}
								<div
									id="btn-add"
									className="d-flex justify-content-center align-items-center "
								>
									<button
										className="rounded-circle btn p-0 m-1"
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
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			{/* Submit and Cancel buttons */}
			<div className="d-flex justify-content-evenly px-3 my-2 mx-4 py-2">
				<button
					className="btn btn-secondary rounded-pill px-3"
					onClick={handleCancel}
				>
					{"حذف"}
				</button>
				<button
					className="btn btn-success rounded-pill px-3"
					onClick={handleSubmit}
				>
					{"ذخیره"}
				</button>
			</div>
		</div>
	);
}

export default AdminDashboardInsurancePageContent;
