import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyFooter from "../components/MyFooter";
import FAQ from "../components/FAQ";
import "/src/cssFiles/home.css";
import "/src/cssFiles/customColors.css";
import { useLanguage } from "../components/LanguageContext";
import axiosInstance from "../myAPI/axiosInstance";
import { useAuth } from "../components/AuthContext";

interface homeTextData {
	openingQuoteTitle: string;
	openingQuoteDescription: string;
	////////////////////////////////
	openingQuoteTitleEN: string;
	openingQuoteDescriptionEN: string;

	servicesLeftCardTitle: string;
	servicesLeftCardDescription: string;
	servicesLeftCardImage: string;
	////////////////////////////////////
	servicesLeftCardTitleEN: string;
	servicesLeftCardDescriptionEN: string;

	servicesRightCardTitle: string;
	servicesRightCardDescription: string;
	servicesRightCardImage: string;
	/////////////////////////////////////
	servicesRightCardTitleEN: string;
	servicesRightCardDescriptionEN: string;

	docTitle: string;
	docImage: string;
	docDescription: string;
	///////////////////////
	docTitleEN: string;
	docImageEN: string;
	docDescriptionEN: string;
}

function Home() {
	const { loginState } = useAuth();
	const [homeText, setHomeTextData] = useState<homeTextData | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		const fetchHomeTextData = async () => {
			try {
				// Attempt to fetch from the API
				const response = await axiosInstance.post(
					"/api/Pages/GetHomePageData"
				);
				if (response.status !== 200) {
					throw new Error("Failed to fetch data from API");
				}

				setHomeTextData(response.data); // Assuming 'data' is the correct structure
				setLoading(false);
			} catch (err) {
				console.error("API request failed, trying local db.json", err);

				// Fallback to fetching from db.json if API request fails
				try {
					const response = await fetch("/HomePageData.json"); // Adjust the path to your static JSON file
					if (!response.ok) {
						throw new Error("Failed to fetch data from db.json");
					}

					const data = await response.json();
					setHomeTextData(data); // Assuming 'homeTextData' is the key in your JSON structure
					setLoading(false);
				} catch (jsonErr) {
					console.error(
						"Failed to fetch data from both API and db.json",
						jsonErr
					);
					setError(
						"Failed to fetch data from both API and local fallback."
					);
					setLoading(false);
				}
			}
		};

		fetchHomeTextData();
	}, []);

	if (loading) {
		return (
			<div
				className="spinner-border text-primary text-center my-5"
				role="status"
			>
				<span className="visually-hidden">Loading...</span>
			</div>
		);
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	return (
		<div>
			{/* Banner Section */}
			<section
				id="banner"
				className="d-flex justify-content-center justify-content-lg-end shadow p-5"
			>
				<div className="d-flex flex-column align-items-center text-center text-white m-auto py-4 mx-md-4 px-md-4 mx-xl-5 px-xl-5 ">
					<div className="custom-banner-text-bg rounded-5 p-3 m-auto mx-md-2 mx-lg-4">
						<h3>
							{language === "fa"
								? homeText?.openingQuoteTitle
								: homeText?.openingQuoteTitleEN}
						</h3>
						<p className="p-1">
							{language === "fa"
								? homeText?.openingQuoteDescription
								: homeText?.openingQuoteDescriptionEN}
						</p>
						{!loginState && (
							<Link
								to="/SignUp"
								className="btn btn-sm btn-light rounded-pill w-50"
							>
								{language === "fa" ? "ثبت نام" : "Sign Up"}
							</Link>
						)}
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section id="services" className="bg-white pb-4 pt-3 mt-4 mb-5 px-">
				<div className="container px-5 px-md-5 px-lg-4">
					<h2 className="text-center mb-4 pb-2">
						{language === "fa" ? "خدمات" : "Services"}
					</h2>
					<div className="row justify-content-center gap-5">
						<div className="col-lg-5 col-12">
							<div className="card rounded-5 shadow p-3 mb-4">
								<div className="card-body text-center p-md-3 p-2">
									<h5 className="card-title custom-bg-3 rounded-top-4 mb-2 p-2">
										{language === "fa"
											? homeText?.servicesLeftCardTitle
											: homeText?.servicesLeftCardTitleEN}
									</h5>
									<img
										src={homeText?.servicesLeftCardImage}
										className="img-fluid custom-home-service-img rounded-4 shadow-sm"
										alt="general Doctor"
									/>
									<p
										className={` card-text text-${
											language === "fa" ? "end" : "start"
										} m-3 `}
									>
										{language === "fa"
											? homeText?.servicesLeftCardDescription
											: homeText?.servicesLeftCardDescriptionEN}
									</p>
									<a
										href="/SpecialistDoctorPrescription"
										className="btn btn-primary rounded-pill my-2"
									>
										{language === "fa"
											? "شروع استفاده"
											: "Enter"}
									</a>
								</div>
							</div>
						</div>
						<div className="col-lg-5 col-12">
							<div className="card rounded-5 shadow p-3 mb-4">
								<div className="card-body text-center p-md-3 p-2">
									<h5 className="card-title custom-bg-3 rounded-top-4 mb-2 p-2">
										{language === "fa"
											? homeText?.servicesRightCardTitle
											: homeText?.servicesRightCardTitleEN}
									</h5>
									<img
										src={homeText?.servicesRightCardImage}
										className="img-fluid custom-home-service-img rounded-4 shadow-sm"
										alt="general Doctor"
									/>
									<p
										className={` card-text text-${
											language === "fa" ? "end" : "start"
										} m-3 `}
									>
										{language === "fa"
											? homeText?.servicesRightCardDescription
											: homeText?.servicesRightCardDescriptionEN}
									</p>
									<a
										href="/GeneralDoctorPrescription"
										className="btn btn-primary rounded-pill my-2"
									>
										{language === "fa"
											? "شروع استفاده"
											: "Enter"}
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
				style={{ direction: language === "fa" ? "ltr" : "rtl" }}
			>
				<img
					src={
						language === "fa"
							? homeText?.docImage
							: homeText?.docImageEN
					}
					alt="Mr Doc"
					className="img-fluid col-md-5 col-lg-4 col-xl-3 d-sm-block d-none"
				/>
				<div
					className={` col-10 col-md-7 col-lg-8 text-${
						language === "fa" ? "end" : "start"
					} text-white p-1 p-md-3 p-lg-4 m-auto `}
				>
					<h4>
						{language === "fa"
							? homeText?.docTitle
							: homeText?.docTitleEN}
					</h4>
					<p>
						{language === "fa"
							? homeText?.docDescription
							: homeText?.docDescriptionEN}
					</p>
				</div>
			</section>
			{/* Important Questions Section */}
			<FAQ />
			{/* Footer Section */}
			<MyFooter />
		</div>
	);
}

export default Home;
