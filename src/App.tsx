import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import SignUp from "./pages/SignUp";
import UserInformation from "./pages/UserInformation";
import GeneralDoctorPrescription from "./pages/GeneralDoctorPrescription";
import SpecialistDoctorPrescription from "./pages/SpecialistDoctorPrescription";
import UserHistory from "./pages/UserHistory";
import UserHistoryExtended from "./pages/UserHistoryExtended";
import PasswordRecovery from "./pages/PasswordRecovery";
import ServicePage from "./pages/ServicePage";
import UserIEInformation from "./pages/UserIEInformation";
import AdminDashboard from "./pages/AdminDashboard";
import ServicePageEdit from "./components/AdminDashboardServicesPageEdit";
import AdminDashboardManageUsersInterface from "./components/ManageUserInterface";
import ManageUserInterfaceUserPurchasedServicesExtended from "./components/ManageUserInterfaceUserPurchasedServicesExtended";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Routes with the header */}
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route
						path="/UserInformation"
						element={<UserInformation />}
					/>
					<Route path="/UserHistory" element={<UserHistory />} />
					<Route
						path="/UserIEInformation"
						element={<UserIEInformation />}
					/>
					<Route
						path="/AdminDashboard"
						element={<AdminDashboard />}
					/>
					<Route
						path="/edit-service/:id"
						element={<ServicePageEdit />}
					/>
					<Route
						path="/edit-user/:userId"
						element={<AdminDashboardManageUsersInterface />}
					/>
					<Route
						path="/purchased-services/:purchaseId"
						element={<UserHistoryExtended />}
					/>
					<Route
						path="/purchased-services/:purchaseId/:userId"
						element={
							<ManageUserInterfaceUserPurchasedServicesExtended />
						}
					/>
					<Route path="/services/:id" element={<ServicePage />} />
					<Route
						path="/GeneralDoctorPrescription"
						element={<GeneralDoctorPrescription />}
					/>
					<Route
						path="/SpecialistDoctorPrescription"
						element={<SpecialistDoctorPrescription />}
					/>
				</Route>

				{/* Route without the header */}
				<Route path="/login" element={<Login />} />
				<Route path="/signUp" element={<SignUp />} />
				<Route
					path="/PasswordRecovery"
					element={<PasswordRecovery />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
