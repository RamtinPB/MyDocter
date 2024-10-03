import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "./LanguageContext";

interface UserInfo {
	firstName: string;
	lastName: string;
	profilePicture: string;
	email: string;
	phoneNumber: string;
	password: string;
	verificationCode: string;
	userId: string;
	userGender: string;
	userHeight: string;
	userAge: string;
	userWeight: string;
	fixedPhone: string;
	fatherName: string;
	birthDate: string;
	nationalId: string;
	nationality: string;
	insuranceType: string;
	supplementaryInsuranceType: string;

	province: string;
	postalCode: string;
	city: string;
	address: string;
	maritalStatus: string;
	educationLevel: string;
}

function ManageUserInterfaceUserPersonalInformation() {
	const { userId } = useParams();

	const [user, setUser] = useState<UserInfo | null>(null);
	const [initialUser, setInitialUser] = useState<UserInfo | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { language } = useLanguage(); // Get language and toggle function from context

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch("/db.json");
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				const users = data.users;

				const selectedUser = users.find(
					(s: { userId: any }) => `${s.userId}` === userId
				);

				if (selectedUser) {
					setUser(selectedUser);

					setInitialUser(selectedUser);
				} else {
					setError("Service not found");
				}
				setLoading(false);
			} catch (err) {
				console.error("Error fetching users:", err);
				setLoading(false);
			}
		};

		fetchUsers();
	}, [userId]);

	if (loading) {
		return <div className="text-center my-5">Loading...</div>;
	}

	if (error) {
		return <div className="text-center my-5 text-danger">{error}</div>;
	}

	if (!user) {
		return <div className="text-center my-5 text-danger">User not found</div>;
	}

	// Handle input changes
	const handleChange = (key: string, value: string) => {
		if (user) {
			setUser({ ...user, [key]: value });
		}
	};

	// @ts-ignore
	const handleSubmit = () => {
		// Collect and prepare data to be sent to the backend
		const updatedData = {
			user,
		};

		console.log("Updated Data to Send:", updatedData);

		// Send to backend using fetch/axios etc.
		// Example:
		// fetch('/your-backend-endpoint', {
		//   method: 'POST',
		//   headers: { 'Content-Type': 'application/json' },
		//   body: JSON.stringify(updatedData),
		// }).then(response => {
		//   if (!response.ok) throw new Error('Error in updating');
		//   return response.json();
		// }).catch(error => console.error('Update error:', error));
	};

	const handleCancel = () => {
		setUser(JSON.parse(JSON.stringify(initialUser))); // Reset user to original
	};

	// Define field labels for both languages
	const labels: { [key: string]: { en: string; fa: string } } = {
		firstName: { en: "First Name", fa: "نام" },
		lastName: { en: "Last Name", fa: "نام خانوادگی" },
		profilePicture: { en: "Profile Picture", fa: "عکس پروفایل" },
		email: { en: "Email", fa: "ایمیل" },
		phoneNumber: { en: "Phone Number", fa: "شماره تلفن" },
		password: { en: "Password", fa: "رمز عبور" },
		verificationCode: { en: "Verification Code", fa: "کد تایید" },
		userId: { en: "User ID", fa: "شناسه کاربر" },
		userGender: { en: "Gender", fa: "جنسیت" },
		userHeight: { en: "Height", fa: "قد" },
		userAge: { en: "Age", fa: "سن" },
		userWeight: { en: "Weight", fa: "وزن" },
		fixedPhone: { en: "Fixed Phone", fa: "تلفن ثابت" },
		fatherName: { en: "Father's Name", fa: "نام پدر" },
		birthDate: { en: "Birth Date", fa: "تاریخ تولد" },
		nationalId: { en: "National ID", fa: "کد ملی" },
		nationality: { en: "Nationality", fa: "ملیت" },
		insuranceType: { en: "Insurance Type", fa: "نوع بیمه" },
		supplementaryInsuranceType: {
			en: "Supplementary Insurance",
			fa: "بیمه تکمیلی",
		},
		province: { en: "Province", fa: "استان" },
		postalCode: { en: "Postal Code", fa: "کد پستی" },
		city: { en: "City", fa: "شهر" },
		address: { en: "Address", fa: "آدرس" },
		maritalStatus: { en: "Marital Status", fa: "وضعیت تاهل" },
		educationLevel: { en: "Education Level", fa: "میزان تحصیلات" },
	};

	return (
		<div className="container custom-bg-4 shadow rounded-5 p-3 mb-4 mb-md-5">
			<div className="d-flex flex-column bg-white shadow text-end rounded-5 m-3 m-md-4 m-lg-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa"
							? `اطلاعات شخصی کاربر`
							: `Edit User: "${userId}" Personal Information`}
					</h3>
				</div>

				{/* account informations */}
				<div
					className="row row-cols-2 mx-2 mx-md-auto"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					{Object.entries(user).map(([key, value]) => (
						<div
							key={key}
							className={`col-6 text-${
								language === "fa" ? "end" : "start"
							} mb-5 px-3 px-md-5`}
							style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						>
							<label className="form-label mx-1">
								{language === "fa" ? labels[key]?.fa : labels[key]?.en || key}
							</label>
							<input
								type="text"
								className={`form-control  text-${
									language === "fa" ? "end" : "start"
								}`}
								value={value}
								onChange={(e) => handleChange(key, e.target.value)}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Submit and Cancel buttons */}
			<div className="d-flex justify-content-evenly px-3 py-2 my-2 ">
				<button
					className="btn btn-secondary rounded-pill px-3"
					onClick={handleCancel}
				>
					{language === "fa" ? "حذف تغییرات" : "Cancel Changes"}
				</button>
				<button
					className="btn btn-success rounded-pill px-3"
					onClick={handleSubmit}
				>
					{language === "fa" ? "ذخیره تغیرات" : "Save Changes"}
				</button>
			</div>
		</div>
	);
}

export default ManageUserInterfaceUserPersonalInformation;
