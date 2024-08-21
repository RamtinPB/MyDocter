import { useEffect, useState } from "react";
import axiosInstance from "../myAPI/axiosInstance";
import { useNavigate } from "react-router-dom";

interface Service {
	name: string;
	description: string;
	price: string;
	subsidy: string;
	image: string;
	id: string;
	category: string;
}

function AdminDashboardServicesPageContent() {
	const [services, setServices] = useState<Service[]>([]);

	// Fetch services data from JSON
	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await axiosInstance.get<Service[]>("/services");
				setServices(response.data);
			} catch (err) {
				console.error("Failed to fetch services", err);
			}
		};
		fetchServices();
	}, []);

	// Add a new blank card to the appropriate category
	const addCard = (category: "general" | "specialist") => {
		const newCard: Service = {
			name: "New Service",
			description: "New description",
			price: "0",
			subsidy: "0",
			image: "/src/images/placeholder.jpg",
			id: (services.length + 1).toString(), // Generate a unique id
			category,
		};
		setServices([...services, newCard]);
	};

	// Remove a card by its unique id
	const removeCard = (id: string) => {
		const updatedServices = services.filter((service) => service.id !== id);
		setServices(updatedServices);
	};

	const navigate = useNavigate();

	const handleSubmit = () => {};

	const handleCancel = () => {};

	// Render service cards based on category
	const renderServiceCards = (category: "general" | "specialist") => {
		return (
			<div className="row m-4">
				{services
					.filter((service) => service.category === category)
					.map((service) => (
						<div className="col-md-4 mb-4" key={service.id}>
							<div className="card shadow rounded-4 p-0">
								<div className="text-center">
									<h5 className="card-title text-white rounded-top-4 custom-bg-2 m-0 p-3">
										{service.name}
									</h5>
									<img
										src={service.image}
										className="img-fluid m-0"
										alt={service.name}
									/>
									<div className="d-flex justify-content-around align-items-center">
										{/* Delete button */}
										<button
											id="btn-delete"
											className="rounded-circle btn shadow p-0 my-3"
											type="button"
											onClick={() => removeCard(service.id)} // Use unique id for deletion
										>
											<img
												src="/src/images/red-delete.png"
												className="custom-admin-btn rounded-circle"
												alt="Delete"
											/>
										</button>
										{/* Edit button */}
										<a
											href={`/edit-service/${service.id}`} // Change this
											onClick={(e) => {
												e.preventDefault();
												navigate(`/edit-service/${service.id}`);
											}}
											id="btn-edit"
											className="rounded-circle btn shadow p-0 my-3"
										>
											<img
												src="/src/images/edit-cog.png"
												className="custom-admin-btn rounded-circle"
												alt="Edit"
											/>
										</a>
									</div>
								</div>
							</div>
						</div>
					))}
				{/* Add Button for the category */}
				<div className="col-md-4 d-flex justify-content-center align-items-center mb-4">
					<button
						className="rounded-circle btn p-0 m-3 shadow"
						type="button"
						onClick={() => addCard(category)}
					>
						<img
							src="/src/images/green-add.png"
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
						{"سرویس های پزشک متخصص"}
					</h3>
				</div>
				{renderServiceCards("specialist")}
			</div>

			{/* General Services Section */}
			<div className="d-flex flex-column bg-white shadow text-end rounded-5 m-3 m-md-4 m-lg-5 ">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{"سرویس های پزشک عمومی"}
					</h3>
				</div>
				{renderServiceCards("general")}
			</div>
			{/* Submit and Cancel buttons */}
			<div className="d-flex justify-content-evenly px-3 py-2 my-2">
				<button
					className="btn btn-secondary rounded-pill px-3"
					onClick={handleCancel}
				>
					{"حذف"}
				</button>
				<button
					className="btn btn-success rounded-pill px-3"
					onClick={handleSubmit}
				>
					{"ذخیره"}
				</button>
			</div>
		</div>
	);
}

export default AdminDashboardServicesPageContent;
