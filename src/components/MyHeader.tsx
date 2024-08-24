import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "/src/cssFiles/myheader.css";
import "/src/cssFiles/customColors.css";
import Logo from "../images/Logo.png";
import NotificationDropdown from "./NotificationDropdown";
import UserOffCanvas from "./UserOffCanvas"; // Import the new component
import { useLanguage } from "./LanguageContext";

interface UserData {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	userAge: string;
	userHeight: string;
	userWeight: string;
	userGender: string;
	profilePicture: string;
}

function MyHeader() {
	const [userData, setUserData] = useState<UserData | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [isLoggedIn, setIsLoggedIn] = useState(true);
	const [isLoggedInAdmin, setisLoggedInAdmin] = useState(true);

	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await fetch("/db.json"); // Adjust path if necessary
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();

				// Assuming the userInfo is directly available in the root of db.json
				const userInfo = data.userInfo;

				setUserData(userInfo);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching user information:", err);
				setError("Failed to fetch user information");
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	if (loading) {
		return <div className="text-center my-5">Loading...</div>;
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	// @ts-ignore
	const handleIsLoggedIn = () => {
		setIsLoggedIn(true);
	};

	// @ts-ignore
	const handleisLoggedInAdmin = () => {
		setisLoggedInAdmin(true);
	};

	const username =
		userData && userData.firstName && userData.lastName
			? `${userData.firstName} ${userData.lastName}`
			: userData?.phoneNumber || ""; // Fallback to phone number if firstName and lastName are missing

	return (
		<>
			<nav className="navbar navbar-expand-lg custom-header shadow-lg sticky-top">
				<div className="container d-flex justify-content-between py-lg-1 py-0">
					<div className="d-flex justify-content-between align-items-center gap-3">
						{isLoggedIn ? (
							<button
								className="btn d-flex align-items-center justify-content-between custom-loggedin-btn custom-bg-2 border border-1 rounded-pill ps-0 ms-0"
								type="button"
								data-bs-toggle="offcanvas"
								data-bs-target="#myOffcanvas"
								aria-controls="myOffcanvas"
							>
								{userData && userData.profilePicture ? (
									<img
										src={userData.profilePicture}
										alt="Profile"
										className="img-fluid custom-user-img-icon rounded-circle border border-3 border-light"
									/>
								) : (
									<FaUser
										className="rounded-circle custom-user-img-icon border border-2 border-light p-1"
										color="white"
									/>
								)}
								<span
									className={`text-white text-${
										language === "fa" ? "end" : "start"
									} pe-2 ps-4`}
								>
									{username}
								</span>
							</button>
						) : (
							<Link to="/login">
								<img
									src="\src\images\Login Button.png"
									alt="Login"
									className="d-inline-block custom-login-btn rounded-pill"
								/>
							</Link>
						)}
						<NotificationDropdown />
					</div>
					<Link className="nav-link" to="/">
						<img
							src={Logo}
							className="img-fluid custom-logo d-inline-block align-top "
							alt="Logo"
						/>
					</Link>
				</div>
			</nav>
			<UserOffCanvas userData={userData} isLoggedInAdmin={isLoggedInAdmin} />
		</>
	);
}

export default MyHeader;
