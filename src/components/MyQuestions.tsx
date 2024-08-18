import { useEffect, useState } from "react";
import axios from "axios";
import "../cssFiles/myquestions.css"; // Import the CSS file for styling
import "../cssFiles/customColors.css";

interface Questions {
	title: string;
	description: string;
}

function MyQuestions() {
	const [questions, setQuestions] = useState<Questions[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [openIndexes, setOpenIndexes] = useState<number[]>([]); // Track which questions are open

	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				const response = await axios.get<Questions[]>(
					"http://localhost:3001/questions"
				);
				setQuestions(response.data);
				setLoading(false);
			} catch (err) {
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
						>
							<h3 className=" mb-0 ms-auto me-4">{question.title}</h3>
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
							<div className="accordion-body text-end">
								<p className="mb-0 ">{question.description}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default MyQuestions;
