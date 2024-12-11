import { useEffect, useState } from "react";
import "../cssFiles/customColors.css";
import { useLanguage } from "../components/LanguageContext";
import { useParams } from "react-router-dom";
import axiosInstance from "../myAPI/axiosInstance";

interface purchasedServiceInfo {
	id: string;
	serviceId: string;
	userId: string;
	result: string;
	finalPrice: string;
	status: string;
	lastUpdateTime: string;
	approvedByDoctor: string;
	date: string;
	service: {
		id: string;
		pageTitle: string;
		pageTitleEN: string;
	};
}

const getStatusString = (status: number, language: string) => {
	switch (status) {
		case 0:
			return language === "fa" ? "مقداردهی" : "Initializing";
		case 1:
			return language === "fa" ? "تکمیل شده" : "Completed";
		case 2:
			return language === "fa" ? "ناموفق" : "Failed";
		case 3:
			return language === "fa" ? "در انتظار" : "Waiting";
		case 4:
			return language === "fa" ? "پردازش" : "Processing";
		case 5:
			return language === "fa" ? "لغو شد" : "Cancelled";
	}
};

const getStatusClass = (status: string) => {
	switch (status) {
		case "complete":
			return "bg-success";
		case "processing":
			return "bg-warning";
		case "Failed":
			return "bg-danger";
		case "Cancelled":
			return "bg-danger";
		default:
			return "bg-secondary";
	}
};

function formatDate(input: string | undefined): string {
	if (!input) {
		return "Invalid Date"; // Return a default or error message if input is undefined
	}
	// Split the input string into date and time parts
	const [date, time] = input.split("T");

	// Replace the dashes in the date with slashes
	const formattedDate = date.replace(/-/g, "/");

	// Return the final formatted string
	return `${time} - ${formattedDate}`;
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
		axiosInstance
			.post(
				"/api/Admin/GetUserPurchasedServices",
				{ userId: userId },
				{ withCredentials: true }
			)
			.then((response) => {
				if (response.status !== 200) {
					throw new Error("Failed to fetch data from API");
				}

				const updatedData = response.data.map((item: purchasedServiceInfo) => ({
					...item,
					status: getStatusString(Number(item.status), language),
					lastUpdateTime: formatDate(item.lastUpdateTime),
				}));

				setPurchasedServiceInfo(updatedData);
				setLoading(false);
			})
			.catch((error) => {
				console.error(error); // Log the error for debugging
				setError("Failed to load purchased services. Please try again later.");
			});
	}, []);

	if (loading) {
		return <div className="text-center my-5">Loading...</div>;
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	return (
		<div className="container py-5 min-vh-100">
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
									(window.location.href = `/purchased-services/${service.id}/${service.userId}`)
								}
							>
								<th scope="row" className="align-middle">
									{index + 1}
								</th>
								<td className="align-middle">
									{language === "fa"
										? service.service.pageTitle
										: service.service.pageTitleEN}
								</td>
								<td className="align-middle">{service.id}</td>
								<td className="align-middle">{service.lastUpdateTime}</td>
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
	);
}

export default ManageUserInterfaceUserPurchasedServices;
