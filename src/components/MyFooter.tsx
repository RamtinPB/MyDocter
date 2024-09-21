import {
	FaInstagram,
	FaPhone,
	FaPhoneAlt,
	FaTelegram,
	FaWhatsapp,
} from "react-icons/fa";
import "/src/cssFiles/myfooter.css";
import Logo from "/images/Logo.png";
import LogoEN from "/images/LogoEN.png";
import { FaXTwitter } from "react-icons/fa6";
import { useLanguage } from "./LanguageContext";

function MyFooter() {
	const { language, toggleLanguage } = useLanguage(); // Get language and toggle function from context

	return (
		<footer className="custom-footer text-white shadow-lg py-3">
			<div className="container">
				{/* top section */}
				<div
					className={`d-flex justify-content-start px-3 pt-1 pb-4 gap-2 px-lg-3 pt-lg-2 pb-lg-5 gap-lg-4`}
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<div className="d-flex flex-column justify-content-center align-items-center gap-3">
						<img
							src={language === "fa" ? Logo : LogoEN}
							className="custom-footer-logo"
							alt="Logo"
						/>
						<a
							href="#!"
							className="d-flex align-items-center link-light link-offset-2 link-opacity-50-hover link-underline-opacity-0 link-underline-opacity-100-hover"
						>
							<span className="px-2">
								{language === "fa" ? "پشتیبانی 24/7" : "24/7 Support"}
							</span>

							{language === "fa" ? (
								<FaPhoneAlt className="img-fluid" color="white" />
							) : (
								<FaPhone className="img-fluid" color="white" />
							)}
						</a>
						<a
							href="#!"
							className="link-light link-offset-2 link-opacity-50-hover link-underline-opacity-0 link-underline-opacity-100-hover"
						>
							mydocter.support@gmail
						</a>
					</div>
					<div className="d-flex flex-column justify-content-center align-items-center px-3 mx-3 gap-3">
						<h5 className="border-bottom border-2 my-1">
							{language === "fa" ? "پشتیبانی" : "Support"}
						</h5>
						<a
							href="#!"
							className="link-light link-offset-2 link-opacity-50-hover link-underline-opacity-0 link-underline-opacity-100-hover"
						>
							{language === "fa" ? "راهنمایی" : "Guidance"}
						</a>
					</div>
				</div>
				{/* bottom section */}
				<div className="d-flex flex-column">
					<hr className=" border border-white rounded-circle my-2" />
					<div className="d-flex flex-row justify-content-between align-items-center">
						<div className="d-flex justify-content-center gap-4 gap-md-5">
							<a
								href="#!"
								className="icon-link link-light link-opacity-50-hover"
							>
								<FaInstagram className="custom-socials-icon" />
							</a>
							<a
								href="#!"
								className="icon-link link-light link-opacity-50-hover"
							>
								<FaTelegram className="custom-socials-icon" />
							</a>
							<a
								href="#!"
								className="icon-link link-light link-opacity-50-hover"
							>
								<FaWhatsapp className="custom-socials-icon" />
							</a>
							<a
								href="#!"
								className="icon-link link-light link-opacity-50-hover"
							>
								<FaXTwitter className="custom-socials-icon" />
							</a>
						</div>
						<div className="dropdown">
							<button
								className="btn btn-secondary dropdown-toggle"
								type="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								{language === "fa" ? "زبان" : "language"}
							</button>
							<ul className="dropdown-menu">
								<li>
									<button
										className="dropdown-item"
										onClick={() => toggleLanguage("fa")}
									>
										{language === "fa" ? "فارسی" : "Farsi"}
									</button>
								</li>
								<li>
									<button
										className="dropdown-item"
										onClick={() => toggleLanguage("en")}
									>
										{language === "fa" ? "انگلیسی" : "English"}
									</button>
								</li>
							</ul>
						</div>
					</div>
					<hr className="border border-white rounded-circle my-2" />
					<span className=" text-center mb-1">
						© 2024 MYDOCTOR. All rights reserved.
					</span>
				</div>
			</div>
		</footer>
	);
}

export default MyFooter;
