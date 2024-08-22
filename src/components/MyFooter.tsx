import { FaInstagram, FaTelegram, FaWhatsapp } from "react-icons/fa";
import "/src/cssFiles/myfooter.css";
import Logo from "/src/images/Logo.png";
import { FaXTwitter } from "react-icons/fa6";

function MyFooter() {
	return (
		<footer className="custom-footer text-white shadow-lg py-3">
			<div className="container">
				<div className="d-flex justify-content-end px-3 pt-1 pb-4 gap-2 px-lg-3 pt-lg-2 pb-lg-5 gap-lg-4">
					<div className="d-flex flex-column justidy-content-center align-items-center px-3 mx-3 gap-3">
						<h5 className="border-bottom border-2 my-1">پشتیبانی</h5>
						<a href="#!" className="link-light link-underline-opacity-0">
							راهنمایی
						</a>
					</div>
					<div className="d-flex flex-column justify-content-center align-items-center gap-3">
						<img src={Logo} className="custom-footer-logo" alt="Logo" />
						<a href="#!" className="link-light link-underline-opacity-0">
							پشتیبانی 24/7
						</a>
						<a href="#!" className="link-light link-underline-opacity-0">
							mydocter.support@gmail
						</a>
					</div>
				</div>
				<div className="d-flex flex-column">
					<hr className=" border border-white rounded-circle my-2" />
					<div className="d-flex flex-row justify-content-center align-items-center">
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
						{/*
						<div className="dropdown">
							<button
								className="btn btn-secondary dropdown-toggle"
								type="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								زبان
							</button>
							<ul className="dropdown-menu">
								<li>
									<a className="dropdown-item" href="#">
										فارسی
									</a>
								</li>
								<li>
									<a className="dropdown-item" href="#">
										انگلیسی
									</a>
								</li>
							</ul>
						</div>
						*/}
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
