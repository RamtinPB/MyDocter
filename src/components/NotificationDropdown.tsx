import { useState, useEffect } from "react";
import { FaBell, FaRegBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import "/src/cssFiles/myheader.css";
import { useLanguage } from "./LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";

interface notificationProps {
	id: number;
	userId: number;
	message: string;
	targetUrl: string;
	type: string;
	dateTime: string;
	seen: boolean;
}

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

const NotificationDropdown = () => {
	const [notifications, setNotifications] = useState<notificationProps[]>([]);
	const [hasNewNotification, setHasNewNotification] = useState(false);

	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await axiosInstance.post(
					"/api/User/GetNotifications",
					{
						from: 0,
						count: 5, // Fetch the 5 most recent notifications
					}
				);

				if (response.status !== 200) {
					throw new Error("Failed to fetch notifications from API");
				}

				const apiNotifications = response.data.map((notif: any) => ({
					id: notif.id.toString(), // Convert to string if needed
					message: notif.message,
					link: notif.targetUrl,
					status: notif.Type, // Optional if you need to handle types
					seen: notif.seen,
					dateTime: notif.dateTime,
				}));

				// Merge with local storage (preserving seen state if already stored)
				const storedNotifications = JSON.parse(
					localStorage.getItem("notifications") || "[]"
				);

				const combinedNotifications = apiNotifications.map(
					(newNotif: { id: number }) => {
						const existingNotif = storedNotifications.find(
							(notif: any) => notif.id === newNotif.id
						);
						return existingNotif
							? { ...existingNotif, ...newNotif }
							: newNotif;
					}
				);

				const sortedNotifications = combinedNotifications
					.sort(
						(a: { timestamp: number }, b: { timestamp: number }) =>
							b.timestamp - a.timestamp
					)
					.slice(0, 5);

				setNotifications(sortedNotifications);
				localStorage.setItem(
					"notifications",
					JSON.stringify(sortedNotifications)
				);

				// Check for unseen notifications
				setHasNewNotification(
					sortedNotifications.some(
						(notif: { seen: boolean }) => !notif.seen
					)
				);
			} catch (error) {
				console.error("Error fetching notifications:", error);
			}
		};

		fetchNotifications();
	}, [language]);

	console.log(notifications);

	const handleNotificationClick = (notificationId: number) => {
		const updatedNotifications = notifications.map((notif) =>
			notif.id === notificationId ? { ...notif, seen: true } : notif
		);
		setNotifications(updatedNotifications);
		localStorage.setItem(
			"notifications",
			JSON.stringify(updatedNotifications)
		);
		setHasNewNotification(
			updatedNotifications.some((notif) => !notif.seen)
		);
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
					<FaRegBell
						className="custom-notification-btn"
						color="white"
					/>
				)}
			</button>

			{notifications.length > 0 && (
				<div className="dropdown-menu dropdown-menu-center position-absolute top-100 start-50 translate-middle-x mt-3 shadow-sm">
					{notifications.map((notification) => (
						<Link
							to={notification.targetUrl}
							key={notification.id} // Using purchaseId-status for unique keys
							className={`dropdown-item text-${
								language === "fa" ? "end" : "start"
							} ${notification.seen ? "text-muted" : "font-weight-bold"}`}
							onClick={() =>
								handleNotificationClick(notification.id)
							}
						>
							{notification.message.concat(
								` - ${formatDate(notification.dateTime)}`
							)}
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default NotificationDropdown;
