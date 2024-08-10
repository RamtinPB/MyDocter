import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import pdfIcon from "../assets/icons/fileIcons/file-pdf-duotone-solid.svg";
import zipIcon from "../assets/icons/fileIcons/file-zipper-duotone-solid.svg";
import fileIcon from "../assets/icons/fileIcons/file-duotone-solid.svg";
import imgIcon from "../assets/icons/fileIcons/file-image-duotone-solid.svg";
import "../cssFiles/customColors.css";
import { FaCaretLeft } from "react-icons/fa";
import FormRender from "../components/FormRender";

interface Service {
	name: string;
	id: string;
	purchaseDate: string;
	finalPurchaseAmount: string;
	purchaseId: string;
	status: string;
	files?: { fileName: string; fileType: string; fileUrl: string }[]; // Added files property
	userInput: string;
}

const icons = {
	pdf: pdfIcon,
	zip: zipIcon,
	rar: zipIcon,
	jpg: imgIcon,
	jpeg: imgIcon,
	png: imgIcon,
	// Add other icons as needed
	default: fileIcon,
};

const getIconForFileType = (fileName: string) => {
	const extension = fileName
		.split(".")
		.pop()
		?.toLowerCase() as keyof typeof icons;
	return icons[extension] || icons["default"];
};

function UserHistoryExtended() {
	const { serviceId } = useParams<{ serviceId: string }>();
	const [service, setService] = useState<Service | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchService = async () => {
			try {
				const response = await axios.get<Service[]>(
					`http://localhost:3001/userPerchasedServices`
				);
				const selectedService = response.data.find(
					(s) => `${s.name}-${s.id}` === serviceId
				);
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
	}, [serviceId]);

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
		navigate("/UserHistory");
	};

	return (
		<div className="custom-bg-4">
			<div className="container py-5">
				<div className="bg-white border border-2 shadow text-end rounded-5 p-3 mb-4">
					<div className="text-start mx-2 mt-2 mb-2">
						<button onClick={handleBackClick} className="btn btn-link p-0 m-0">
							<FaCaretLeft size={27} color="black" />
						</button>
					</div>

					<div
						className="row row-cols-2 g-5 mb-3 mx-2"
						style={{ direction: "rtl" }}
					>
						<div className="col mb-2 px-5">
							<h5 className=" me-1">نام سرویس</h5>
							<div className="border border-1 border-primary shadow-sm rounded-4 pe-3 py-2">
								{service.name}
							</div>
						</div>
						<div className="col mb-2 px-5">
							<h5 className=" me-1">شماره سریال</h5>
							<div className="border border-1 border-primary shadow-sm rounded-4 pe-3 py-2">
								{service.id}
							</div>
						</div>
						<div className="col mb-2 px-5">
							<h5 className=" me-1">تاریخ خریداری</h5>
							<div className="border border-1 border-primary shadow-sm rounded-4 pe-3 py-2">
								{service.purchaseDate}
							</div>
						</div>
						<div className="col mb-2 px-5">
							<h5 className=" me-1">قیمت نهایی خریداری</h5>
							<div className="border border-1 border-primary shadow-sm rounded-4 pe-3 py-2">
								{service.finalPurchaseAmount}
							</div>
						</div>
						<div className="col mb-2 px-5">
							<h5 className=" me-1">شماره سریال تراکنش</h5>
							<div className="border border-1 border-primary shadow-sm rounded-4 pe-3 py-2">
								{service.purchaseId}
							</div>
						</div>
						<div className="col mb-2 px-5">
							<h5 className=" me-1">وضعیت پیگیری</h5>
							<div className="border border-1 border-primary shadow-sm rounded-4 pe-3 py-2">
								{service.status}
							</div>
						</div>
					</div>
				</div>
				<div className="bg-white border border-2 shadow text-end rounded-5 p-5 mb-4">
					<h5 className="pe-4 me-1">فایل های انتقال شده</h5>
					<div className="border border-1 border-primary shadow-sm rounded-4 px-2 mx-4 py-2">
						{service.files && service.files.length > 0 ? (
							<div className="d-flex gap-1 justify-content-start align-items-center">
								{service.files.map((file, index) => (
									<div key={index} className="file-item mx-2">
										<a
											href={file.fileUrl}
											download
											className="d-flex flex-column align-items-center"
										>
											<img
												src={getIconForFileType(file.fileType)}
												alt={file.fileType}
												className="img-fluid"
												style={{ width: "50px", height: "50px" }}
											/>
											{file.fileName}
										</a>
									</div>
								))}
							</div>
						) : (
							<div className="d-flex justify-content-center align-items-center text-center py-3">
								<p>هیچ فایلی یافت نشد</p>
							</div>
						)}
					</div>
				</div>
				<div className="bg-white border border-2 shadow text-end rounded-5 p-5 mb-4">
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
				<div className="bg-white border border-2 shadow text-end rounded-5 p-5 mb-4">
					<h5 className="pe-4 me-1">شرح حال کاربر</h5>
					<div className="border border-1 border-primary shadow-sm rounded-4 px-3 mx-4 py-2">
						{service.userInput ? (
							<p>{service.userInput}</p>
						) : (
							<div className="text-center py-3">
								<p>ورودی داده نشد</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserHistoryExtended;
