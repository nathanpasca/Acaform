import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logout } from "./Authentication/Logout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const NavigationBar = () => {
	const [user, setUser] = useState(null);

	// Check if the user is logged in
	onAuthStateChanged(auth, (user) => {
		setUser(user);
	});

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
							<Link to="/announcement-form">
								<a>Announcement</a>
							</Link>
						</li>
						<li>
							<a>Parent</a>
							<ul className="p-2">
								<li>
									<a>Submenu 1</a>
								</li>
								<li>
									<a>Submenu </a>
								</li>
							</ul>
						</li>
						<li>
							<a>Item 3</a>
						</li>
					</ul>
				</div>
				<a className="btn btn-ghost text-xl">Acaform</a>
			</div>
			<div className="navbar-center hidden lg:flex">
				{user ? (
					<ul className="menu menu-horizontal px-1">
						<li>
							<Link to="/announcement-list">
								<a>Announcement</a>
							</Link>
						</li>
						<li tabIndex={0}>
							<details>
								<summary>Parent</summary>
								<ul className="p-2">
									<li>
										<a>Submenu 1</a>
									</li>
									<li>
										<a>Submenu 2</a>
									</li>
								</ul>
							</details>
						</li>
						<li>
							<a>Item 3</a>
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
