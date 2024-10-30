import { useEffect, useState } from "react";
import "../cssFiles/customColors.css";
import { useLanguage } from "../components/LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";

interface PurchasedServicesProp {
	id: string;
	serviceId: string;
	serviceName: string;
	status: string;
	lastUpdateTime: string;
}

function UserHistory() {
	const [purchasedServicesData, setPurchasedServicesData] = useState<
		PurchasedServicesProp[]
	>([]);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { language } = useLanguage(); // Get language and toggle function from context

	// Fetch purchased services of a specific user
	useEffect(() => {
		axiosInstance
			.post("/api/Service/GetUserPurchasedServices")
			.then((response) => {
				const purchasedServices = response.data;
				setPurchasedServicesData(purchasedServices);
				setError(null); // Clear any previous errors on success
			})
			.catch((apiError) => {
				console.error(
					"API request for purchased services failed. Trying local db.json",
					apiError
				);
				setError(
					"Failed to fetch purchased services from API. Trying local data."
				);

				// Fetch from local db.json if API fails
				fetch("/db.json")
					.then((response) => {
						if (!response.ok) {
							throw new Error(
								"Failed to fetch purchased services from db.json"
							);
						}
						return response.json();
					})
					.then((data) => {
						const services = data.userPurchasedServices;
						setPurchasedServicesData(services);
						setError(null); // Clear any previous errors on success
					})
					.catch((jsonError) => {
						console.error(
							"Failed to fetch purchased services from both API and db.json",
							jsonError
						);
						setError(
							"Failed to fetch purchased services from both API and local data."
						);
					})
					.finally(() => {
						setLoading(false); // Ensure loading is false after all attempts
					});
			})
			.finally(() => {
				setLoading(false); // Ensure loading is false if API request succeeds
			});
	}, []);

	if (loading) {
		return <div className="text-center my-5">Loading...</div>;
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	const getStatusClass = (status: string) => {
		switch (status.toLowerCase()) {
			case "Complete":
				return "bg-success";
			case "Active":
				return "bg-warning";
			case "error":
				return "bg-danger";
			default:
				return "bg-secondary";
		}
	};

	return (
		<div className="custom-bg-4 min-vh-100">
			<div className="container py-5">
				<div className="bg-white border border-3 border-primary rounded-5 p-3">
					<table
						className="table table-hover text-center"
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					>
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">
									{language === "fa" ? "نام سرویس" : "Service Name"}
								</th>
								<th scope="col">
									{language === "fa" ? "شماره سریال تراکنش" : "Purchase ID"}
								</th>
								<th scope="col">
									{language === "fa" ? "تاریخ خریداری" : "Purchase Date"}
								</th>
								<th scope="col">
									{language === "fa" ? "وضعیت پیگیری" : "Status"}
								</th>
							</tr>
						</thead>
						<tbody>
							{purchasedServicesData.map((purchasedSurvice, index) => (
								<tr
									key={purchasedSurvice.id}
									onClick={() =>
										(window.location.href = `/purchased-services/${purchasedSurvice.id}`)
									}
								>
									<th scope="row" className="align-middle">
										{index + 1}
									</th>
									<td className="align-middle">
										{purchasedSurvice.serviceName}
									</td>
									<td className="align-middle">{purchasedSurvice.id}</td>
									<td className="align-middle">
										{purchasedSurvice.lastUpdateTime}
									</td>
									<td className="align-middle">
										<span
											className={`align-middle badge ${getStatusClass(
												purchasedSurvice.status
											)} rounded-pill`}
										>
											{purchasedSurvice.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default UserHistory;
