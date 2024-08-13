import { useState, useEffect } from "react";
import { FaBell, FaRegBell } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

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
	const [dropdownVisible, setDropdownVisible] = useState(false);

	useEffect(() => {
		// Fetch user purchased services from the server
		axios
			.get("http://localhost:3001/userPurchasedServices")
			.then((response) => {
				setUserPurchasedServices(response.data);
			})
			.catch((error) => {
				console.error("Error fetching purchased services:", error);
			});
	}, []);

	useEffect(() => {
		const storedNotifications = JSON.parse(
			localStorage.getItem("notifications") || "[]"
		);

		const newNotifications = userPurchasedServices.map((service) => {
			// Generate a unique ID for each service status change using purchaseId
			const notificationId = `${service.purchaseId}-${service.status}`;

			return {
				id: notificationId,
				message: `Service "${service.name}" status changed to ${service.status}`,
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
	}, [userPurchasedServices]);

	const handleNotificationClick = (notificationId: string) => {
		const updatedNotifications = notifications.map((notif) =>
			notif.id === notificationId ? { ...notif, seen: true } : notif
		);
		setNotifications(updatedNotifications);
		localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
		setHasNewNotification(updatedNotifications.some((notif) => !notif.seen));
	};

	const toggleDropdown = () => {
		setDropdownVisible(!dropdownVisible);
	};

	return (
		<div className="position-relative">
			<button className="btn rounded-circle m-0 p-0" onClick={toggleDropdown}>
				{hasNewNotification ? (
					<FaBell style={{ width: "28px", height: "28px" }} color="white" />
				) : (
					<FaRegBell style={{ width: "28px", height: "28px" }} color="white" />
				)}
			</button>
			{dropdownVisible && notifications.length > 0 && (
				<div className="dropdown-menu dropdown-menu-end mt-3 shadow-sm show">
					{notifications.map((notification) => (
						<Link
							to={notification.link}
							key={notification.id} // Using purchaseId-status for unique keys
							className={`dropdown-item ${
								notification.seen ? "text-muted" : "font-weight-bold"
							}`}
							onClick={() => handleNotificationClick(notification.id)}
						>
							{notification.message}
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default NotificationDropdown;
