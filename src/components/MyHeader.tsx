import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	FaUser,
	FaInfo,
	FaBriefcaseMedical,
	FaBookMedical,
	FaUserNurse,
	FaUserTie,
} from "react-icons/fa";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "../cssFiles/myheader.css";
import "../cssFiles/customColors.css";
import { FaClockRotateLeft, FaHouse, FaUserDoctor } from "react-icons/fa6";

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
	const [isServicesOpen, setIsServicesOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(true);
	const [isLoggedInAdmin, setisLoggedInAdmin] = useState(false);

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const response = await axios.get<UserProfile>(
					"http://localhost:3001/userinfo"
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

	// @ts-ignore
	const checkLoggedIn = () => {
		setIsLoggedIn(true);
	};

	// @ts-ignore
	const checkLoggedInAdmin = () => {
		setisLoggedInAdmin(true);
	};

	const toggleServices = () => {
		setIsServicesOpen(!isServicesOpen);
	};

	const username = userProfile
		? `${userProfile.firstName} ${userProfile.lastName}`
		: "";

	return (
		<>
			<nav className="navbar navbar-expand-lg custom-header shadow-lg sticky-top ">
				<div className="container d-flex justify-content-between  py-1">
					{isLoggedIn ? (
						<button
							className="btn d-flex align-items-center justify-content-between custom-loggedin-btn custom-bg-2 border border-1 rounded-pill ps-0 ms-0"
							itemType="button"
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
									className=" rounded-circle border border-2 border-light p-1"
									style={{ width: "40px", height: "40px" }}
									color="white"
								/>
							)}
							<span className="text-white text-end pe-2 ps-4">{username}</span>
						</button>
					) : (
						<Link to="/login">
							<img
								src="src\images\Login Button.png"
								alt="Login"
								className="d-inline-block custom-login-btn rounded-pill"
							/>
						</Link>
					)}
					<Link className="nav-link" to="/">
						<img
							src="src/images/Logo.png"
							className="d-inline-block align-top img-fluid custom-logo"
							alt="Logo"
						/>
					</Link>
				</div>
			</nav>
			<div
				className="offcanvas offcanvas-start"
				tabIndex={-1}
				id="myOffcanvas"
				aria-labelledby="myOffcanvasLabel"
			>
				<div className="offcanvas-header d-flex justify-content-between align-items-center custom-bg-sidebar-1 shadow-lg">
					<button
						className="rounded-circle btn p-0"
						itemType="button"
						data-bs-dismiss="offcanvas"
						aria-label="Close"
					>
						<img
							src="src\images\x-noBorder.png"
							className="rounded-circle"
							style={{ width: "40px", height: "40px" }}
						/>
					</button>
					<h3 className="offcanvas-title text-white" id="myOffcanvasLabel">
						داشبورد کاربر
					</h3>
				</div>
				<div className="offcanvas-body shadow p-0">
					<div className="d-flex flex-column justify-content-center align-items-center custom-bg-2">
						{userProfile?.profilePicture ? (
							<img
								src={userProfile.profilePicture}
								alt="Profile"
								className="img-fluid rounded-circle border border-2 border-light my-3 mx-4"
								style={{ width: "100px", height: "100px" }}
							/>
						) : (
							<FaUser
								className=" rounded-circle border border-2 border-light mt-3 mb-1 mx-4 p-1"
								style={{ width: "100px", height: "100px" }}
								color="white"
							/>
						)}
						<span className="text-white text-center rounded-pill mb-2 py-1 px-3">
							{username}
						</span>
					</div>
					<div className="dropdown-menu d-flex flex-column text-end custom-bg-sidebar-3 border-0 rounded-0 w-100 h-100 gap-2">
						<Link
							to="/"
							className="d-flex align-items-center justify-content-end dropdown-item rounded-3 pe-2"
						>
							<span className="pe-2"> صفحه اصلی</span>
							<FaHouse />
						</Link>
						<hr className="m-0 p-0" />
						<Link
							to="/UserInformation"
							className="d-flex align-items-center justify-content-end dropdown-item rounded-3 pe-2"
						>
							<span className="pe-2"> ویرایش اطلاعات کاربر</span>
							<FaInfo />
						</Link>
						<hr className="m-0 p-0" />
						<Link
							to="/InitialEvaluation"
							className="d-flex align-items-center justify-content-end dropdown-item rounded-3 pe-2"
						>
							<span className="pe-2"> فرم ارزیابی اولیه کاربر</span>
							<FaBookMedical />
						</Link>
						<hr className="m-0 p-0" />
						<button
							className=" d-flex align-items-center justify-content-end me-2 dropdown-item rounded-3 btn btn-link text-end mb-0 pb-0 pe-2 me-0"
							type="button"
							onClick={toggleServices}
							aria-expanded={isServicesOpen}
							aria-controls="servicesCollapse"
						>
							<span className="pe-2">خدمات</span>
							<FaBriefcaseMedical />
						</button>
						<div
							className={`collapse ${isServicesOpen ? "show" : ""}`}
							id="servicesCollapse"
						>
							<ul className="list-unstyled mb-0">
								<li className="d-flex align-items-center ">
									<Link
										to="/GeneralDoctorPrescription"
										className="dropdown-item rounded-3"
									>
										<span className="pe-2"> خدمات پزشک عمومی</span>
										<FaUserNurse />
									</Link>
								</li>
								<li className="d-flex align-items-center">
									<Link
										to="/SpecialistDoctorPrescription"
										className="dropdown-item rounded-3"
									>
										<span className="pe-2"> خدمات پزشک متخصص و فوق تخصص</span>
										<FaUserDoctor />
									</Link>
								</li>
							</ul>
						</div>
						<hr className="m-0 p-0" />
						<Link
							to="/UserHistory"
							className="d-flex align-items-center justify-content-end dropdown-item rounded-3 pe-2"
						>
							<span className="pe-2"> تاریخچه خدمات</span>
							<FaClockRotateLeft />
						</Link>

						{isLoggedInAdmin && (
							<>
								<hr className="m-0 p-0" />
								<Link
									to="AdminDashboard"
									className="d-flex align-items-center justify-content-end dropdown-item rounded-3 pe-2"
								>
									<span className="pe-2">داشبورد مدیر</span>
									<FaUserTie />
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default MyHeader;
