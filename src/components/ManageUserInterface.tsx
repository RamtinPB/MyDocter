import { SetStateAction, useEffect, useState } from "react";
import ManageUserInterfaceUserPersonalInformation from "./ManageUserInterfaceUserPersonalInformation";
import ManageUserInterfaceUserInitialEvaluationInformation from "./ManageUserInterfaceUserInitialEvaluationInformation";
import ManageUserInterfaceUserPurchasedServices from "./ManageUserInterfaceUserPurchasedServices";
import { useLanguage } from "./LanguageContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaCaretLeft } from "react-icons/fa";

function ManageUserInterface() {
	// Retrieve userId from the URL
	const { userId } = useParams<{ userId: string }>(); // Get userId from route
	const [activeSection, setActiveSection] = useState("mainPage");
	const location = useLocation();
	const navigate = useNavigate();
	const { language } = useLanguage(); // Get language and toggle function from context

	// Check if there is a state passed with the section to open
	useEffect(() => {
		if (location.state?.activeSection) {
			setActiveSection(location.state.activeSection);
		}
		console.log(location.state?.activeSection);
	}, [location]);

	// Function to handle setting activeSection and updating location.state
	const handleNavigation = (section: SetStateAction<string>) => {
		setActiveSection(section);
		navigate(`/edit-user/${userId}`, { state: { activeSection: section } }); // Update state with the active section
	};

	// Conditionally render content based on the activeSection
	const renderContent = () => {
		switch (activeSection) {
			case "userPersonalInfo":
				return <UserPersonalInformation />;
			case "userIEInfo":
				return <UserInitialEvaluationInformation />;
			case "userPurchased":
				return <UserPurchasedServices />;
			default:
				return <UserPersonalInformation />;
		}
	};

	// Function to handle the back button
	const handleBackClick = () => {
		// Check the section passed in the location state
		const section = location.state?.activeSection || "manageUsers"; // Default to "mainPage"
		navigate("/AdminDashboard", {
			state: { activeSection: section }, // Pass the section back to AdminDashboard
		});
	};

	return (
		<>
			<div
				className="container text-center my-3 my-md-4 my-lg-5 pb-2 pb-md-3"
				style={{ direction: language === "fa" ? "rtl" : "ltr" }}
			>
				<FaCaretLeft
					type="button"
					className="custom-back-btn btn btn-primary rounded-circle mx-2"
					style={{ padding: "3px", paddingRight: "5px" }}
					color="white"
					onClick={handleBackClick}
				/>

				{/* Button for Personal Info */}
				<button
					className={`btn m-1 ${
						activeSection === "userPersonalInfo"
							? "btn-primary"
							: "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => handleNavigation("userPersonalInfo")}
				>
					{language === "fa"
						? `ویرایش اطلاعات شخصی`
						: `Edit Personal Information`}
				</button>

				{/* Button for Initial Evaluation */}
				<button
					className={`btn m-1 ${
						activeSection === "userIEInfo"
							? "btn-primary"
							: "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => handleNavigation("userIEInfo")}
				>
					{language === "fa"
						? `ویرایش اطلاعات ارزیابی اولیه`
						: `Edit Initial Evaluation Information`}
				</button>

				{/* Button for Purchase History */}
				<button
					className={`btn m-1 ${
						activeSection === "userPurchased"
							? "btn-primary"
							: "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => handleNavigation("userPurchased")}
				>
					{language === "fa" ? `تاریخچه خدمات خریداری شده` : `Purchase History`}
				</button>
			</div>

			{/* Render the appropriate content based on active section */}
			<div className="container">{renderContent()}</div>
		</>
	);
}

// Example content components for each section
const UserPersonalInformation = () => (
	<ManageUserInterfaceUserPersonalInformation />
);
const UserInitialEvaluationInformation = () => (
	<ManageUserInterfaceUserInitialEvaluationInformation />
);
const UserPurchasedServices = () => (
	<ManageUserInterfaceUserPurchasedServices />
);

export default ManageUserInterface;
