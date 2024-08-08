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
	const [isLoggedIn, setIsLoggedIn] = useState(true);

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
			<section id="banner" className="position-relative shadow">
				<img
					src="src\images\Banner.png"
					alt="Hero"
					className="img-fluid w-100 h-100"
				/>
				<div className="custom-banner-text d-flex flex-column align-items-center text-center text-white position-absolute mx-sm-auto">
					<h1>{homeText?.openingQuoteTitle}</h1>
					<p>{homeText?.openingQuoteDescription}</p>
					{!isLoggedIn && (
						<Link to="/SignIn" className="btn btn-light rounded-pill w-50">
							ثبت نام
						</Link>
					)}
				</div>
			</section>
			<section id="services" className="pb-4 pt-3 mt-4 mb-5 bg-white">
				<div className="container">
					<h2 className="text-center mb-4 pb-2">خدمات</h2>
					<div className="row justify-content-center gap-5">
						<div className="col">
							<div className="card rounded-5 shadow mb-4">
								<div className="card-body text-center">
									<h5 className="card-title custom-bg-3 rounded-top-4 mb-2 p-2">
										{homeText?.servicesLeftCardTitle}
									</h5>
									<img
										src={homeText?.servicesLeftCardImage}
										className="img-fluid rounded-4 shadow-sm m-0"
										alt="general Doctor"
									/>
									<p className="card-text text-end my-3 mx-3">
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
						<div className="col">
							<div className="card rounded-5 shadow mb-4">
								<div className="card-body text-center">
									<h5 className="card-title custom-bg-3 rounded-top-4 mb-2 p-2">
										{homeText?.servicesRightCardTitle}
									</h5>
									<img
										src={homeText?.servicesRightCardImage}
										className="img-fluid rounded-4 shadow-sm m-0"
										alt="general Doctor"
									/>
									<p className="card-text text-end my-3 mx-3">
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
			<section id="doc" className=" d-flex justify-content-between shadow">
				<img
					src={homeText?.docImage}
					alt="Mr Doc"
					className="img-fluid"
					style={{ height: "235px" }}
				/>
				<div className="text-end text-white p-5 ">
					<h4>{homeText?.docTitle}</h4>
					<p>{homeText?.docDescription}</p>
				</div>
			</section>
			<MyQuestions />
			<MyFooter />
		</div>
	);
}

export default Home;
