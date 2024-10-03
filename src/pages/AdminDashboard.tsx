import { SetStateAction, useEffect, useState } from "react";
import AdminDashboardMainPageContent from "../components/AdminDashboardMainPageContent";
import AdminDashboardInsurancePageContent from "../components/AdminDashboardInsurancePageContent";
import AdminDashboardQuestionsPageContent from "../components/AdminDashboardFAQPageContent";
import AdminDashboardServicesPageContent from "../components/AdminDashboardServicesPageContent";
import AdminDashboardFormPageContent from "../components/AdminDashboardFormPageContent";
import { useLanguage } from "../components/LanguageContext";
import AdminDashboardManageUsers from "../components/AdminDashboardManageUsers";
import { useLocation, useNavigate } from "react-router-dom";

function AdminDashboard() {
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
		navigate("/AdminDashboard", { state: { activeSection: section } }); // Set the state for activeSection
	};

	const renderContent = () => {
		switch (activeSection) {
			case "mainPage":
				return <MainPageContent />;
			case "insurancePage":
				return <InsurancePageContent />;
			case "questionsPage":
				return <QuestionsPageContent />;
			case "servicesPage":
				return <ServicesPageContent />;
			case "formPage":
				return <FormPageContent />;
			case "manageUsers":
				return <ManageUsers />;
			default:
				return <MainPageContent />;
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
						activeSection === "mainPage" ? "btn-primary" : "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => handleNavigation("mainPage")}
				>
					{language === "fa" ? "ویرایش صفحه اصلی" : "Edit Main Page Content"}
				</button>
				<button
					className={`btn m-1 ${
						activeSection === "questionsPage"
							? "btn-primary"
							: "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => handleNavigation("questionsPage")}
				>
					{language === "fa" ? "ویرایش سوالات متداول" : "Edit FAQ Content"}
				</button>
				<button
					className={`btn m-1 ${
						activeSection === "servicesPage"
							? "btn-primary"
							: "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => handleNavigation("servicesPage")}
				>
					{language === "fa" ? "ویرایش سرویس ها" : "Edit Services"}
				</button>
				<button
					className={`btn m-1 ${
						activeSection === "insurancePage"
							? "btn-primary"
							: "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => handleNavigation("insurancePage")}
				>
					{language === "fa" ? "ویرایش بیمه ها" : "Edit Insurances"}
				</button>
				<button
					className={`btn m-1 ${
						activeSection === "formPage" ? "btn-primary" : "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => handleNavigation("formPage")}
				>
					{language === "fa" ? "ویرایش فرم ها" : "Edit Forms"}
				</button>
				<button
					className={`btn m-1 ${
						activeSection === "manageUsers"
							? "btn-primary"
							: "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => handleNavigation("manageUsers")}
				>
					{language === "fa" ? "مدیریت کاربران" : "Manage Users"}
				</button>
			</div>

			<div className="container">{renderContent()}</div>
		</>
	);
}

// Example content components for each section
const MainPageContent = () => <AdminDashboardMainPageContent />;
const InsurancePageContent = () => <AdminDashboardInsurancePageContent />;
const QuestionsPageContent = () => <AdminDashboardQuestionsPageContent />;
const ServicesPageContent = () => <AdminDashboardServicesPageContent />;
const FormPageContent = () => <AdminDashboardFormPageContent />;
const ManageUsers = () => <AdminDashboardManageUsers />;

export default AdminDashboard;
