import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { Button } from "@chakra-ui/react";

export const Hero = () => {
	const [user, setUser] = useState(null);

	// Check if the user is logged in
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		});

		// Cleanup function to unsubscribe when the component unmounts
		return () => unsubscribe();
	}, []);

	const handleGetStartedClick = () => {
		window.scrollTo({
			top: window.innerHeight, // Adjust this value as needed
			behavior: "smooth",
		});
	};

	return (
		<div>
			<div
				className="hero min-h-screen"
				style={{
					backgroundImage:
						"url(https://timemaster.ae/uploads/news_article/10-daily-activities-that-contribute-to-a-child-s-academic-performance_2023_02_22_09_12_06.webp)",
				}}>
				<div className="hero-overlay bg-opacity-60"></div>
				<div className="hero-content text-center text-neutral-content">
					<div className="max-w-md">
						{user ? (
							<>
								<h1 className="mb-5 text-5xl font-bold">Welcome to Acaform</h1>
								<p className="mb-5">
									Elevate your academic journey with our cutting-edge online
									platform. Bridging the gap between educators and students,
									Acaform revolutionizes learning through seamless communication
									and resource sharing. Explore a world of possibilities in
									education.
								</p>
								<Button onClick={handleGetStartedClick} colorScheme="blue">
									Get Started
								</Button>
							</>
						) : (
							<>
								<h1 className="mb-5 text-5xl font-bold">Welcome to Acaform</h1>
								<p className="mb-5">
									Acaform revolutionizes learning through seamless communication
									and resource sharing.
								</p>
								<p className="mb-5">
									You must be registered and logged in to use this platform.
								</p>
								<Button onClick={handleGetStartedClick} colorScheme="blue">
									Get Started
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
