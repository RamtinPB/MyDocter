import { SetStateAction, useEffect, useState } from "react";
import ManageUserInterfaceUserPersonalInformation from "./ManageUserInterfaceUserPersonalInformation";
import ManageUserInterfaceUserInitialEvaluationInformation from "./ManageUserInterfaceUserInitialEvaluationInformation";
import ManageUserInterfaceUserPurchasedServices from "./ManageUserInterfaceUserPurchasedServices";

import { useLanguage } from "./LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";

function ManageUserInterface() {
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
		navigate("/ManageUserInterface", { state: { activeSection: section } }); // Set the state for activeSection
	};

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

	return (
		<>
			<div
				className="container text-center my-3 my-md-4 my-lg-5 pb-2 pb-md-3"
				style={{ direction: language === "fa" ? "rtl" : "ltr" }}
			>
				<button
					className={`btn m-1 ${
						activeSection === "userPersonalInfo"
							? "btn-primary"
							: "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => handleNavigation("userPersonalInfo")}
				>
					{language === "fa"
						? `{} ویرایش اطلاعات شخصی کاربر `
						: `Edit Personal Information of User {}`}
				</button>
				<button
					className={`btn m-1 ${
						activeSection === "userIEInfo"
							? "btn-primary"
							: "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => handleNavigation("userIEInfo")}
				>
					{language === "fa"
						? `{} ویرایش اطلاعات ارزیابی اولیه کاربر `
						: `Edit Initial Evaluation Information of User {}`}
				</button>
				<button
					className={`btn m-1 ${
						activeSection === "userPurchased"
							? "btn-primary"
							: "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => handleNavigation("userPurchased")}
				>
					{language === "fa"
						? `{} تاریخچه خدمات خریداری شده کاربر `
						: `Purchase History of User {}`}
				</button>
			</div>

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
