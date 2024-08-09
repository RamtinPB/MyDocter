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

function App() {
	return (
		<BrowserRouter basename="/MyDocter">
			<Routes>
				{/* Routes with the header */}
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path="/UserInformation" element={<UserInformation />} />
					<Route path="/UserHistory" element={<UserHistory />} />
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
			</Routes>
		</BrowserRouter>
	);
}

export default App;
