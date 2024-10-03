import { useEffect, useState } from "react";
import "../cssFiles/customColors.css";
import { useLanguage } from "../components/LanguageContext";

interface Service {
	name: string;
	description: string;

	nameEN: string;
	descriptionEN: string;

	image: string;
	id: string;
	category: string;
}

function GeneralDoctorPrescription() {
	const [services, setServices] = useState<Service[]>([]);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		const fetchServices = async () => {
			try {
				// Use fetch to get the data from the public folder
				const response = await fetch("/db.json"); // Adjust the path if necessary
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();

				// Assuming the services data is available in a property like `services`
				const services = data.services; // Adjust according to your db.json structure

				setServices(services);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching services:", err);
				setError("Failed to fetch services");
				setLoading(false);
			}
		};

		fetchServices();
	}, []);

	if (loading) {
		return <div className="text-center my-5">Loading...</div>;
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	return (
		<div className="custom-bg-4 min-vh-100">
			<div className="container d-flex flex-column px-3 px-md-4">
				<div className="custom-bg-1 d-flex justify-content-center align-items-center text-white rounded-pill shadow p-2 p-md-3 p-lg-4 mt-4 mt-md-5 mb-3 mb-md-4">
					<h4 className="m-1">
						{language === "fa"
							? "خدمات پزشک عمومی"
							: "General Practitioner Services"}
					</h4>
				</div>
				<div className="text-end bg-white shadow rounded-5 px-0 px-md-4 px-lg-5 py-5 mb-3">
					<div
						className="row row-cols-2 mx-1 g-5"
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					>
						{services.map(
							(service, index) =>
								service.category === "general" && (
									<div className="col-6" key={index}>
										<div className="card shadow-sm rounded-4 p-0">
											<div className="text-center">
												<h5 className="card-title text-white rounded-top-4 custom-bg-2 m-0 p-3">
													{language === "fa" ? service.name : service.nameEN}
												</h5>
												<img
													src={service.image}
													className="img-fluid m-0"
													style={{ width: "546.22px" }}
													alt={service.name}
												/>
												<p
													className={` card-text my-3 mx-3 text-${
														language === "fa" ? "end" : "start"
													} `}
												>
													{language === "fa"
														? service.description
														: service.descriptionEN}
												</p>
												<button
													className="btn btn-primary rounded-pill my-3"
													onClick={() =>
														(window.location.href = `/services/${service.id}`)
													}
												>
													{language === "fa" ? "مشاهده" : "Enter"}
												</button>
											</div>
										</div>
									</div>
								)
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default GeneralDoctorPrescription;
