import { FaCaretLeft } from "react-icons/fa";
import FormRender from "../components/FormRender";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import "../cssFiles/customColors.css";

import pdfIcon from "../assets/icons/fileIcons/file-pdf-duotone-solid.svg";
import zipIcon from "../assets/icons/fileIcons/file-zipper-duotone-solid.svg";
import fileIcon from "../assets/icons/fileIcons/file-duotone-solid.svg";
import imgIcon from "../assets/icons/fileIcons/file-image-duotone-solid.svg";
import FormBuilder from "../components/FormBuilder";

interface FileData {
	fileName: string;
	fileType: string;
	fileUrl: string;
}

interface Service {
	name: string;
	description: string;
	image: string;
	id: string;
	category: string;
	files?: FileData[]; // File data interface
}

const icons = {
	pdf: pdfIcon,
	zip: zipIcon,
	rar: zipIcon,
	jpg: imgIcon,
	jpeg: imgIcon,
	png: imgIcon,
	default: fileIcon,
};

// Function to get the appropriate icon based on file extension
const getIconForFileType = (fileName: string) => {
	const extension = fileName
		.split(".")
		.pop()
		?.toLowerCase() as keyof typeof icons;
	return icons[extension] || icons["default"];
};

function ServicePage() {
	const { id } = useParams<{ id: string }>();

	const [service, setService] = useState<Service | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]); // State to store uploaded files
	const fileInputRef = useRef<HTMLInputElement>(null);

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
				console.log(response.data[0].image);

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

	const handleFileUploadClick = () => {
		fileInputRef.current?.click(); // Trigger file input click
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []); // Get selected files
		const newFiles = files.map((file) => ({
			fileName: file.name,
			fileType: file.type,
			fileUrl: URL.createObjectURL(file),
		}));

		// Update the state with newly uploaded files
		setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
	};

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
		<div className="container custom-bg-4 shadow rounded-5 pb-3 mb-5">
			{/* Header Section with Back Button and Service Name */}
			<div className="row custom-bg-1 shadow align-items-center rounded-5 mb-4 mt-5 p-3">
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
				<p className="pe-4 me-1">{service.description}</p>
				<img
					src={service.image}
					alt="Service"
					className="img-fluid shadow-sm rounded-5 ms-3"
					style={{ width: "400px" }}
				/>
			</div>

			{/* File Upload Section */}
			<div className="bg-white border border-2 shadow text-end rounded-5 p-4 mx-5 mb-4">
				<h5 className="pe-4 me-1">انتقال فایل</h5>
				<div className="d-flex  justify-content-between border border-1 shadow-sm rounded-4 px-2 mx-4 py-2">
					<div className="d-flex flex-wrap justify-content-start align-items-center">
						{/* Display uploaded files with icons */}
						{uploadedFiles.map((file, index) => (
							<a
								href={file.fileUrl}
								key={index}
								className="d-flex flex-column justify-content-center align-items-center d-block me-3 mb-3"
								download
							>
								<img
									src={getIconForFileType(file.fileName)}
									alt={`${file.fileName} Icon`}
									style={{ width: "50px", height: "50px" }}
								/>
								<p className="text-end mt-2">{file.fileName}</p>
							</a>
						))}
					</div>
					<div className="d-flex flex-wrap justify-content-end align-items-center">
						{/* Upload button */}
						<button
							type="button"
							className="btn btn-outline-secondary ms-2"
							onClick={handleFileUploadClick}
						>
							<i className="fas fa-file-upload"></i> {"آپلود فایل"}
						</button>
						{/* Hidden file input */}
						<input
							type="file"
							ref={fileInputRef}
							style={{ display: "none" }}
							onChange={handleFileChange}
							multiple // Allow multiple file selection
						/>
					</div>
				</div>
			</div>

			{/* Form Render Section */}
			<div className="bg-white border border-2 shadow text-end rounded-5 p-4 mx-5 mb-4">
				<h5 className="pe-4 me-1">فرم تکمیل شده</h5>
				<div className="border border-1 shadow-sm rounded-4 px-3 mx-4 py-2">
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
				<h5 className="pe-1 me-1">شرح حال کاربر</h5>
				<textarea
					id="userInput"
					className="form-control text-end"
					rows={3}
					placeholder="متن خود را وارد کنید"
				></textarea>
			</div>

			{/* Pricing Table Section */}
			<div className="bg-white border border-2 shadow text-end rounded-5 p-5 mx-5 mb-4">
				<div className="table-responsive" style={{ direction: "rtl" }}>
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
			<div className="d-flex justify-content-center mb-4 mt-5">
				<div className="bg-white border border-2 shadow text-end rounded-5 ">
					<span className=" mx-3 ">{"قیمت نهایی: ...ریال"}</span>
					<button className="btn btn-success rounded-pill px-4 py-2">
						{"خریداری سرویس"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default ServicePage;
