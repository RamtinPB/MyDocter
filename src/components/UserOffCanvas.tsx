import { Link } from "react-router-dom";
import {
	FaUser,
	FaInfo,
	FaBookMedical,
	FaBriefcaseMedical,
	FaUserNurse,
	FaUserTie,
} from "react-icons/fa";
import { FaClockRotateLeft, FaHouse, FaUserDoctor } from "react-icons/fa6";
import { useEffect, useState } from "react";
import "/src/cssFiles/myoffcanvas.css";
import "/src/cssFiles/textOverflow.css";
import { useLanguage } from "./LanguageContext";
import { LuLogOut } from "react-icons/lu";
import { useAuth } from "./AuthContext";
import axiosInstance from "../myAPI/axiosInstance";
import { useProfile } from "./ProfileContext";
import NewTransactionModal from "./NewTransactionModal";

interface UserData {
	name: string;
	lastName: string;
	email: string;
	phoneNumber: string;
}

interface UserOffCanvasProps {
	userData: UserData | null;
	isLoggedInAdmin: boolean;
}

function UserOffCanvas({ userData, isLoggedInAdmin }: UserOffCanvasProps) {
	const [offcanvasClass, setOffcanvasClass] = useState("offcanvas-top");
	const [showModal, setShowModal] = useState(false);
	const toggleModal = () => setShowModal(!showModal);

	const [userBalance, setUserBalance] = useState<number>(0);

	const [profilePicture, setProfilePicture] = useState<string | null>(null);

	const { language } = useLanguage(); // Get language and toggle function from context
	const { setAuthData } = useAuth();
	const { profileImageVersion } = useProfile();

	useEffect(() => {
		axiosInstance
			.post(`/api/User/GetUserData`)
			.then((response) => {
				const userbal = response.data.balance;
				setUserBalance(userbal);
			})
			.catch(async (error) => {
				console.error(
					"API request failed, trying local db.json",
					error
				);
				try {
					const response = await fetch("/UserInformation.json"); // Adjust path if necessary
					if (!response.ok) {
						throw new Error("Failed to fetch data from db.json");
					}
					const data = await response.json();

					setUserBalance(data.balance);
				} catch (jsonErr) {
					console.error(
						"Failed to fetch data from both API and db.json",
						jsonErr
					);
				}
			});
	}, [userBalance]);

	useEffect(() => {
		axiosInstance
			.post(
				`/api/User/GetProfileImage?version=${profileImageVersion}`,
				{},
				{ responseType: "blob" }
			) // Specify blob as the response type
			.then((response) => {
				const imageBlob = response.data; // Binary image data
				const imageUrl = URL.createObjectURL(imageBlob); // Create a URL for the image
				setProfilePicture(imageUrl); // Set the profile picture state
			})
			.catch(async (error) => {
				console.error(
					"API request failed, trying local db.json",
					error
				);
				try {
					const response = await fetch("/ProfileImage.json"); // Adjust path if necessary
					if (!response.ok) {
						throw new Error("Failed to fetch data from db.json");
					}
					const data = await response.json();
					setProfilePicture(data);
				} catch (jsonErr) {
					console.error(
						"Failed to fetch data from both API and db.json",
						jsonErr
					);
					setProfilePicture(null);
				}
			});
	}, [profileImageVersion]);

	// Clean up the object URL when the component unmounts
	useEffect(() => {
		return () => {
			if (profilePicture) {
				URL.revokeObjectURL(profilePicture);
			}
		};
	}, [profilePicture]);

	useEffect(() => {
		// Function to check the screen size and update the offcanvas class
		const updateOffcanvasClass = () => {
			if (window.innerWidth >= 576) {
				if (language === "fa") {
					setOffcanvasClass("offcanvas-start");
				} else {
					setOffcanvasClass("offcanvas-end");
				}
			} else {
				setOffcanvasClass("offcanvas-top h-50");
			}
		};

		// Initial check
		updateOffcanvasClass();

		// Add event listener for window resize
		window.addEventListener("resize", updateOffcanvasClass);

		// Cleanup the event listener on component unmount
		return () => window.removeEventListener("resize", updateOffcanvasClass);
	}, [language]);

	const username =
		userData && userData.name && userData.lastName
			? `${userData.name} ${userData.lastName}`
			: userData?.email || ""; // Fallback to email if name and lastName are missing

	const handleLogout = () => {
		setAuthData(null); // Clear token and reset login state
		window.location.assign("/"); // Optionally, redirect to the homepage or login page
	};

	return (
		<div
			className={`offcanvas ${offcanvasClass}`}
			tabIndex={-1}
			id="myOffcanvas"
			aria-labelledby="myOffcanvasLabel"
		>
			<div
				className="offcanvas-header d-flex justify-content-between align-items-center custom-bg-sidebar-1 shadow-lg"
				style={{ direction: language === "fa" ? "ltr" : "rtl" }}
			>
				<button
					className="rounded-circle btn p-0"
					type="button"
					data-bs-dismiss="offcanvas"
					aria-label="Close"
				>
					<img
						src="\images\x-noBorder.png"
						className="rounded-circle custom-x-btn"
					/>
				</button>
				<h4
					className="offcanvas-title text-white"
					id="myOffcanvasLabel"
				>
					{language === "fa" ? "داشبورد کاربر" : "Dashboard"}
				</h4>
			</div>
			<div className="offcanvas-body shadow p-0">
				<div
					className="d-flex flex-row justify-content-between align-items-center custom-bg-2"
					style={{ direction: language === "fa" ? "ltr" : "rtl" }}
				>
					<div>
						{profilePicture ? (
							<img
								src={profilePicture}
								alt="Profile"
								className="custom-user-icon-pic rounded-circle border border-2 border-light m-3"
							/>
						) : (
							<FaUser
								className="custom-user-icon-pic rounded-circle border border-2 border-light my-3 mx-4 p-1"
								color="white"
							/>
						)}
					</div>
					<div className="d-flex flex-column justify-content-center align-items-end mb-2 py-1 px-4">
						<div
							className="mb-2 py-1 px-2 auto-scroll-containe"
							style={{
								maxWidth: "118px",
								overflowX: "hidden",
							}}
						>
							<span className="text-white auto-scroll-tex ">
								{username}
							</span>
						</div>
						<div
							className="d-flex flex-row justify-content-between align-items-center mb-2 py-1 "
							style={{
								direction: language === "fa" ? "rtl" : "ltr",
							}}
						>
							<span className="text-white d-inline px-2">
								{language === "fa"
									? "کیف پول"
									: "Wallet Balance"}
							</span>
							<span className="text-white px-2">
								{String(userBalance).concat("T")}
							</span>
						</div>
						<button
							type="button"
							onClick={toggleModal}
							className="btn btn-light rounded-pill"
						>
							{language === "fa"
								? "افزایش موجودی"
								: "Increase Balance"}
						</button>
					</div>
				</div>
				<ul
					className={` dropdown-menu d-flex flex-column text-${
						language === "fa" ? "end" : "start"
					} custom-bg-sidebar-3 border-0 rounded-0 w-100 h-100 `}
					style={{ direction: language === "fa" ? "ltr" : "rtl" }}
				>
					<li>
						<Link
							to="/"
							className="d-flex align-items-center justify-content-end dropdown-item rounded-3 px-2"
						>
							<span className="px-2">
								{language === "fa" ? "صفحه اصلی" : "Main Page"}
							</span>
							<FaHouse />
						</Link>
					</li>

					<li>
						<hr className="dropdown-divider" />
					</li>
					<li>
						<Link
							to="/UserInformation"
							className="d-flex align-items-center justify-content-end dropdown-item rounded-3 px-2"
						>
							<span className="px-2">
								{language === "fa"
									? "ویرایش اطلاعات کاربر"
									: "Edit User information"}
							</span>
							<FaInfo />
						</Link>
					</li>
					<li>
						<hr className="dropdown-divider" />
					</li>
					<li>
						<Link
							to="/UserIEInformation"
							className="d-flex align-items-center justify-content-end dropdown-item rounded-3 px-2"
						>
							<span className="px-2">
								{language === "fa"
									? "فرم ارزیابی اولیه کاربر"
									: "Initial Evaluation Form"}
							</span>
							<FaBookMedical />
						</Link>
					</li>
					<li>
						<hr className="dropdown-divider" />
					</li>
					<li>
						<button
							className="btn  d-flex align-items-center justify-content-end collapsed dropdown-item d-inline rounded-3 px-2 "
							type="button"
							data-bs-toggle="collapse"
							data-bs-target={`#servicesCollapse`}
							aria-expanded={false}
							aria-controls="servicesCollapse"
						>
							<span className="px-2">
								{language === "fa" ? "خدمات" : "Services"}
							</span>
							<FaBriefcaseMedical />
						</button>
					</li>
					<ul
						className="accordion-collapse collapse mb-0"
						id="servicesCollapse"
					>
						<li className="d-flex align-items-center ">
							<Link
								to="/GeneralDoctorPrescription"
								className="dropdown-item rounded-3"
							>
								<span className="px-2">
									{language === "fa"
										? "خدمات پزشک عمومی"
										: "General Practitioner Services"}
								</span>
								<FaUserNurse />
							</Link>
						</li>
						<li className="d-flex align-items-center">
							<Link
								to="/SpecialistDoctorPrescription"
								className="dropdown-item rounded-3"
							>
								<span className="px-2">
									{language === "fa"
										? "پزشک متخصص و فوق تخصص"
										: "Specialist Practitioner Services"}
								</span>
								<FaUserDoctor />
							</Link>
						</li>
					</ul>
					<li>
						<hr className="dropdown-divider" />
					</li>
					<li>
						<Link
							to="/UserHistory"
							className="d-flex align-items-center justify-content-end dropdown-item rounded-3 px-2"
						>
							<span className="px-2">
								{language === "fa"
									? "تاریخچه خدمات"
									: "Service History"}
							</span>
							<FaClockRotateLeft />
						</Link>
					</li>

					{isLoggedInAdmin && (
						<>
							<li>
								<hr className="dropdown-divider" />
							</li>

							<li>
								<Link
									to="AdminDashboard"
									className="d-flex align-items-center justify-content-end dropdown-item rounded-3 px-2"
								>
									<span className="px-2">
										{language === "fa"
											? "داشبورد مدیر"
											: "Admin Dashboard"}
									</span>
									<FaUserTie />
								</Link>
							</li>
						</>
					)}

					<li>
						<hr className="dropdown-divider" />
					</li>

					<li>
						<button
							onClick={handleLogout}
							className="d-flex align-items-center justify-content-end dropdown-item rounded-3 px-2"
						>
							<span className="px-2">
								{language === "fa"
									? "خروج از سامانه"
									: "Log out"}
							</span>
							<LuLogOut />
						</button>
					</li>
				</ul>
			</div>
			<NewTransactionModal show={showModal} onClose={toggleModal} />
		</div>
	);
}

export default UserOffCanvas;
