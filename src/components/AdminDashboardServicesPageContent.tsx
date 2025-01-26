import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";
import { useAuth } from "./AuthContext";

interface addServiceProps {
	name: string;
	type: string;
	enabled: boolean;

	pageTitle: string;
	pageTitleEN: string;
	pageDescription: string;
	pageDescriptionEN: string;
	pageBannerUrl: string;

	reviewByDoctor: boolean;

	displayTitle: string;
	displayTitleEN: string;
	displayDescription: string;
	displayDescriptionEN: string;
	displayImageUrl: string;

	importantNotes: string;
	importantNotesEN: string;

	insurancePlanId: number | null;
	basePrice: number;

	///////////////////////////////////
	subsidy: number;
}

interface servicesProps {
	name: string;
	type: string;
	title: string;
	titleEN: string;
	imageUrl: string;
	id: string | number | undefined;
	describtion: string;
	describtionEN: string;
	usedByUser: boolean;
}

function AdminDashboardServicesPageContent() {
	const [services, setServices] = useState<servicesProps[]>([]);
	const [serviceDisplayBanners, setServiceDisplayBanners] = useState<{
		[id: string]: string; // Map service id to image file URL
	}>({});

	const [dataUpdateFlag, setDataUpdateFlag] = useState(false);
	const [newServiceUpdateFlag, setNewServiceUpdateFlag] = useState(false);

	const { language } = useLanguage(); // Get language and toggle function from context
	const { accessLevel } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await axiosInstance.post(
					"/api/Service/GetAvailableServices",
					{
						serviceType: null,
					}
				);
				if (response.status !== 200) {
					throw new Error("Failed to fetch data from API");
				}

				const servicesData: servicesProps[] = response.data;
				setServices(servicesData);

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
							banners[service.id as number] = imageUrl; // Map id to image URL
						} catch (bannerErr) {
							console.error(
								`Failed to fetch banner for service ID: ${service.id}`,
								bannerErr
							);
						}
					})
				);
				setServiceDisplayBanners(banners); // Update state with fetched banners

				setNewServiceUpdateFlag((prev) => !prev);
			} catch (err) {
				try {
					const response = await fetch("/AvailableServices.json"); // Adjust path if necessary
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					const data = await response.json();
					setServices(data);

					// Create banners object directly from servicesData
					const banners: { [id: string]: string } = {};
					data.forEach(
						(service: { id: number; imageUrl: string }) => {
							banners[service.id] = service.imageUrl; // Map service.id to imageUrl
						}
					);
					setServiceDisplayBanners(banners);
				} catch (err) {
					console.error("Failed to fetch services", err);
				}
			}
		};

		fetchServices();
	}, [dataUpdateFlag]);

	useEffect(() => {
		const updateNewServices = async () => {
			if (services && services.length > 0) {
				const newServices = services.filter(
					(service) => service.name === "NewService"
				);

				// Loop through each "NewService" and call the API to update its name
				for (const service of newServices) {
					try {
						await axiosInstance.post("/api/Admin/EditService", {
							id: service.id,
							name: `${service.type}_${service.id}`,
							type: service.type,
						});

						setDataUpdateFlag((prev) => !prev);
					} catch (error) {
						console.error(
							`Failed to update service ${service.id}`,
							error
						);
					}
				}
			}
		};
		updateNewServices();
	}, [newServiceUpdateFlag]);

	// Add a new blank card to the appropriate type
	const addCard = async (type: "General" | "Specialist") => {
		const newCard: addServiceProps = {
			name: "NewService",
			enabled: true,
			type: type,

			pageTitle: "New Service",
			pageTitleEN: "",
			pageDescription: "",
			pageDescriptionEN: "",
			pageBannerUrl: "",

			reviewByDoctor: false,

			displayTitle: "New Service",
			displayTitleEN: "",
			displayDescription: "",
			displayDescriptionEN: "",
			displayImageUrl: "",

			importantNotes: "",
			importantNotesEN: "",

			insurancePlanId: null,
			basePrice: 0,
			/////////////////////////////
			subsidy: 0,
		};

		try {
			await axiosInstance.post("/api/Admin/AddService", newCard, {
				withCredentials: true,
			});
		} catch (error) {
			console.error("Failed to add Service", error);
		}
		setDataUpdateFlag((prev) => !prev);
	};

	// Remove a card by its unique id
	const removeCard = async (id: string) => {
		try {
			const response = await axiosInstance.post(
				"/api/Admin/RemoveService",
				{
					serviceId: id,
				}
			);
			if (response.status === 200) {
				const updatedServices = services.filter(
					(service) => service.id !== id
				);
				setServices(updatedServices);
			}
		} catch (error) {
			console.error("Failed to remove Service", error);
		}
		setDataUpdateFlag((prev) => !prev);
	};

	// Render service cards based on type
	const renderServiceCards = (type: "General" | "Specialist") => {
		return (
			<div className="row m-4">
				{services
					.filter((service) => service.type === type)
					.map((service) => (
						<div className="col-md-4 mb-4" key={service.id}>
							<div className="card shadow rounded-4 p-0">
								<div className="text-center">
									<h5 className="card-title text-white rounded-top-4 custom-bg-2 m-0 p-3">
										{language === "fa"
											? service.title
											: service.titleEN}
									</h5>
									<img
										src={
											serviceDisplayBanners[
												service.id as number
											] || ""
										}
										className={`img-fluid m-0 `} //${Number(accessLevel) > 0 ? "rounded-bottom-4" : ""}
										style={{ width: "546.22px" }}
										alt={service.title}
									/>
									{Number(accessLevel) > 0 && (
										<div className="d-flex justify-content-around align-items-center">
											{/* Delete button */}
											<button
												id="btn-delete"
												className="rounded-circle btn shadow p-0 my-3"
												type="button"
												onClick={() =>
													removeCard(
														service.id as string
													)
												} // Use unique id for deletion
											>
												<img
													src="/images/red-delete.png"
													className="custom-admin-btn rounded-circle"
													alt="Delete"
												/>
											</button>
											{/* Edit button */}

											<a
												href={`/edit-service/${service.id}`} // Change this
												onClick={(e) => {
													e.preventDefault();
													navigate(
														`/edit-service/${service.id}`,
														{
															state: {
																section:
																	"servicesPage",
															}, // Pass the section as state
														}
													);
												}}
												id="btn-edit"
												className="rounded-circle btn shadow p-0 my-3"
											>
												<img
													src="/images/edit-cog.png"
													className="custom-admin-btn rounded-circle"
													alt="Edit"
												/>
											</a>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				{/* Add Button for the type */}
				{Number(accessLevel) > 0 && (
					<div className="col-md-4 d-flex justify-content-center align-items-center mb-4">
						<button
							className="rounded-circle btn p-0 m-3 shadow"
							type="button"
							onClick={() => addCard(type)}
						>
							<img
								src="/images/green-add.png"
								className="custom-admin-btn ounded-circle"
								alt="Add"
							/>
						</button>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="container custom-bg-4 shadow rounded-5 p-3 mb-4 mb-md-5">
			{/* Specialist Services Section */}
			<div className="d-flex flex-column bg-white shadow text-end rounded-5 m-3 m-md-4 m-lg-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa"
							? "سرویس های پزشک متخصص"
							: "Specialist Practitioner Services"}
					</h3>
				</div>
				{renderServiceCards("Specialist")}
			</div>

			{/* General Services Section */}
			<div className="d-flex flex-column bg-white shadow text-end rounded-5 m-3 m-md-4 m-lg-5 ">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{}
						{language === "fa"
							? "سرویس های پزشک عمومی"
							: "General Practitioner Services"}
					</h3>
				</div>
				{renderServiceCards("General")}
			</div>
		</div>
	);
}

export default AdminDashboardServicesPageContent;
