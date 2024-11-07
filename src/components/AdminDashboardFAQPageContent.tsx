import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";

interface FAQsProps {
	id: number;
	question: string;
	answer: string;
	questionEn: string;
	answerEn: string;
}

function AdminDashboardFAQPageContent() {
	const [FAQsData, setFAQsData] = useState<FAQsProps[]>([]);
	const [dataUpdateFlag, setDataUpdateFlag] = useState(false);

	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		const fetchFAQ = async () => {
			try {
				// Attempt to fetch from the API
				const response = await axiosInstance.post("/api/Admin/GetAllFAQs");
				if (response.status !== 200) {
					throw new Error("Failed to fetch data from API");
				}

				setFAQsData(response.data);
			} catch (err) {
				console.error("API request failed, trying local db.json", err);

				// Fallback to fetching from db.json if API request fails
				try {
					const response = await fetch("/db.json"); // Adjust path if necessary
					if (!response.ok) {
						throw new Error("Failed to fetch data from db.json");
					}
					const data = await response.json();

					// Assuming faq is directly available in the root of db.json
					const faq = data.faqs;

					setFAQsData(faq);
				} catch (jsonErr) {
					console.error(
						"Failed to fetch data from both API and db.json",
						jsonErr
					);
				}
			}
		};

		fetchFAQ();
	}, [dataUpdateFlag]);

	const addFAQ = async () => {
		const newFAQ = {
			id: 0,
			question: "",
			answer: "",
			questionEn: "",
			answerEn: "",
		};
		try {
			const response = await axiosInstance.post("/api/Admin/AddFAQ", newFAQ);
			if (response.status === 200) {
				setFAQsData([...FAQsData, newFAQ]);
			}
		} catch (error) {
			console.error("Failed to add FAQ", error);
		}
		setDataUpdateFlag((prev) => !prev); // Trigger refetch
	};

	// Remove a specific FAQ by its index
	const removeFAQ = async (indexToRemove: number) => {
		const faqToRemove = FAQsData[indexToRemove];
		try {
			const response = await axiosInstance.post("/api/Admin/RemoveFAQ", {
				faqId: faqToRemove.id,
			});
			if (response.status === 200) {
				setFAQsData(FAQsData.filter((_, index) => index !== indexToRemove));
			}
		} catch (error) {
			console.error("Failed to remove FAQ", error);
		}
		setDataUpdateFlag((prev) => !prev); // Trigger refetch
	};

	// Handle change in question or answer textarea
	const handleChange = (
		index: number,
		field: "question" | "answer" | "questionEn" | "answerEn", // Explicit keys
		value: string
	) => {
		const updatedFAQsData = [...FAQsData];
		updatedFAQsData[index][field] = value;
		setFAQsData(updatedFAQsData);
	};

	const handleSubmit = async () => {
		try {
			await axiosInstance.post("/api/Admin/UpdateFAQs", FAQsData);
		} catch (error) {
			console.log("Failed to send new FAQs to server", error);
		}
	};

	return (
		<div className="container custom-bg-4 shadow rounded-5 p-3 mb-4 mb-md-5">
			<div
				className={`d-flex flex-column bg-white shadow rounded-5 m-3 m-md-4 m-lg-5`}
			>
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa" ? "لیست سوالات متداول" : "FAQ List"}
					</h3>
				</div>
				{FAQsData.map((faq, index) => (
					<div
						key={index}
						id="question-section"
						className="d-flex justify-content-between align-items-center shadow-sm rounded-5 rounded-top-0"
						style={{ direction: language === "fa" ? "ltr" : "rtl" }}
					>
						{/* Delete button for each question section */}
						<button
							id="btn-delete"
							className="rounded-circle btn p-0 m-3"
							type="button"
							onClick={() => removeFAQ(index)}
						>
							<img
								src="\images\red-delete.png"
								className="custom-admin-btn rounded-circle"
							/>
						</button>

						{/* Question and Answer Textareas */}
						<div className="d-flex flex-column w-100">
							{/* farsi title */}
							<div className="d-flex flex-column px-3 m-2 m-md-4 py-2">
								<div className={` justify-content-end d-flex px-1 mx-1`}>
									<h5 className="mx-1">{index + 1}</h5>
									<h5>
										{language === "fa" ? " عنوان سوال" : "Question (Farsi)"}
									</h5>
								</div>
								<textarea
									className={`form-control text-${
										language === "fa" ? "end" : "start"
									} border border-1 shadow-sm rounded-4 py-2 my-1`}
									style={{ direction: language === "fa" ? "rtl" : "ltr" }}
									rows={2}
									placeholder={
										language === "fa"
											? "متن خود را وارد کنید"
											: "Write your input"
									}
									value={faq.question}
									onChange={(e) =>
										handleChange(index, "question", e.target.value)
									}
								></textarea>
							</div>
							{/* farsi desc */}
							<div className="d-flex flex-column px-3 m-2 m-md-4 py-2">
								<div className={` justify-content-end d-flex px-1 mx-1`}>
									<h5 className="mx-1">{index + 1}</h5>
									<h5>
										{language === "fa"
											? "پاسخ و توضیحات سوال"
											: "Explanation (Farsi)"}
									</h5>
								</div>
								<textarea
									className={`form-control text-${
										language === "fa" ? "end" : "start"
									} border border-1 shadow-sm rounded-4 py-2 my-1`}
									style={{ direction: language === "fa" ? "rtl" : "ltr" }}
									rows={2}
									placeholder={
										language === "fa"
											? "متن خود را وارد کنید"
											: "Write your input"
									}
									value={faq.answer}
									onChange={(e) =>
										handleChange(index, "answer", e.target.value)
									}
								></textarea>
							</div>
							{/* english title */}
							<div className="d-flex flex-column px-3 m-2 m-md-4 py-2">
								<div className={` justify-content-end d-flex px-1 mx-1`}>
									<h5 className="mx-1">{index + 1}</h5>
									<h5>
										{language === "fa"
											? "(انگلیسی) عنوان سوال"
											: "Question (English)"}
									</h5>
								</div>
								<textarea
									className={`form-control text-${
										language === "fa" ? "end" : "start"
									} border border-1 shadow-sm rounded-4 py-2 my-1`}
									style={{ direction: language === "fa" ? "rtl" : "ltr" }}
									rows={2}
									placeholder={
										language === "fa"
											? "متن خود را وارد کنید"
											: "Write your input"
									}
									value={faq.questionEn}
									onChange={(e) =>
										handleChange(index, "questionEn", e.target.value)
									}
								></textarea>
							</div>
							{/* english desc */}
							<div className="d-flex flex-column px-3 m-2 m-md-4 py-2">
								<div className={` justify-content-end d-flex px-1 mx-1`}>
									<h5 className="mx-1">{index + 1}</h5>
									<h5>
										{language === "fa"
											? "(انگلیسی) پاسخ و توضیحات سوال"
											: "Explanation (English)"}
									</h5>
								</div>
								<textarea
									className={`form-control text-${
										language === "fa" ? "end" : "start"
									} border border-1 shadow-sm rounded-4 py-2 my-1`}
									style={{ direction: language === "fa" ? "rtl" : "ltr" }}
									rows={2}
									placeholder={
										language === "fa"
											? "متن خود را وارد کنید"
											: "Write your input"
									}
									value={faq.answerEn}
									onChange={(e) =>
										handleChange(index, "answerEn", e.target.value)
									}
								></textarea>
							</div>
						</div>
					</div>
				))}

				{/* Add Button for new question FAQsData */}
				<div
					id="btn-add"
					className="d-flex justify-content-center align-items-center shadow-sm rounded-5 rounded-top-0"
				>
					<button
						className="rounded-circle btn p-0 m-3"
						type="button"
						onClick={addFAQ}
					>
						<img
							src="\images\green-add.png"
							className="custom-admin-btn rounded-circle"
						/>
					</button>
				</div>
			</div>
			{/* Submit and Cancel buttons */}
			<div className="d-flex justify-content-evenly px-3 py-2 my-2">
				<button
					className="btn btn-success rounded-pill px-3"
					onClick={handleSubmit}
				>
					{language === "fa" ? "ذخیره تغییرات" : "Save Changes"}
				</button>
			</div>
		</div>
	);
}

export default AdminDashboardFAQPageContent;
