import { useEffect, useState } from "react";
import "/src/cssFiles/FAQ.css"; // Import the CSS file for styling
import "/src/cssFiles/customColors.css";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";

interface FAQs {
	id: string;
	question: string;
	answer: string;
	questionEn: string;
	answerEn: string;
}

function FAQ() {
	const [faq, setFaq] = useState<FAQs[]>([]);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [openIndexes, setOpenIndexes] = useState<number[]>([]); // Track which faq are open

	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		const fetchFAQ = async () => {
			try {
				// Attempt to fetch from the API
				const response = await axiosInstance.post("/api/Pages/GetFAQs");
				if (response.status !== 200) {
					throw new Error("Failed to fetch data from API");
				}

				setFaq(response.data);
				setLoading(false);
			} catch (err) {
				console.error("API request failed, trying local db.json", err);

				// Fallback to fetching from db.json if API request fails
				try {
					const response = await fetch("/FAQ.json"); // Adjust path if necessary
					if (!response.ok) {
						throw new Error("Failed to fetch data from db.json");
					}
					const data = await response.json();

					// Assuming faq is directly available in the root of db.json
					const faq = data;

					setFaq(faq);
					setLoading(false);
				} catch (jsonErr) {
					console.error(
						"Failed to fetch data from both API and db.json",
						jsonErr
					);
					setError(
						"Failed to fetch data from both API and local fallback."
					);
					setLoading(false);
				}
			}
		};

		fetchFAQ();
	}, []);

	const toggleQuestion = (index: number) => {
		if (openIndexes.includes(index)) {
			setOpenIndexes(openIndexes.filter((i) => i !== index));
		} else {
			setOpenIndexes([...openIndexes, index]);
		}
	};

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items">
				<div
					className="spinner-border  text-primary text-center my-5"
					role="status"
				>
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	return (
		<section id="faq" className="container">
			<div className="accordion" id="accordionExample">
				{faq.map((question, index) => (
					<div
						className="accordion-item shadow-sm rounded-5 my-5"
						key={index}
					>
						<div
							className={`accordion-header border border-1 border-primary rounded-5 d-flex justify-content-between ${language === "fa" ? "text-end" : "text-start"} align-items-center p-2`}
							id={`heading${index}`}
							style={{
								direction: language === "fa" ? "rtl" : "ltr",
							}}
						>
							<h3 className=" mb-0 mx-3 py-2 py-md-0">
								{language === "fa"
									? question.question
									: question.questionEn}
							</h3>
							<img
								src="\images\plus-border.png"
								alt="+"
								className={`custom-btn img-fluid m-0 p-0 btn-toggle collapsed ${
									openIndexes.includes(index) ? "rotate" : ""
								}`}
								onClick={() => toggleQuestion(index)}
								data-bs-toggle="collapse"
								data-bs-target={`#collapse${index}`}
								itemType="button"
								aria-expanded={false}
								aria-controls={`collapse${index}`}
							/>
						</div>
						<div
							id={`collapse${index}`}
							className={`accordion-collapse collapse`}
							data-bs-parent="accordionExample"
						>
							<div
								className={`accordion-body text-${
									language === "fa" ? "end" : "start"
								}`}
							>
								<p className=" mb-0">
									{language === "fa"
										? question.answer
										: question.answerEn}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default FAQ;
