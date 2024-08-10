import { FaCaretLeft } from "react-icons/fa";
import FormRender from "../components/FormRender";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../cssFiles/customColors.css";

interface Service {
	name: string;
	description: string;
	image: string;
	id: string;
	category: string;
}

function ServicePage() {
	const { id } = useParams<{ id: string }>();
	const [service, setService] = useState<Service | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchService = async () => {
			try {
				const response = await axios.get<Service[]>(
					`http://localhost:3001/services`
				);
				const selectedService = response.data.find((s) => `${s.id}` === id);
				console.log("Fetched services:", response.data);
				console.log("Purchase ID from URL:", id);

				if (selectedService) {
					setService(selectedService);
				} else {
					setError("Service not found");
				}
				setLoading(false);
			} catch (err) {
				setError("Failed to fetch service details");
				setLoading(false);
			}
		};

		fetchService();
	}, [id]);

	if (loading) {
		return <div className="text-center my-5">Loading...</div>;
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	if (!service) {
		return (
			<div className="text-center my-5 text-danger">Service not found</div>
		);
	}

	const handleBackClick = () => {
		if (service?.category.toLocaleLowerCase() === "specialist") {
			navigate("/SpecialistDoctorPrescription"); // Replace with actual route
		} else if (service?.category.toLocaleLowerCase() === "general") {
			navigate("/GeneralDoctorPrescription"); // Replace with actual route
		} else {
			navigate("/"); // Default fallback
		}
	};

	return (
		<div className="container custom-bg-4 rounded-5 ">
			{/* Header Section with Back Button and Service Name */}
			<div className="row custom-bg-1 align-items-center rounded-5 mb-4 mt-4 p-3">
				<div className="col-2 text-white">
					<button className="btn btn-link p-0">
						<FaCaretLeft
							onClick={handleBackClick}
							className="text-white"
							size={32}
						/>
					</button>
				</div>
				<div className="col-8 text-center text-white">
					<h3>{service.name}</h3>
				</div>
			</div>

			{/* Image and Description Section */}
			<div
				className="d-flex justify-content-between bg-white border border-2 shadow text-end rounded-5 p-4 mx-5 mb-4"
				style={{ direction: "rtl" }}
			>
				<p className="pe-4 me-1">فایل های انتقال شده</p>
				<img
					src="path_to_image.jpg"
					alt="Service"
					className="img-fluid rounded ms-3"
					style={{ width: "150px" }}
				/>
			</div>

			{/* File Upload Section */}
			<div className="bg-white border border-2 shadow text-end rounded-5 p-4 mx-5 mb-4">
				<h5 className="pe-4 me-1">انتقال فایل</h5>
				<div className="border border-1 border-primary shadow-sm rounded-4 px-2 mx-4 py-2">
					<div className="d-flex flex-wrap justify-content-end">
						{/* Example of a file link */}
						<a href="path_to_uploaded_file" className="d-block me-3 mb-3">
							<img
								src="path_to_file_icon"
								alt="File Icon"
								style={{ width: "50px" }}
							/>
						</a>
						{/* Add multiple <a> tags here for additional files */}
						<button type="button" className="btn btn-outline-secondary ms-2">
							<i className="fas fa-file-upload"></i> {"آپلود فایل"}
						</button>
					</div>
				</div>
			</div>

			{/* Form Render Section */}
			<div className="bg-white border border-2 shadow text-end rounded-5 p-5 mx-5 mb-4">
				<h5 className="pe-4 me-1">فرم تکمیل شده</h5>
				<div className="border border-1 border-primary shadow-sm rounded-4 px-3 mx-4 py-2">
					{true ? (
						<FormRender />
					) : (
						<div className="text-center py-3">
							<p>اطلاعات فرم یافت نشد</p>
						</div>
					)}
				</div>
			</div>

			{/* User Input Section */}
			<div className="bg-white border border-2 shadow text-end rounded-5 p-5 mx-5 mb-4">
				<h5 className="pe-4 me-1">شرح حال کاربر</h5>
				<textarea
					id="userInput"
					className="form-control text-end"
					rows={3}
					placeholder="متن خود را وارد کنید"
				></textarea>
			</div>

			{/* Pricing Table Section */}
			<div className="bg-white border border-2 shadow text-end rounded-5 p-5 mx-5 mb-4">
				<div className="table-responsive">
					<table className="table text-center">
						<thead>
							<tr>
								<th>{"نام بیمه"}</th>
								<th>{"قیمت سرویس"}</th>
								<th>{"سهم بیمه"}</th>
								<th>{"سهم بیمه تکمیلی"}</th>
								<th>{"مبالغ بازپرداخت"}</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{"بیمه سلامت"}</td>
								<td>{"...ریال"}</td>
								<td>{"...ریال"}</td>
								<td>{"...ریال"}</td>
								<td>{"...ریال"}</td>
							</tr>
							{/* Add more rows as needed */}
						</tbody>
					</table>
				</div>
			</div>

			{/* Purchase Button Section */}
			<div className="row mb-4">
				<div className="col-12 text-end">
					<span className="fs-4 ms-3">{"قیمت نهایی: ...ریال"}</span>
					<button className="btn btn-success rounded-pill px-4 py-2">
						{"خریداری سرویس"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default ServicePage;
