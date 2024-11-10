import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";

interface addServiceProps {
	name: string;
	enabled: boolean;
	type: string;

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
	displayBannerUrl: string;

	importantNotes: string;

	insurancePlanId: number;
	basePrice: number;
	subsidy: number;

	//////////////////////////////////
	title: string;
	titleEN: string;
	imageUrl: string;
	id: string | number | undefined;
	describtion: string;
	describtionEN: string;
	usedByUser: boolean;
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
	const [dataUpdateFlag, setDataUpdateFlag] = useState(false);
	const { language } = useLanguage(); // Get language and toggle function from context

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

				setServices(response.data);
			} catch (err) {
				try {
					const response = await fetch("/db.json"); // Adjust path if necessary
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					const data = await response.json();

					// Assuming services is an array available in the root of db.json
					setServices(data.services || []); // Default to empty array if data.services is undefined
				} catch (err) {
					console.error("Failed to fetch services", err);
				}
			}
		};

		fetchServices();
	}, [dataUpdateFlag]);

	// Add a new blank card to the appropriate type
	const addCard = async (type: "General" | "Specialist") => {
		const newCard: addServiceProps = {
			name: "New Service",
			enabled: true,
			type: type,

			pageTitle: "",
			pageTitleEN: "",
			pageDescription: "",
			pageDescriptionEN: "",
			pageBannerUrl: "",

			reviewByDoctor: false,

			displayTitle: "",
			displayTitleEN: "",
			displayDescription: "",
			displayDescriptionEN: "",
			displayBannerUrl: "",

			importantNotes: "",

			insurancePlanId: 0,
			basePrice: 0,
			subsidy: 0,

			//////////////////////////////
			title: "",
			titleEN: "",
			imageUrl: "",
			id: 0,
			describtion: "",
			describtionEN: "",
			usedByUser: false,
		};

		try {
			const response = await axiosInstance.post(
				"/api/Admin/AddService",
				newCard
			);
			if (response.status === 200) {
				setServices([...services, newCard]);
			}
		} catch (error) {
			console.error("Failed to add Service", error);
		}
		setDataUpdateFlag((prev) => !prev);
	};

	// Remove a card by its unique id
	const removeCard = async (id: string) => {
		try {
			const response = await axiosInstance.post("/api/Admin/RemoveService", {
				serviceId: id,
			});
			if (response.status === 200) {
				const updatedServices = services.filter((service) => service.id !== id);
				setServices(updatedServices);
			}
		} catch (error) {
			console.error("Failed to remove Service", error);
		}
		setDataUpdateFlag((prev) => !prev);
	};

	const navigate = useNavigate();

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
										{language === "fa" ? service.title : service.titleEN}
									</h5>
									<img
										src={service.imageUrl}
										className="img-fluid m-0"
										alt={service.title}
									/>
									<div className="d-flex justify-content-around align-items-center">
										{/* Delete button */}
										<button
											id="btn-delete"
											className="rounded-circle btn shadow p-0 my-3"
											type="button"
											onClick={() => removeCard(service.id as string)} // Use unique id for deletion
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
												navigate(`/edit-service/${service.id}`, {
													state: { section: "servicesPage" }, // Pass the section as state
												});
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
								</div>
							</div>
						</div>
					))}
				{/* Add Button for the type */}
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
			{/* Submit and Cancel buttons */}
			{/* <div className="d-flex justify-content-evenly px-3 py-2 my-2">
				<button
					className="btn btn-secondary rounded-pill px-3"
					onClick={handleCancel}
				>
					{language === "fa" ? "حذف تغییرات" : "Cancel Changes"}
				</button>
				<button
					className="btn btn-success rounded-pill px-3"
					onClick={handleSubmit}
				>
					{language === "fa" ? "ذخیره تغیرات" : "Save Changes"}
				</button>
			</div> */}
		</div>
	);
}

export default AdminDashboardServicesPageContent;
