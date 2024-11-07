import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { useNavigate } from "react-router-dom";
import "../cssFiles/tableOverflow.css";
import "../cssFiles/adminbuttons.css";
import axiosInstance from "../myAPI/axiosInstance";

interface usersListDataProps {
	id: string | number;
	name: string;
	lastName: string;
	emailAddress: string;
}

function AdminDashboardManageUsers() {
	const [usersList, setUsersList] = useState<usersListDataProps[]>([]);

	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10); // Default page size
	const [sortBy, setSortBy] = useState("id");
	const [descending, setDescending] = useState(false);

	const [dataUpdateFlag, setDataUpdateFlag] = useState(false);

	const navigate = useNavigate();
	const { language } = useLanguage();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axiosInstance.post("/api/Admin/GetUsersList", {
					sortBy: 1,
					descending,
					page,
					pageSize,
				});
				if (response.status !== 200) {
					throw new Error("Failed to fetch data from API");
				}

				setUsersList(response.data);
			} catch (error) {
				console.error(
					"API request for user data failed, trying local db.json",
					error
				);
				try {
					const response = await fetch("/db.json");
					if (!response.ok) {
						throw new Error("Failed to fetch user data from db.json");
					}
					const data = await response.json();
					const users = data.users;
					setUsersList(users);
				} catch (err) {
					console.error(
						"Failed to fetch user data from both API and db.json",
						err
					);
				}
			}
		};

		fetchUsers();
	}, [sortBy, descending, page, pageSize, dataUpdateFlag]);

	const addUser = () => {
		const newUser = {
			id: "",
			name: "",
			lastName: "",
			emailAddress: "",
		};
		setUsersList([...usersList, newUser]);
		setDataUpdateFlag((prev) => !prev);
	};

	const removeUser = (index: number) => {
		const updatedUsersList = usersList.filter((_, i) => i !== index);
		setUsersList(updatedUsersList);
		setDataUpdateFlag((prev) => !prev);
	};

	return (
		<div className="container custom-bg-4 shadow rounded-5 p-3 mb-4 mb-md-5">
			<div
				className={`d-flex flex-column bg-white shadow text-${
					language === "fa" ? "end" : "start"
				} rounded-5 m-3 m-md-4 m-lg-5`}
			>
				<div className="d-flex justify-content-center align-items-center custom-bg-1 shadow rounded-5 mb-4 p-3">
					<h3 className="text-center text-white m-0">
						{language === "fa" ? "لیست کاربران" : "List of Users"}
					</h3>
				</div>

				<div className="container">
					<div
						className="d-flex justify-content-evenly align-items-center mt-2 mb-4"
						style={{ direction: language === "fa" ? "rtl" : "ltr" }}
					>
						<div className="d-flex align-items-center">
							<label className="px-2">
								{language === "fa" ? "ترتیب بر اساس" : "Sort By"}
							</label>
							<select
								className="text-center rounded-3"
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
							>
								<option value="id">{language === "fa" ? "شناسه" : "ID"}</option>
								<option value="name">
									{language === "fa" ? "نام" : "First Name"}
								</option>
								<option value="lastName">
									{language === "fa" ? "نام خانوادگی" : "Last Name"}
								</option>
							</select>
						</div>
						<div className="d-flex align-items-center">
							<label className="px-2">
								{language === "fa" ? "تعداد آیتم در صفحه" : "Items per page"}
							</label>
							<input
								className=" rounded-3"
								type="number"
								value={pageSize}
								min="1"
								max="100"
								onChange={(e) => setPageSize(parseInt(e.target.value) || 10)}
							/>
						</div>
						<div className="d-flex align-items-center">
							<label className="px-2">
								{language === "fa" ? "نزولی" : "Descending"}
							</label>
							<input
								type="checkbox"
								checked={descending}
								onChange={(e) => setDescending(e.target.checked)}
							/>
						</div>
					</div>
					<div className="pagination d-flex justify-content-center mb-4">
						<button
							className="btn btn-primary rounded-4"
							onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
							disabled={page === 1}
						>
							{language === "fa" ? "قبلی" : "Previous"}
						</button>
						<span className="mx-3">{`${
							language === "fa" ? "صفحه" : "Page"
						}: ${page}`}</span>
						<button
							className="btn btn-primary rounded-4"
							onClick={() => setPage((prev) => prev + 1)}
						>
							{language === "fa" ? "بعدی" : "Next"}
						</button>
					</div>

					<div className="table-responsive-container">
						<table
							className="table table-hover text-center mb-5"
							style={{ direction: language === "fa" ? "rtl" : "ltr" }}
						>
							<thead>
								<tr>
									<th scope="col">
										{language === "fa" ? "شناسه کاربر" : "User ID"}
									</th>
									<th scope="col">
										{language === "fa" ? "نام" : "First Name"}
									</th>
									<th scope="col">
										{language === "fa" ? "نام خانوادگی" : "Last Name"}
									</th>
									<th scope="col">{language === "fa" ? "ایمیل" : "Email"}</th>
									{/* <th scope="col">
										{language === "fa" ? "شماره همراه" : "Phone Number"}
									</th> */}
									<th scope="col">{language === "fa" ? "ویرایش" : "Edit"}</th>
									<th scope="col">{language === "fa" ? "حذف" : "Delete"}</th>
								</tr>
							</thead>
							<tbody>
								{usersList.map((user, index) => (
									<tr key={index}>
										<td className="align-middle">{user.id}</td>
										<td className="align-middle">{user.name}</td>
										<td className="align-middle">{user.lastName}</td>
										<td className="align-middle">{user.emailAddress}</td>
										{/* <td className="align-middle">{user.phoneNumber}</td> */}
										<td className="align-middle">
											<a
												href={`/edit-user/${user.id}`} // Change this
												onClick={(e) => {
													e.preventDefault();
													navigate(`/edit-user/${user.id}`, {
														state: { section: "manageUsers" },
													});
												}}
												id="btn-edit"
												className="rounded-circle btn shadow p-0 my-3"
											>
												<img
													src="/images/edit-cog.png"
													className="custom-admin-btn rounded-circle"
													alt="Edit"
												/>
											</a>
										</td>
										<td className="align-middle">
											<button
												id="btn-delete"
												className="rounded-circle btn p-0 m-1 m-md-3"
												type="button"
												onClick={() => removeUser(index)}
											>
												<img
													src="/images/red-delete.png"
													className="custom-admin-btn rounded-circle"
												/>
											</button>
										</td>
									</tr>
								))}
								<tr>
									<td colSpan={8} className="align-middle">
										<div
											id="btn-add"
											className="d-flex justify-content-center align-items-center"
										>
											<button
												className="rounded-circle btn p-0 m-1"
												type="button"
												onClick={addUser}
											>
												<img
													src="/images/green-add.png"
													className="custom-admin-btn rounded-circle"
												/>
											</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminDashboardManageUsers;
