import { useEffect, useState } from "react";
import "../cssFiles/customColors.css";
import { useLanguage } from "../components/LanguageContext";

interface ServiceInfo {
	[key: string]: any;
}

function UserHistory() {
	const [serviceInfo, setServiceInfo] = useState<ServiceInfo[]>([]);

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
				const services = data.userPurchasedServices;

				setServiceInfo(services);
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

	const getStatusClass = (status: string) => {
		switch (status.toLowerCase()) {
			case "complete":
				return "bg-success";
			case "processing":
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
							{serviceInfo.map((service, index) => (
								<tr
									key={service.purchaseId}
									onClick={() =>
										(window.location.href = `/purchased-services/${service.purchaseId}`)
									}
								>
									<th scope="row" className="align-middle">
										{index + 1}
									</th>
									<td className="align-middle">{service.name}</td>
									<td className="align-middle">{service.purchaseId}</td>
									<td className="align-middle">{service.purchaseDate}</td>
									<td className="align-middle">
										<span
											className={`align-middle badge ${getStatusClass(
												service.status
											)} rounded-pill`}
										>
											{service.status}
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
