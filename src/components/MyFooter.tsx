import { FaInstagram, FaTelegram, FaWhatsapp } from "react-icons/fa";
import "../cssFiles/myfooter.css";
import { FaXTwitter } from "react-icons/fa6";

function MyFooter() {
	return (
		<footer className="custom-footer text-white shadow-lg py-3">
			<div className="d-flex justify-content-end px-5 py-4 me-5 gap-5">
				<div className="d-flex justidy-content-center px-5 mx-5 ">
					<h5 className="text-decoration-underline">پشتیبانی</h5>
				</div>
				<div className="custom-footer-right  ">
					<img
						src="src\images\Logo.png"
						className="custom-footer-logo"
						alt="Logo"
					/>
				</div>
			</div>
			<div className="d-flex flex-column justify-content-center align-items-center ">
				<hr className="custom-hr border border-2 border-white rounded-circle my-2" />
				<div className="icon-container text-start d-flex flex-wrap gap-4">
					<a href="#!">
						<FaInstagram size={35} color="white" />
					</a>
					<a href="#!">
						<FaTelegram size={35} color="white" />
					</a>
					<a href="#!">
						<FaWhatsapp size={35} color="white" />
					</a>
					<a href="#!">
						<FaXTwitter size={35} color="white" />
					</a>
				</div>
				<hr className="custom-hr border border-2 border-white rounded-circle my-2" />
				<div>
					<p className="text-uppercase fw-light text-secondary-emphesis mb-1">
						mydocter, 1.0, 2024-2025
					</p>
				</div>
			</div>
		</footer>
	);
}

export default MyFooter;
