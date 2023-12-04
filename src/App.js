import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Hero } from "./Components/Others/Hero";
import NavigationBar from "./Components/NavigationBar";
import RegistrationForm from "./Components/Authentication/RegisterForm";
import LoginForm from "./Components/Authentication/LoginForm";
import ParentContainer from "./Components/Main/ParentContainer";
import LecturerDashboard from "./Components/Main/LecturerDashboard";
import EnrollmentForm from "./Components/Enrollment/EnrollmentForm";
import MaterialsList from "./Components/Materials/MaterialsList";

function App() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		});

		return () => unsubscribe();
	}, []);

	return (
		<BrowserRouter>
			<NavigationBar />

			<Routes>
				<Route
					path="/"
					element={
						<>
							<Hero />
							{user ? (
								<div>
									<ParentContainer />
								</div>
							) : null}
						</>
					}
				/>
				<Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
				<Route path="/enrollment-form" element={<EnrollmentForm />} />
				<Route path="/register" element={<RegistrationForm />} />
				<Route path="/login" element={<LoginForm />} />
				<Route path="/materials" element={<MaterialsList />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
