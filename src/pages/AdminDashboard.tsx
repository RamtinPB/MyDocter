import { useState } from "react";
import AdminDashboardMainPageContent from "../components/AdminDashboardMainPageContent";
import AdminDashboardInsurancePageContent from "../components/AdminDashboardInsurancePageContent";
import AdminDashboardQuestionsPageContent from "../components/AdminDashboardQuestionsPageContent";
import AdminDashboardServicesPageContent from "../components/AdminDashboardServicesPageContent";

function AdminDashboard() {
	const [activeSection, setActiveSection] = useState("mainPage");

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
			default:
				return <MainPageContent />;
		}
	};

	return (
		<>
			<div
				className="container text-center my-3 my-md-4 my-lg-5 pb-2 pb-md-3"
				style={{ direction: "rtl" }}
			>
				<button
					className={`btn m-1 ${
						activeSection === "mainPage" ? "btn-primary" : "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => setActiveSection("mainPage")}
				>
					ویرایش صفحه اصلی
				</button>
				<button
					className={`btn m-1 ${
						activeSection === "questionsPage"
							? "btn-primary"
							: "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => setActiveSection("questionsPage")}
				>
					ویرایش سوالات متداول
				</button>
				<button
					className={`btn m-1 ${
						activeSection === "servicesPage"
							? "btn-primary"
							: "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => setActiveSection("servicesPage")}
				>
					ویرایش سرویس ها
				</button>
				<button
					className={`btn m-1 ${
						activeSection === "insurancePage"
							? "btn-primary"
							: "btn-outline-primary"
					} rounded-pill mx-2`}
					onClick={() => setActiveSection("insurancePage")}
				>
					ویرایش بیمه ها
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

export default AdminDashboard;
