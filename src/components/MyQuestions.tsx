import { useEffect, useState } from "react";
import "/src/cssFiles/myquestions.css"; // Import the CSS file for styling
import "/src/cssFiles/customColors.css";
import { useLanguage } from "./LanguageContext";

interface Questions {
	title: string;
	description: string;
	titleEN: string;
	descriptionEN: string;
}

function MyQuestions() {
	const [questions, setQuestions] = useState<Questions[]>([]);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [openIndexes, setOpenIndexes] = useState<number[]>([]); // Track which questions are open

	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				const response = await fetch("/db.json"); // Adjust path if necessary
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();

				// Assuming questions is directly available in the root of db.json
				const questions = data.questions;

				setQuestions(questions);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching questions:", err);
				setError("Failed to fetch questions");
				setLoading(false);
			}
		};

		fetchQuestions();
	}, []);

	const toggleQuestion = (index: number) => {
		if (openIndexes.includes(index)) {
			setOpenIndexes(openIndexes.filter((i) => i !== index));
		} else {
			setOpenIndexes([...openIndexes, index]);
		}
	};

	if (loading) {
		return <div className="text-center my-5">Loading...</div>;
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	return (
		<section id="questions" className="container">
			<div className="accordion" id="accordionExample">
				{questions.map((question, index) => (
					<div className="accordion-item shadow-sm rounded-5 my-5" key={index}>
						<div
							className="accordion-header border border-1 border-primary rounded-5 d-flex justify-content-end align-items-center p-2"
							id={`heading${index}`}
							style={{ direction: language === "fa" ? "ltr" : "rtl" }}
						>
							<h3 className=" mb-0 mx-4">
								{language === "fa" ? question.title : question.titleEN}
							</h3>
							<img
								src="src\images\plus-border.png"
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
								<p className="mb-0 ">
									{language === "fa"
										? question.description
										: question.descriptionEN}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default MyQuestions;
