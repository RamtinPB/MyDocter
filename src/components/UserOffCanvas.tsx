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

import { useState } from "react";

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

interface UserOffCanvasProps {
	userProfile: UserProfile | null;
	isLoggedInAdmin: boolean;
}

const UserOffCanvas: React.FC<UserOffCanvasProps> = ({
	userProfile,
	isLoggedInAdmin,
}) => {
	const [isServicesOpen, setIsServicesOpen] = useState(false);

	const toggleServices = () => {
		setIsServicesOpen(!isServicesOpen);
	};

	const username = userProfile
		? `${userProfile.firstName} ${userProfile.lastName}`
		: "";

	return (
		<div
			className="offcanvas offcanvas-start"
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
						className="rounded-circle"
						style={{ width: "40px", height: "40px" }}
					/>
				</button>
				<h4 className="offcanvas-title text-white" id="myOffcanvasLabel">
					داشبورد کاربر
				</h4>
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
							className="btn btn-link d-flex align-items-center justify-content-end collapsed dropdown-item rounded-3 mb-1 pb-0 pe-2 me-0"
							type="button"
							onClick={toggleServices}
							data-bs-toggle="collapse"
							data-bs-target={`#servicesCollapse`}
							aria-expanded={isServicesOpen}
							aria-controls="servicesCollapse"
						>
							<span className="pe-2">خدمات</span>
							<FaBriefcaseMedical />
						</button>
					</li>
					<li className="accordion-collapse collapse" id="servicesCollapse">
						<ul className="mb-0">
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
					</li>
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
