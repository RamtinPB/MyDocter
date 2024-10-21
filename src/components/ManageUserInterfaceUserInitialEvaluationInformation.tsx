import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "./LanguageContext";

interface RiskFactors {
	drugAbuse: boolean;
	substanceAbuse: boolean;
	smoking: boolean;
	hookah: boolean;
	alcohol: boolean;
	miningExperience: boolean;
	chemicalExposure: boolean;
}

interface AssistiveDevicesProsthetics {
	cane: boolean;
	walker: boolean;
	wheelChair: boolean;
	armpitStick: boolean;
	prostheticLimb: boolean;
	denture: boolean;
	hearingAid: boolean;
	glasses: boolean;
	prostheticEye: boolean;
}

interface UserIEInfo {
	userId: string;
	userWeight: string;
	userHeight: string;
	userAge: string;
	userBodyMassIndex: string;
	illnessRecordNameSelf: string;
	illnessRecordNameFamily: string;
	userFamilyMemberRelation: string;
	hasBloodTransfusion: string;
	bloodTransfusionReaction: string;
	userPet: string;
	riskFactors: RiskFactors;
	sleepStatus: string;
	sleepIssues: string;
	allergyDrugName: string;
	allergyDrugReaction: string;
	allergyFoodName: string;
	allergyFoodReaction: string;
	hearingLimitations: string;
	sightLimitations: string;
	disabilityOrAmputation: string;
	assistiveDevicesProsthetics: AssistiveDevicesProsthetics;
	ableToEat: string;
	ableToDress: string;
	ableToBathe: string;
	ableToGoToBathroom: string;
	ableToFreelyMove: string;
	rugularDrugNames: string;
	pregnancyStatus: boolean;
	lactationStatus: boolean;
}

