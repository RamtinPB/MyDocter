import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { useNavigate } from "react-router-dom";

interface Users {
	[key: string]: any;
}

function AdminDashboardManageUsers() {
	const { language } = useLanguage(); // Get language and toggle function from context
	const [users, setUsers] = useState<Users[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch("/db.json");
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				const users = data.users;
				setUsers(users);
			} catch (err) {
				console.error("Error fetching users:", err);
			}
		};

		fetchUsers();
	}, []);

	const addUser = () => {
		const newUser = {
			firstName: "",
			lastName: "",
			userId: "", // You might want to generate a unique ID here
		};
		setUsers([...users, newUser]);
	};

	const removeUser = (index: number) => {
		const updatedUsers = users.filter((_, i) => i !== index);
		setUsers(updatedUsers);
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
						{language === "fa" ? "لیست کاربران" : "User List"}
					</h3>
				</div>
				<table
					className="table table-hover text-center mb-5"
					style={{ direction: language === "fa" ? "rtl" : "ltr" }}
				>
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">{language === "fa" ? "نام" : "First Name"}</th>
							<th scope="col">
								{language === "fa" ? "نام خانوادگی" : "Last Name"}
							</th>
							<th scope="col">
								{language === "fa" ? "شناسه کاربر" : "User ID"}
							</th>
							<th scope="col">{language === "fa" ? "ویرایش" : "Edit"}</th>
							<th scope="col">{language === "fa" ? "حذف" : "Delete"}</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, index) => (
							<tr key={index}>
								<th scope="row" className="align-middle">
									<span className="px-1">{index + 1}</span>
								</th>
								<td className="align-middle">{user.firstName}</td>
								<td className="align-middle">{user.lastName}</td>
								<td className="align-middle">{user.userId}</td>
								<td className="align-middle">
									<a
										href={`/edit-user/${user.userId}`} // Change this
										onClick={(e) => {
											e.preventDefault();
											navigate(`/edit-user/${user.userId}`);
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
							<td colSpan={6} className="align-middle">
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
	);
}

export default AdminDashboardManageUsers;
