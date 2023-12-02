import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Hero } from "./Components/Others/Hero";
import NavigationBar from "./Components/NavigationBar";
import AnnouncementForm from "./Components/Announcement/AnnouncementForm";
import AnnouncementList from "./Components/Announcement/AnnouncementList";
import RegistrationForm from "./Components/Authentication/RegisterForm";
import LoginForm from "./Components/Authentication/LoginForm";
import ClassScheduleForm from "./Components/ClassSchedule/ClassScheduleForm";
import ClassScheduleList from "./Components/ClassSchedule/ClassScheduleList";
import ParentContainer from "./Components/Main/ParentContainer";

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
									{user.role === "lecturer" && (
										<div>
											{/* Content for lecturer */}
											<AnnouncementForm />
										</div>
									)}
									<ParentContainer />
								</div>
							) : (
								<div>
									{/* Registration form or other content for users not signed in */}
								</div>
							)}
						</>
					}
				/>
				<Route path="/announcement-form" element={<AnnouncementForm />} />
				<Route path="/announcement-list" element={<AnnouncementList />} />
				<Route path="/register" element={<RegistrationForm />} />
				<Route path="/login" element={<LoginForm />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
