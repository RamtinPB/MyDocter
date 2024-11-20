import { useEffect, useState } from "react";
import "../cssFiles/customColors.css";
import { useLanguage } from "../components/LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";

interface Service {
	name: string;

	title: string;
	titleEN: string;

	description: string;
	descriptionEN: string;

	imageUrl: string;
	id: string;
	type: string;
	usedByUser: boolean;
}

function GeneralDoctorPrescription() {
	const [services, setServices] = useState<Service[]>([]);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		const fetchServices = async () => {
			try {
				// Attempt to fetch from the API
				const response = await axiosInstance.post(
					"/api/Service/GetAvailableServices",
					{
						serviceType: "General", // Add the 'General' value to the request body
					}
				);
				if (response.status !== 200) {
					throw new Error("Failed to fetch data from API");
				}

				setServices(response.data); // Assuming 'data' is the correct structure
				setLoading(false);
			} catch (err) {
				console.error("API request failed, trying local db.json", err);

				// Fallback to fetching from db.json if API request fails
				try {
					const response = await fetch("/db.json"); // Adjust the path to your static JSON file
					if (!response.ok) {
						throw new Error("Failed to fetch data from db.json");
					}

					const data = await response.json();
					setServices(data.services); // Assuming 'homeTextData' is the key in your JSON structure
					setLoading(false);
				} catch (jsonErr) {
					console.error(
						"Failed to fetch data from both API and db.json",
						jsonErr
					);
					setError("Failed to fetch data from both API and local fallback.");
					setLoading(false);
				}
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
						className="row row-cols-1 row-cols-md-2 mx-1 g-5"
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					>
						{services.map(
							(service, index) =>
								service.type === "General" && (
									<div className="col-12 col-md-6" key={index}>
										<div className="card shadow-sm rounded-4 p-0">
											<div className="text-center">
												<h5 className="card-title text-white rounded-top-4 custom-bg-2 m-0 p-3">
													{language === "fa" ? service.title : service.titleEN}
												</h5>
												<img
													src={service.imageUrl}
													className="img-fluid m-0"
													style={{ width: "546.22px" }}
													alt={service.title}
												/>
												<p
													className={`text-justify card-text my-3 mx-3 text-${
														language === "fa" ? "end" : "start"
													} `}
													dangerouslySetInnerHTML={{
														__html:
															language === "fa"
																? service.description?.replace(/\n/g, "<br>")
																: service.descriptionEN?.replace(/\n/g, "<br>"),
													}}
													style={{
														direction: language === "fa" ? "rtl" : "ltr",
														textAlign: "justify",
													}}
												></p>
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
