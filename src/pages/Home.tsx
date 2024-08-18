import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MyFooter from "../components/MyFooter";
import MyQuestions from "../components/MyQuestions";
import "../cssFiles/home.css";
import "../cssFiles/customColors.css";

interface homeTextData {
	openingQuoteTitle: string;
	openingQuoteDescription: string;

	servicesLeftCardTitle: string;
	servicesLeftCardDescription: string;
	servicesLeftCardImage: string;

	servicesRightCardTitle: string;
	servicesRightCardDescription: string;
	servicesRightCardImage: string;

	docTitle: string;
	docImage: string;
	docDescription: string;
}

function Home() {
	const [homeText, setHomeTextData] = useState<homeTextData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const fetchHomeTextData = async () => {
			try {
				const response = await axios.get<homeTextData[]>(
					"http://localhost:3001/homeTextData"
				);
				setHomeTextData(response.data[0]);
				setLoading(false);
			} catch (err) {
				setError("Failed to fetch homeTextData");
				setLoading(false);
			}
		};

		fetchHomeTextData();
	}, []);

	if (loading) {
		return <div className="text-center my-5">Loading...</div>;
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	// @ts-ignore
	const checkLoggedIn = () => {
		setIsLoggedIn(true);
	};

	return (
		<div>
			{/* Banner Section */}
			<section
				id="banner"
				className="d-flex justify-content-center justify-content-lg-end shadow p-5"
			>
				<div className="d-flex flex-column align-items-center text-center text-white m-auto py-4 mx-md-4 px-md-4 mx-xl-5 px-xl-5 ">
					<div className="custom-banner-text-bg rounded-5 p-3 m-auto mx-md-2 mx-lg-4">
						<h3>{homeText?.openingQuoteTitle}</h3>
						<p className="p-1">{homeText?.openingQuoteDescription}</p>
						{!isLoggedIn && (
							<Link
								to="/SignIn"
								className="btn btn-sm btn-light rounded-pill w-50"
							>
								ثبت نام
							</Link>
						)}
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section id="services" className="bg-white pb-4 pt-3 mt-4 mb-5 px-">
				<div className="container px-5 px-md-5 px-lg-4">
					<h2 className="text-center mb-4 pb-2">خدمات</h2>
					<div className="row justify-content-center gap-5">
						<div className="col-lg-5 col-12">
							<div className="card rounded-5 shadow p-3 mb-4">
								<div className="card-body text-center p-md-3 p-2">
									<h5 className="card-title custom-bg-3 rounded-top-4 mb-2 p-2">
										{homeText?.servicesLeftCardTitle}
									</h5>
									<img
										src={homeText?.servicesLeftCardImage}
										className="img-fluid custom-service-img rounded-4 shadow-sm"
										alt="general Doctor"
									/>
									<p className="card-text text-end m-3">
										{homeText?.servicesLeftCardDescription}
									</p>
									<a
										href="/SpecialistDoctorPrescription"
										className="btn btn-primary rounded-pill my-2"
									>
										شروع استفاده
									</a>
								</div>
							</div>
						</div>
						<div className="col-lg-5 col-12">
							<div className="card rounded-5 shadow p-3 mb-4">
								<div className="card-body text-center p-md-3 p-2">
									<h5 className="card-title custom-bg-3 rounded-top-4 mb-2 p-2">
										{homeText?.servicesRightCardTitle}
									</h5>
									<img
										src={homeText?.servicesRightCardImage}
										className="img-fluid custom-service-img rounded-4 shadow-sm"
										alt="general Doctor"
									/>
									<p className="card-text text-end m-3">
										{homeText?.servicesRightCardDescription}
									</p>
									<a
										href="/GeneralDoctorPrescription"
										className="btn btn-primary rounded-pill my-2"
									>
										شروع استفاده
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* Doc Section */}
			<section
				id="doc"
				className=" d-flex flex-row justify-content-between shadow"
			>
				<img
					src={homeText?.docImage}
					alt="Mr Doc"
					className="img-fluid col-md-5 col-lg-4 col-xl-3  d-sm-block d-none"
				/>
				<div className="col-10 col-md-7 col-lg-8 text-end text-white p-1 p-md-3 p-lg-4 m-auto">
					<h4>{homeText?.docTitle}</h4>
					<p>{homeText?.docDescription}</p>
				</div>
			</section>
			{/* Important Questions Section */}
			<MyQuestions />
			{/* Footer Section */}
			<MyFooter />
		</div>
	);
}

export default Home;
