import { useEffect, useState } from "react";
import "../cssFiles/customColors.css";
import { useLanguage } from "../components/LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";
import { FaCaretLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

function SpecialistDoctorPrescription() {
	const [services, setServices] = useState<Service[]>([]);
	const [serviceDisplayBanners, setServiceDisplayBanners] = useState<{
		[id: string]: string; // Map service id to image file URL
	}>({});

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { language } = useLanguage(); // Get language and toggle function from context
	const navigate = useNavigate();

	useEffect(() => {
		const fetchServices = async () => {
			try {
				// Attempt to fetch from the API
				const response = await axiosInstance.post(
					"/api/Service/GetAvailableServices",
					{
						serviceType: "Specialist", // Add the 'General' value to the request body
					}
				);
				if (response.status !== 200) {
					throw new Error("Failed to fetch data from API");
				}

				const servicesData: Service[] = response.data;
				setServices(servicesData); // Assuming 'data' is the correct structure

				// Fetch banners for each service ID
				const banners: { [id: string]: string } = {};
				await Promise.all(
					servicesData.map(async (service) => {
						try {
							const bannerResponse = await axiosInstance.post(
								"/api/Service/GetServiceDisplayBanner",
								{
									serviceId: service.id,
								},
								{ responseType: "blob" } // Specify blob for binary image data
							);
							const imageBlob = bannerResponse.data;
							const imageUrl = URL.createObjectURL(imageBlob); // Create a URL for the image
							banners[service.id] = imageUrl; // Map id to image URL
						} catch (bannerErr) {
							console.error(
								`Failed to fetch banner for service ID: ${service.id}`,
								bannerErr
							);
						}
					})
				);
				setServiceDisplayBanners(banners); // Update state with fetched banners

				setLoading(false);
			} catch (err) {
				console.error(
					"API request failed, trying local db.json",
					error
				);
				try {
					const response = await fetch(
						"/AvailableServicesGeneral.json"
					); // Adjust path if necessary
					if (!response.ok) {
						throw new Error("Failed to fetch data from db.json");
					}
					const data = await response.json();

					// Filter the data to get items with type "General"
					const servicesData = data.filter(
						(service: { type: string }) =>
							service.type === "Specialist"
					);

					if (servicesData.length > 0) {
						setServices(servicesData); // Update the services state with filtered data

						// Create banners object directly from servicesData
						const banners: { [id: string]: string } = {};
						servicesData.forEach(
							(service: { id: number; imageUrl: string }) => {
								banners[service.id] = service.imageUrl; // Map service.id to imageUrl
							}
						);

						setServiceDisplayBanners(banners); // Update state with fetched banners

						setLoading(false);
					} else {
						setError("No services of type 'General' found");
					}
				} catch (jsonErr) {
					console.error(
						"Failed to fetch data from both API and db.json",
						jsonErr
					);
					setError("Failed to capture services data");
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

	const handleBackClick = () => {
		navigate("/");
	};

	return (
		<div className="custom-bg-4 min-vh-100">
			<div className="container d-flex flex-column px-3 px-md-4">
				{/* Header Section with Back Button and Service Name */}
				<div className="row custom-bg-1 shadow rounded-pill p-2 p-md-3 p-lg-4 mt-4 mt-md-5 mb-3 mb-md-4">
					<div className="col-2">
						<FaCaretLeft
							type="button"
							onClick={handleBackClick}
							className="custom-back-btn"
							color="white"
						/>
					</div>
					<div className="col-8 d-flex flex-column justify-content-center text-center text-white">
						<h4 className="m-0">
							{language === "fa"
								? "خدمات پزشک متخصص و فوق تخصص"
								: "Specialist Practitioner Services"}
						</h4>
					</div>
				</div>
				<div className="text-end bg-white border border-2 shadow rounded-5 px-0 px-md-4 px-lg-5 py-5 mb-5">
					<div
						className="row row-cols-1 row-cols-md-2 g-5 mx-1"
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					>
						{services.map(
							(service, index) =>
								service.type === "Specialist" && (
									<div
										className="col-12 col-md-6"
										key={index}
									>
										<div className="card shadow-sm rounded-4 p-0">
											<div className="text-center">
												<h5 className="card-title text-white rounded-top-4 custom-bg-2 m-0 p-3">
													{language === "fa"
														? service.title
														: service.titleEN}
												</h5>
												<img
													src={
														serviceDisplayBanners[
															service.id
														] || ""
													}
													className="img-fluid m-0"
													alt={service.title}
												/>
												<p
													className={`text-justify card-text my-3 mx-3 text-${
														language === "fa"
															? "end"
															: "start"
													} `}
													dangerouslySetInnerHTML={{
														__html:
															language === "fa"
																? service.description?.replace(
																		/\n/g,
																		"<br>"
																	)
																: service.descriptionEN?.replace(
																		/\n/g,
																		"<br>"
																	),
													}}
													style={{
														direction:
															language === "fa"
																? "rtl"
																: "ltr",
														textAlign: "justify",
													}}
												></p>
												<button
													className="btn btn-primary rounded-pill my-3"
													onClick={() =>
														(window.location.href = `/services/${service.id}`)
													}
												>
													{language === "fa"
														? "مشاهده"
														: "Enter"}
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

export default SpecialistDoctorPrescription;
