import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import FormBuilder from "./components/FormBuilder";
import FormRender from "./components/FormRender";
import MainLayout from "./components/MainLayout";
import SignIn from "./pages/SignIn";
import UserInformation from "./pages/UserInformation";
import GeneralDoctorPrescription from "./pages/GeneralDoctorPrescription";
import SpecialistDoctorPrescription from "./pages/SpecialistDoctorPrescription";
import InitialEvaluation from "./pages/InitialEvaluation";
import UserHistory from "./pages/UserHistory";
import UserHistoryExtended from "./pages/UserHistoryExtended";
import PasswordRecovery from "./pages/PasswordRecovery";
import ServicePage from "./pages/ServicePage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Routes with the header */}
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path="/UserInformation" element={<UserInformation />} />
					<Route path="/UserHistory" element={<UserHistory />} />
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
					<Route path="/InitialEvaluation" element={<InitialEvaluation />} />
					<Route path="/formBuilder" element={<FormBuilder />} />
					<Route path="/formRender" element={<FormRender />} />
				</Route>

				{/* Route without the header */}
				<Route path="/login" element={<Login />} />
				<Route path="/signin" element={<SignIn />} />
				<Route path="/PasswordRecovery" element={<PasswordRecovery />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
