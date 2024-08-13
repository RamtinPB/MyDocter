import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../cssFiles/myheader.css";
import "../cssFiles/customColors.css";
import Logo from "../images/Logo.png";
import NotificationDropdown from "./NotificationDropdown";
import UserOffCanvas from "./UserOffCanvas"; // Import the new component

interface UserProfile {
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
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(true);
	const [isLoggedInAdmin, setisLoggedInAdmin] = useState(false);

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const response = await axios.get<UserProfile>(
					"http://localhost:3001/userInfo"
				);
				setUserProfile(response.data);
				setLoading(false);
			} catch (err) {
				setError("Failed to fetch user information");
				setLoading(false);
			}
		};

		fetchUserProfile();
	}, []);

	if (loading) {
		return <div className="text-center my-5">Loading...</div>;
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	const username = userProfile
		? `${userProfile.firstName} ${userProfile.lastName}`
		: "";

	return (
		<>
			<nav className="navbar navbar-expand-lg custom-header shadow-lg sticky-top">
				<div className="container d-flex justify-content-between py-1">
					<div className="d-flex justify-content-between gap-3">
						{isLoggedIn ? (
							<button
								className="btn d-flex align-items-center justify-content-between custom-loggedin-btn custom-bg-2 border border-1 rounded-pill ps-0 ms-0"
								type="button"
								data-bs-toggle="offcanvas"
								data-bs-target="#myOffcanvas"
								aria-controls="myOffcanvas"
							>
								{userProfile && userProfile.profilePicture ? (
									<img
										src={userProfile.profilePicture}
										alt="Profile"
										className="img-fluid rounded-circle border border-3 border-light"
										style={{ width: "40px", height: "40px" }}
									/>
								) : (
									<FaUser
										className="rounded-circle border border-2 border-light p-1"
										style={{ width: "40px", height: "40px" }}
										color="white"
									/>
								)}
								<span className="text-white text-end pe-2 ps-4">
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
							className="d-inline-block align-top img-fluid custom-logo"
							alt="Logo"
						/>
					</Link>
				</div>
			</nav>
			<UserOffCanvas
				userProfile={userProfile}
				isLoggedInAdmin={isLoggedInAdmin}
			/>
		</>
	);
}

export default MyHeader;
