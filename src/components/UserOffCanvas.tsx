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

interface UserOffCanvasProps {
	userData: UserData | null;
	isLoggedInAdmin: boolean;
}

const UserOffCanvas: React.FC<UserOffCanvasProps> = ({
	userData,
	isLoggedInAdmin,
}) => {
	const [offcanvasClass, setOffcanvasClass] = useState("offcanvas-top");

	useEffect(() => {
		// Function to check the screen size and update the offcanvas class
		const updateOffcanvasClass = () => {
			if (window.innerWidth >= 576) {
				setOffcanvasClass("offcanvas-start");
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
	}, []);

	const username =
		userData && userData.firstName && userData.lastName
			? `${userData.firstName} ${userData.lastName}`
			: userData?.phoneNumber || ""; // Fallback to phone number if firstName and lastName are missing

	return (
		<div
			className={`offcanvas ${offcanvasClass}`}
			tabIndex={-1}
			id="myOffcanvas"
			aria-labelledby="myOffcanvasLabel"
		>
			<div className="offcanvas-header d-flex justify-content-between align-items-center custom-bg-sidebar-1 shadow-lg">
				<button
					className="rounded-circle btn p-0"
					type="button"
					data-bs-dismiss="offcanvas"
					aria-label="Close"
				>
					<img
						src="\src\images\x-noBorder.png"
						className="rounded-circle custom-x-btn"
					/>
				</button>
				<h4 className="offcanvas-title text-white" id="myOffcanvasLabel">
					داشبورد کاربر
				</h4>
			</div>
			<div className="offcanvas-body shadow p-0">
				<div className="d-flex flex-column justify-content-center align-items-center custom-bg-2">
					{userData?.profilePicture ? (
						<img
							src={userData.profilePicture}
							alt="Profile"
							className="custom-user-icon-pic img-fluid rounded-circle border border-2 border-light my-3 mx-4"
						/>
					) : (
						<FaUser
							className="custom-user-icon-pic rounded-circle border border-2 border-light mt-3 mb-1 mx-4 p-1"
							color="white"
						/>
					)}
					<span className="text-white text-center rounded-pill mb-2 py-1 px-3">
						{username}
					</span>
				</div>
				<ul className="dropdown-menu d-flex flex-column text-end custom-bg-sidebar-3 border-0 rounded-0 w-100 h-100">
					<li>
						<Link
							to="/"
							className="d-flex align-items-center justify-content-end dropdown-item rounded-3 pe-2"
						>
							<span className="pe-2"> صفحه اصلی</span>
							<FaHouse />
						</Link>
					</li>

					<li>
						<hr className="dropdown-divider" />
					</li>
					<li>
						<Link
							to="/UserInformation"
							className="d-flex align-items-center justify-content-end dropdown-item rounded-3 pe-2"
						>
							<span className="pe-2"> ویرایش اطلاعات کاربر</span>
							<FaInfo />
						</Link>
					</li>
					<li>
						<hr className="dropdown-divider" />
					</li>
					<li>
						<Link
							to="/UserIEInformation"
							className="d-flex align-items-center justify-content-end dropdown-item rounded-3 pe-2"
						>
							<span className="pe-2"> فرم ارزیابی اولیه کاربر</span>
							<FaBookMedical />
						</Link>
					</li>
					<li>
						<hr className="dropdown-divider" />
					</li>
					<li>
						<button
							className="btn  d-flex align-items-center justify-content-end collapsed dropdown-item d-inline rounded-3 pe-2 "
							type="button"
							data-bs-toggle="collapse"
							data-bs-target={`#servicesCollapse`}
							aria-expanded={false}
							aria-controls="servicesCollapse"
						>
							<span className="pe-2">خدمات</span>
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
					<li>
						<hr className="dropdown-divider" />
					</li>
					<li>
						<Link
							to="/UserHistory"
							className="d-flex align-items-center justify-content-end dropdown-item rounded-3 pe-2"
						>
							<span className="pe-2"> تاریخچه خدمات</span>
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
									className="d-flex align-items-center justify-content-end dropdown-item rounded-3 pe-2"
								>
									<span className="pe-2">داشبورد مدیر</span>
									<FaUserTie />
								</Link>
							</li>
						</>
					)}
				</ul>
			</div>
		</div>
	);
};

export default UserOffCanvas;
