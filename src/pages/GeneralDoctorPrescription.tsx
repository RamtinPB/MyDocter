import { useEffect, useState } from "react";
import "../cssFiles/customColors.css";
import axios from "axios";

interface Service {
	name: string;
	description: string;
	image: string;
	id: string;
	category: string;
}

function GeneralDoctorPrescription() {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await axios.get<Service[]>(
					"http://localhost:3001/services"
				);
				setServices(response.data);
				setLoading(false);
			} catch (err) {
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
		<div className="custom-bg-4">
			<div className="container d-flex flex-column px-3 px-md-4">
				<div className="custom-bg-1 d-flex justify-content-center align-items-center text-white rounded-pill shadow p-2 p-md-3 p-lg-4 mt-4 mt-md-5 mb-3 mb-md-4">
					<h4>خدمات پزشک عمومی</h4>
				</div>
				<div className="text-end bg-white shadow rounded-5 px-0 px-md-4 px-lg-5 py-5 mb-3">
					<div className="row row-cols-2 mx-1 g-5" style={{ direction: "rtl" }}>
						{services.map(
							(service, index) =>
								service.category === "general" && (
									<div className="col-6" key={index}>
										<div className="card shadow-sm rounded-4 p-0">
											<div className="text-center">
												<h5 className="card-title text-white rounded-top-4 custom-bg-2 m-0 p-3">
													{service.name}
												</h5>
												<img
													src={service.image}
													className="img-fluid m-0"
													style={{ width: "546.22px" }}
													alt={service.name}
												/>
												<p className="card-text my-3 mx-3 text-end">
													{service.description}
												</p>
												<button
													className="btn btn-primary rounded-pill my-3"
													onClick={() =>
														(window.location.href = `/services/${service.id}`)
													}
												>
													مشاهده
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
