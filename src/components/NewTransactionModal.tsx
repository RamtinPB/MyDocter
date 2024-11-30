import { useState } from "react";
import axiosInstance from "../myAPI/axiosInstance";
import { useLanguage } from "./LanguageContext";
import axios from "axios";

interface NewTransactionModalProps {
	show: boolean;
	onClose: () => void;
}

function NewTransactionModal({ show, onClose }: NewTransactionModalProps) {
	const [amount, setAmount] = useState(0);

	const { language } = useLanguage(); // Get language and toggle function from context

	const increaseBalance = async (amount: number) => {
		try {
			const response = await axiosInstance.post(
				`/api/Transaction/NewTransaction`,
				{ amount: amount },
				{
					withCredentials: true,
				}
			);
			if (response.status === 200) {
				alert(
					language === "fa"
						? "تراکنش با موفقیت انجام شد"
						: "Transaction was successful"
				);
			}
		} catch (error) {
			console.error("Error increasing balance", error);
			if (axios.isAxiosError(error)) {
				alert(error?.response?.data.message);
			}
		}
	};

	return (
		<div
			className={`modal ${show ? "show" : ""}`}
			style={{ display: show ? "block" : "none" }}
		>
			<div className="modal-dialog">
				<div className="modal-content">
					<div
						className="modal-header d-flex justify-content-between align-items-center px-3 py-2"
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					>
						<h5 className="modal-title ">
							{language === "fa" ? "افزایش موجودی" : "Balance Increase"}
						</h5>
						<button
							type="button"
							className="btn-close m-2"
							onClick={onClose}
						></button>
					</div>
					<div className="modal-body">
						<div className="mb-4 p-1">
							<input
								type="text"
								name="increaseAmount"
								className="form-control text-center p-1"
								placeholder={
									language === "fa"
										? "مقدار افزایش موجودی را وارد کنید"
										: "Enter increase amount"
								}
								onChange={(e) => setAmount(Number(e.target.value))}
							/>
						</div>
						<div className="modal-footer d-flex justify-content-evenly align-items-center p-0 pt-3 mb-2">
							<button
								type="button"
								className="btn btn-secondary rounded-pill"
								onClick={onClose}
							>
								{language === "fa" ? "خروج" : "Close"}
							</button>
							<button
								type="button"
								onClick={() => {
									increaseBalance(amount), onClose;
								}}
								className="btn btn-primary rounded-pill"
							>
								{language === "fa" ? "تأیید" : "Confirm"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NewTransactionModal;
