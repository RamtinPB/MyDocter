import { FaCaretLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "/src/cssFiles/customColors.css";
import axiosInstance from "../myAPI/axiosInstance";
import FormBuilder from "./FormBuilder";
import axios from "axios";

interface FileData {
	fileName: string;
	fileType: string;
	fileUrl: string;
}

interface Service {
	name: string;
	description: string;
	detailedDescription: string;
	price: string;
	subsidy: string;
	image: string;
	id: string;
	category: string;
}

function ServicePageEdit() {
	const { id } = useParams();

	const [service, setService] = useState<Service | null>(null);
	const [servicePicture, setServicePicture] = useState<string | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchService = async () => {
			try {
				const response = await axiosInstance.get<Service[]>(`/services`);
				const selectedService = response.data.find((s) => `${s.id}` === id);

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
		navigate("/AdminDashboard");
	};

	const handleServicePictureChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files && e.target.files[0]) {
			setServicePicture(URL.createObjectURL(e.target.files[0]));

			const formData = new FormData();
			formData.append("servicePicture", e.target.files[0]);

			axios
				.post("/api/upload-service-picture", formData)
				.then((response) => {
					console.log("service picture uploaded successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error uploading service picture:", error);
				});
		}
	};

	const handleChange = () => {};

	const handleSubmit = () => {};

	const handleCancel = () => {};

	return (
		<div className="container custom-bg-4 shadow rounded-5 pb-3 mb-5">
			{/* Header Section with Back Button and Service Name */}
			<div className="row custom-bg-1 shadow rounded-5 mb-4 mt-5 p-3">
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
				className="d-flex flex-row justify-content-between bg-white border border-2 shadow text-end rounded-5 p-4 mx-5 mb-4 gap-3"
				style={{ direction: "rtl" }}
			>
				<input
					type="text"
					className="form-control text-end"
					placeholder="قیمت سرویس"
				/>
				<div className="d-flex flex-column justify-content-center align-items-center gap-3">
					{servicePicture ? (
						<img
							src={servicePicture}
							alt="service"
							className="shadow-sm rounded-5 ms-3"
							style={{ width: "400px", height: "200px" }}
						/>
					) : (
						<button
							className="btn btn-light shadow rounded-pill my-auto"
							style={{ cursor: "pointer" }}
						>
							<input
								type="file"
								accept="image/*"
								onChange={handleServicePictureChange}
							/>
						</button>
					)}
					<button
						className="btn btn-warning shadow-sm rounded-pill w-50"
						onClick={() => setServicePicture(null)}
					>
						<span> حذف عکس</span>
					</button>
				</div>
			</div>

			{/* Detailed Description Section */}
			<div className="bg-white border border-2 shadow text-end rounded-5 p-5 mx-5 mb-4">
				<h5 className="pe-1 me-1">توضیحات تکمیلی مربوط به سرویس</h5>
				<textarea
					id="userInput"
					className="form-control text-end"
					rows={3}
					placeholder="متن خود را وارد کنید"
				></textarea>
			</div>

			{/* Form Render Section */}
			<div className="bg-white border border-2 shadow text-end rounded-5 p-4 mx-5 mb-4">
				<h5 className="pe-4 me-1">فرم سرویس</h5>
				<div className="border border-1 shadow-sm rounded-4 px-3 mx-4 py-2">
					{true ? (
						<FormBuilder />
					) : (
						<div className="text-center py-3">
							<p>اطلاعات فرم یافت نشد</p>
						</div>
					)}
				</div>
			</div>

			<div className="d-flex flex-row justify-content-evenly bg-white border border-2 shadow text-end rounded-5 p-4 mx-5 mb-4 ">
				<input
					type="text"
					className="form-control text-end"
					placeholder="قیمت سرویس"
				/>
				<input
					type="text"
					className="form-control text-end"
					placeholder="یارانه سرویس"
				/>
			</div>

			{/* Submit and Cancel buttons */}
			<div className="d-flex justify-content-evenly px-3 my-2 mx-4 py-2">
				<button
					className="btn btn-secondary rounded-pill px-3"
					onClick={handleCancel}
				>
					{"حذف"}
				</button>
				<button
					className="btn btn-success rounded-pill px-3"
					onClick={handleSubmit}
				>
					{"ذخیره"}
				</button>
			</div>
		</div>
	);
}

export default ServicePageEdit;
