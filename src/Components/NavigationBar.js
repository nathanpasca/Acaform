import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logout } from "./Authentication/Logout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase";

const NavigationBar = () => {
	const [user, setUser] = useState(null);
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setUser(user);
			if (user) {
				const userDoc = await getDoc(doc(firestore, "users", user.uid));
				if (userDoc.exists()) {
					const fetchedUserData = userDoc.data();
					setUserData(fetchedUserData);

					const userRole = fetchedUserData.role;
				} else {
					console.error("Dokumen pengguna tidak ditemukan di Firestore");
				}
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<div className="navbar bg-base-100">
			<div className="navbar-start">
				<div className="dropdown">
					<label tabIndex={0} className="btn btn-ghost lg:hidden">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h8m-8 6h16"
							/>
						</svg>
					</label>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
						<li>
							{userData && userData.role === "lecturer" ? (
								<Link to="/lecturer-dashboard">
									<a>Dashboard</a>
								</Link>
							) : (
								<Link to="/enrollment-form">
									<a>Enrollment</a>
								</Link>
							)}
						</li>
						<li>
							<a>Profile</a>
						</li>
					</ul>
				</div>
				<Link to="/">
					<a className="btn btn-ghost text-xl">Acaform</a>
				</Link>
			</div>
			<div className="navbar-center hidden lg:flex">
				{user ? (
					<ul className="menu menu-horizontal px-1">
						<li>
							{userData && userData.role === "lecturer" ? (
								<Link to="/lecturer-dashboard">
									<a>Dashboard</a>
								</Link>
							) : (
								<Link to="/enrollment-form">
									<a>Enrollment</a>
								</Link>
							)}
						</li>

						<li>
							<a>Profile</a>
						</li>

						<li>
							<Link to="/materials">
								<a>Materials</a>
							</Link>
						</li>
					</ul>
				) : (
					<ul className="menu menu-horizontal px-1"></ul>
				)}
			</div>
			<div className="navbar-end">
				{user ? (
					// User is logged in, display LogoutButton
					<Logout />
				) : (
					// User is not logged in, display Login button
					<Link to="/login">
						<a className="btn btn-ghost">Login</a>
					</Link>
				)}
			</div>
		</div>
	);
};

export default NavigationBar;
