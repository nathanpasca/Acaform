import "../../App.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

export const Logout = () => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			// Sign out the user
			await signOut(auth);

			// Redirect to the login page or any other page
			navigate("/"); // Replace with the desired logout destination
		} catch (error) {
			console.error("Error logging out: ", error.message);
		}
	};
	return (
		<button onClick={handleLogout} className="btn btn-ghost">
			Logout
		</button>
	);
};