function ManageUserInterfaceUserInitialEvaluationInformation() {
	const { userId } = useParams();

	const [user, setUser] = useState<UserIEInfo | null>(null);
	const [initialUser, setInitialUser] = useState<UserIEInfo | null>(null);

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
				const users = data.usersIE;

				const selectedUser = users.find(
					(s: { userId: any }) => `${s.userId}` === userId
				);

				if (selectedUser) {
					setUser(selectedUser);

					setInitialUser(selectedUser);
				} else {
					setError("information not found");
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

	// Handle input changes for text fields and checkboxes
	const handleChange = (key: keyof UserIEInfo, value: string | boolean) => {
		if (user) {
			setUser({ ...user, [key]: value });
		}
	};

	// Handle changes for nested fields (e.g., risk factors, assistive devices)
	const handleNestedChange = (
		field: keyof UserIEInfo, // This should be a key of the user object
		key: keyof RiskFactors | keyof AssistiveDevicesProsthetics, // This is for nested fields
		value: boolean
	) => {
		if (user && field in user) {
			setUser({
				...user,
				[field]: { ...(user[field] as any), [key]: value }, // Use 'as any' to bypass the type error
			});
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

	// Define field labels
	const labels: { [key: string]: { en: string; fa: string } } = {
		userWeight: { en: "Weight", fa: "وزن" },
		userHeight: { en: "Height", fa: "قد" },
		userAge: { en: "Age", fa: "سن" },
		userBodyMassIndex: { en: "BMI", fa: "شاخص توده بدنی" },
		illnessRecordNameSelf: {
			en: "Self Illness Record",
			fa: "سابقه بیماری خود",
		},
		illnessRecordNameFamily: {
			en: "Family Illness Record",
			fa: "سابقه بیماری خانواده",
		},
		userFamilyMemberRelation: { en: "Family Relation", fa: "نسبت خانوادگی" },
		hasBloodTransfusion: { en: "Blood Transfusion", fa: "انتقال خون" },
		bloodTransfusionReaction: {
			en: "Blood Transfusion Reaction",
			fa: "واکنش انتقال خون",
		},
		userPet: { en: "Pet", fa: "حیوان خانگی" },
		sleepStatus: { en: "Sleep Status", fa: "وضعیت خواب" },
		sleepIssues: { en: "Sleep Issues", fa: "مشکلات خواب" },
		allergyDrugName: { en: "Drug Allergy", fa: "آلرژی دارویی" },
		allergyDrugReaction: { en: "Drug Allergy Reaction", fa: "واکنش به دارو" },
		allergyFoodName: { en: "Food Allergy", fa: "آلرژی غذایی" },
		allergyFoodReaction: { en: "Food Allergy Reaction", fa: "واکنش غذایی" },
		hearingLimitations: { en: "Hearing Limitations", fa: "محدودیت شنوایی" },
		sightLimitations: { en: "Sight Limitations", fa: "محدودیت بینایی" },
		disabilityOrAmputation: {
			en: "Disability/Amputation",
			fa: "ناتوانی یا قطع عضو",
		},
		ableToEat: { en: "Able to Eat", fa: "توانایی خوردن" },
		ableToDress: { en: "Able to Dress", fa: "توانایی پوشیدن لباس" },
		ableToBathe: { en: "Able to Bathe", fa: "توانایی حمام کردن" },
		ableToGoToBathroom: {
			en: "Able to Use Bathroom",
			fa: "توانایی استفاده از حمام",
		},
		ableToFreelyMove: { en: "Able to Move", fa: "توانایی حرکت" },
		pregnancyStatus: { en: "Pregnancy Status", fa: "وضعیت بارداری" },
		lactationStatus: { en: "Lactation Status", fa: "وضعیت شیردهی" },
	};

	return (
		<div className="container custom-bg-4 shadow rounded-5 p-3 mb-4 mb-md-5">
			<div className="d-flex flex-column bg-white shadow text-end rounded-5 m-3 m-md-4 m-lg-5">
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa"
							? `اطلاعات فرم ارزشیابی اولیه کاربر`
							: `Edit User: "${userId}" Initial Evaluation Information`}
					</h3>
				</div>

				{/* account informations */}
				<div
					className="row row-cols-2 mx-2 mx-md-auto"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					{Object.entries(user).map(([key, value]) => {
						if (typeof value === "boolean") {
							return (
								<div
									key={key}
									className={`col-6 text-${
										language === "fa" ? "end" : "start"
									} mb-5 px-3 px-md-5`}
									style={{ direction: language === "fa" ? "ltr" : "rtl" }}
								>
									<label className="form-label mx-1">
										{language === "fa"
											? labels[key]?.fa || key
											: labels[key]?.en || key}
									</label>
									<input
										type="checkbox"
										className="form-check-input shadow-sm mx-2"
										checked={value}
										onChange={(e) =>
											handleChange(key as keyof UserIEInfo, e.target.checked)
										} // Correctly pass the boolean value
									/>
								</div>
							);
						} else if (typeof value === "object") {
							return Object.entries(value).map(([nestedKey, nestedValue]) => (
								<div
									key={nestedKey}
									className={`col-6 text-${
										language === "fa" ? "end" : "start"
									} mb-5 px-3 px-md-5`}
									style={{ direction: language === "fa" ? "ltr" : "rtl" }}
								>
									<label className="form-label mx-1">
										{language === "fa"
											? labels[nestedKey]?.fa || nestedKey
											: labels[nestedKey]?.en || nestedKey}
									</label>
									<input
										type="checkbox"
										className="form-check-input shadow-sm mx-2"
										checked={nestedValue as boolean}
										onChange={(e) =>
											handleNestedChange(
												key as keyof UserIEInfo,
												nestedKey as keyof RiskFactors,
												e.target.checked
											)
										}
									/>
								</div>
							));
						} else {
							return (
								<div
									key={key}
									className={`col-6 text-${
										language === "fa" ? "end" : "start"
									} mb-5 px-3 px-md-5`}
								>
									<label className="form-label mx-1">
										{language === "fa"
											? labels[key]?.fa
											: labels[key]?.en || key}
									</label>
									<input
										type="text"
										className="form-control form-control-lg"
										value={value as string}
										onChange={(e) =>
											handleChange(key as keyof UserIEInfo, e.target.value)
										}
									/>
								</div>
							);
						}
					})}
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

export default ManageUserInterfaceUserInitialEvaluationInformation;
