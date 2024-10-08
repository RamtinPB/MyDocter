import { useState, useEffect } from "react";
import { FaBell, FaRegBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import "/src/cssFiles/myheader.css";
import { useLanguage } from "./LanguageContext";

interface PurchasedService {
	name: string;
	id: string;
	purchaseDate: string;
	finalPurchaseAmount: string;
	purchaseId: string; // Using purchaseId for uniqueness
	link: string;
	status: string;
	files?: Array<{
		fileName: string;
		fileType: string;
		fileUrl: string;
	}>;
	userInput?: string;
}

const NotificationDropdown = () => {
	const [userPurchasedServices, setUserPurchasedServices] = useState<
		PurchasedService[]
	>([]);

	const [notifications, setNotifications] = useState<any[]>([]);
	const [hasNewNotification, setHasNewNotification] = useState(false);

	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		const fetchUserPurchasedServices = async () => {
			try {
				const response = await fetch("/db.json"); // Adjust path if necessary
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();

				// Assuming userPurchasedServices is directly available in the root of db.json
				const userPurchasedServices = data.userPurchasedServices;

				setUserPurchasedServices(userPurchasedServices);
			} catch (error) {
				console.error("Error fetching purchased services:", error);
			}
		};

		fetchUserPurchasedServices();
	}, []);

	useEffect(() => {
		const storedNotifications = JSON.parse(
			localStorage.getItem("notifications") || "[]"
		);

		const newNotifications = userPurchasedServices.map((service) => {
			// Generate a unique ID for each service status change using purchaseId
			const notificationId = `${service.purchaseId}-${service.status}`;

			// Conditionally create the message based on the language
			const message =
				language === "fa"
					? `تغییر کرده است ${service.status} وضعیت سرویس ${service.name} به`
					: `has changed to ${service.status} ${service.name} The status of the service `;

			return {
				id: notificationId,
				message: message, // Use the conditionally set message here
				link: service.link,
				status: service.status,
				seen: false,
				timestamp: new Date().getTime(), // Store the current timestamp
			};
		});

		// Combine new and existing notifications, preserving the "seen" status
		const combinedNotifications = newNotifications.map((newNotif) => {
			const existingNotif = storedNotifications.find(
				(notif: any) => notif.id === newNotif.id
			);
			return existingNotif ? { ...existingNotif, ...newNotif } : newNotif;
		});

		// Sort notifications based on the timestamp (most recent first)
		const sortedNotifications = combinedNotifications
			.sort((a, b) => b.timestamp - a.timestamp)
			.slice(0, 5); // Limit to the 5 most recent

		setNotifications(sortedNotifications);
		localStorage.setItem("notifications", JSON.stringify(sortedNotifications));

		// Check if there are any unseen notifications
		const hasNew = sortedNotifications.some((notif) => !notif.seen);
		setHasNewNotification(hasNew);
	}, [userPurchasedServices, language]); // <== Make sure language is here

	const handleNotificationClick = (notificationId: string) => {
		const updatedNotifications = notifications.map((notif) =>
			notif.id === notificationId ? { ...notif, seen: true } : notif
		);
		setNotifications(updatedNotifications);
		localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
		setHasNewNotification(updatedNotifications.some((notif) => !notif.seen));
	};

	return (
		<div className="dropdown position relative">
			<button
				className="btn rounded-circle m-0 p-0"
				type="button"
				data-bs-toggle="dropdown"
				aria-expanded={false}
			>
				{hasNewNotification ? (
					<FaBell className="custom-notification-btn" color="white" />
				) : (
					<FaRegBell className="custom-notification-btn" color="white" />
				)}
			</button>

			<div className="dropdown-menu dropdown-menu-center position-absolute top-100 start-50 translate-middle-x mt-3 shadow-sm">
				{notifications.map((notification) => (
					<Link
						to={notification.link}
						key={notification.id} // Using purchaseId-status for unique keys
						className={`dropdown-item text-${
							language === "fa" ? "end" : "start"
						} ${notification.seen ? "text-muted" : "font-weight-bold"}`}
						onClick={() => handleNotificationClick(notification.id)}
					>
						{notification.message}
					</Link>
				))}
			</div>
		</div>
	);
};

export default NotificationDropdown;
