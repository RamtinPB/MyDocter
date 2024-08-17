import { FaInstagram, FaTelegram, FaWhatsapp } from "react-icons/fa";
import "../cssFiles/myfooter.css";
import { FaXTwitter } from "react-icons/fa6";

function MyFooter() {
	return (
		<footer className="custom-footer text-white shadow-lg py-3">
			<div className="container">
				<div className="d-flex justify-content-end px-3 pt-1 pb-4 gap-2 px-lg-3 pt-lg-2 pb-lg-5 gap-lg-4">
					<div className="d-flex flex-column justidy-content-center align-items-center px-3 mx-3 gap-3">
						<h6 className="border-bottom border-2 my-1">پشتیبانی</h6>
						<a href="#!" className="link-light link-underline-opacity-0">
							راهنمایی
						</a>
					</div>
					<div className="d-flex flex-column justify-content-center align-items-center gap-3">
						<img
							src="src\images\Logo.png"
							className="custom-footer-logo"
							alt="Logo"
						/>
						<a href="#!" className="link-light link-underline-opacity-0">
							پشتیبانی 24/7
						</a>
					</div>
				</div>
				<div className="d-flex flex-column">
					<hr className=" border border-white rounded-circle my-2" />
					<div className="d-flex flex-row justify-content-between align-items-center">
						<div className="d-flex justify-content-center gap-4 gap-md-5">
							<a href="#!">
								<FaInstagram className="custom-socials-icon" color="white" />
							</a>
							<a href="#!">
								<FaTelegram className="custom-socials-icon" color="white" />
							</a>
							<a href="#!">
								<FaWhatsapp className="custom-socials-icon" color="white" />
							</a>
							<a href="#!">
								<FaXTwitter className="custom-socials-icon" color="white" />
							</a>
						</div>
						<div></div>
					</div>
					<hr className="border border-white rounded-circle my-2" />
					<span className=" text-center text-uppercase mb-1">
						mydocter, 1.0, 2024-2025
					</span>
				</div>
			</div>
		</footer>
	);
}

export default MyFooter;
