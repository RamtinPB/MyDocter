import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import FormBuilder from "./components/FormBuilder";
import FormRender from "./components/FormRender";
import MainLayout from "./components/MainLayout";
import SignUp from "./pages/SignUp";
import UserInformation from "./pages/UserInformation";
import GeneralDoctorPrescription from "./pages/GeneralDoctorPrescription";
import SpecialistDoctorPrescription from "./pages/SpecialistDoctorPrescription";
import UserHistory from "./pages/UserHistory";
import UserHistoryExtended from "./pages/UserHistoryExtended";
import PasswordRecovery from "./pages/PasswordRecovery";
import ServicePage from "./pages/ServicePage";
import FormRenderFilled from "./components/ForRenderFilled";
import UserIEInformation from "./pages/UserIEInformation";
import AdminDashboard from "./pages/AdminDashboard";
import ServicePageEdit from "./components/AdminDashboardServicesPageEdit";
import AdminDashboardManageUsersExtended from "./components/ManageUserInterface";
import { AuthProvider } from "./components/AuthContext";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					{/* Routes with the header */}
					<Route path="/" element={<MainLayout />}>
						<Route index element={<Home />} />
						<Route path="/UserInformation" element={<UserInformation />} />
						<Route path="/UserHistory" element={<UserHistory />} />
						<Route path="/UserIEInformation" element={<UserIEInformation />} />
						<Route path="/AdminDashboard" element={<AdminDashboard />} />
						<Route path="/edit-service/:id" element={<ServicePageEdit />} />
						<Route
							path="/edit-user/:userId"
							element={<AdminDashboardManageUsersExtended />}
						/>
						<Route
							path="/purchased-services/:purchaseId"
							element={<UserHistoryExtended />}
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
						<Route path="/formBuilder/:serviceId" element={<FormBuilder />} />
						<Route path="/formRender" element={<FormRender />} />
						<Route
							path="/form-filled/:id/:purchaseId"
							element={<FormRenderFilled />}
						/>
					</Route>

					{/* Route without the header */}
					<Route path="/login" element={<Login />} />
					<Route path="/signUp" element={<SignUp />} />
					<Route path="/PasswordRecovery" element={<PasswordRecovery />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
