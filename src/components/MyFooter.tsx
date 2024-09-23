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
					className={`row px-3 pt-1 pb-4 gap-2 px-lg-3 pt-lg-2 pb-lg-5 gap-lg-4`}
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					{/* Logo Column */}
					<div className="col-12 col-md d-flex flex-column justify-content-center justify-content-md-start align-items-center pb-4 gap-4 order-1 order-md-0">
						<img
							src={language === "fa" ? Logo : LogoEN}
							className="img-fluid "
							alt="Logo"
						/>
						<a
							href="#!"
							className="d-flex align-items-center link-light link-offset-2 link-opacity-50-hover link-underline-opacity-0 link-underline-opacity-100-hover"
						>
							<h4 className=" px-2 mb-0">
								{language === "fa" ? "پشتیبانی 24/7" : "24/7 Support"}
							</h4>

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
							<h4>mydocter.support@gmail</h4>
						</a>
					</div>

					{/* Utility Links */}

					<div className="col col-md d-flex flex-column justify-content-start align-items-start px-3 mx-3 gap-3 order-3 order-md-1">
						<h5 className="border-bottom border-2 my-1">
							{language === "fa" ? "شرکت" : "Company"}
						</h5>
						<a
							href="#!"
							className="link-light link-offset-2 link-opacity-50-hover link-underline-opacity-0 link-underline-opacity-100-hover"
						>
							{language === "fa" ? "درباره ما" : "About Us"}
						</a>
						<a
							href="#!"
							className="link-light link-offset-2 link-opacity-50-hover link-underline-opacity-0 link-underline-opacity-100-hover"
						>
							{language === "fa" ? "فرصت‌های شغلی" : "Careers"}
						</a>
						<a
							href="#!"
							className="link-light link-offset-2 link-opacity-50-hover link-underline-opacity-0 link-underline-opacity-100-hover"
						>
							{language === "fa" ? "اخبار" : "Newsroom"}
						</a>
					</div>

					<div className="col col-md d-flex flex-column justify-content-start align-items-start px-3 mx-3 gap-3 order-4 order-md-1">
						<h5 className="border-bottom border-2 my-1">
							{language === "fa" ? "قوانین" : "Legal"}
						</h5>
						<a
							href="#!"
							className="link-light link-offset-2 link-opacity-50-hover link-underline-opacity-0 link-underline-opacity-100-hover"
						>
							{language === "fa" ? "سیاست حفظ حریم خصوصی" : "Privacy Policy"}
						</a>
						<a
							href="#!"
							className="link-light link-offset-2 link-opacity-50-hover link-underline-opacity-0 link-underline-opacity-100-hover"
						>
							{language === "fa" ? "شرایط و ضوابط" : "Terms & Conditions"}
						</a>
						<a
							href="#!"
							className="link-light link-offset-2 link-opacity-50-hover link-underline-opacity-0 link-underline-opacity-100-hover"
						>
							{language === "fa" ? "سیاست کوکی" : "Cookie Policy"}
						</a>
					</div>

					<div className="col col-md d-flex flex-column justify-content-start align-items-start px-3 mx-3 gap-3 order-5 order-md-1">
						<h5 className="border-bottom border-2 my-1">
							{language === "fa" ? "منابع" : "Resources"}
						</h5>
						<a
							href="#!"
							className="link-light link-offset-2 link-opacity-50-hover link-underline-opacity-0 link-underline-opacity-100-hover"
						>
							{language === "fa" ? "وبلاگ" : "Blog"}
						</a>
						<a
							href="#!"
							className="link-light link-offset-2 link-opacity-50-hover link-underline-opacity-0 link-underline-opacity-100-hover"
						>
							{language === "fa" ? "مستندات" : "Documentation"}
						</a>
						<a
							href="#!"
							className="link-light link-offset-2 link-opacity-50-hover link-underline-opacity-0 link-underline-opacity-100-hover"
						>
							{language === "fa" ? "مرجع API" : "API Reference"}
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
