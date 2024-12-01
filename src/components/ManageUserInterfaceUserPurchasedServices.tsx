import { useEffect, useState } from "react";
import "../cssFiles/customColors.css";
import { useLanguage } from "../components/LanguageContext";
import { useParams } from "react-router-dom";
import axiosInstance from "../myAPI/axiosInstance";

interface purchasedServiceInfo {
	id: string;
	serviceId: string;
	serviceName: string;
	serviceStatus: string;
	lastUpdate: string;
}

function ManageUserInterfaceUserPurchasedServices() {
	const { userId } = useParams<{ userId: string }>(); // Retrieve userId from the URL
	const [purchasedserviceInfo, setPurchasedServiceInfo] = useState<
		purchasedServiceInfo[]
	>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axiosInstance.post("/api/User/GetUserProfile");
				if (response.status !== 200) {
					throw new Error("Failed to fetch data from API");
				}

				setPurchasedServiceInfo(response.data.purchasedServices);
				setLoading(false);
			} catch (err) {
				setError(err as string);
			}
		};

		fetchUserData();
	}, [userId]);

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
		<div className="container custom-bg-4 shadow rounded-5 p-3 mb-4 mb-md-5">
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
									{language === "fa" ? "تاریخ آخرین تغییر" : "Last Update Date"}
								</th>
								<th scope="col">
									{language === "fa" ? "وضعیت پیگیری" : "Status"}
								</th>
							</tr>
						</thead>
						<tbody>
							{purchasedserviceInfo.map((service, index) => (
								<tr
									key={service.serviceId}
									onClick={() =>
										(window.location.href = `/purchased-services/${service.id}`)
									}
								>
									<th scope="row" className="align-middle">
										{index + 1}
									</th>
									<td className="align-middle">{service.serviceName}</td>
									<td className="align-middle">{service.id}</td>
									<td className="align-middle">{service.lastUpdate}</td>
									<td className="align-middle">
										<span
											className={`align-middle badge ${getStatusClass(
												service.serviceStatus
											)} rounded-pill`}
										>
											{service.serviceStatus}
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

export default ManageUserInterfaceUserPurchasedServices;
