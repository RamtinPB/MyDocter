// Assuming you're using react-router for navigation
import { useLanguage } from "./LanguageContext";

interface FormRenderFilledProps {
	inputs?: { tag: string; value: string }[];
}

function FormRenderFilled({ inputs }: FormRenderFilledProps) {
	const { language } = useLanguage();

	return (
		<div className="container text-center mt-4">
			{inputs && inputs.length > 0 ? (
				<ul>
					{inputs.map((input, index) => (
						<li key={index}>
							<strong>{input.tag}:</strong> {input.value}
						</li>
					))}
				</ul>
			) : (
				<div className="text-center py-3">
					<p>
						{language === "fa" ? "اطلاعات فرم یافت نشد" : "Form Data Not Found"}
					</p>
				</div>
			)}
		</div>
	);
}

export default FormRenderFilled;
