import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase";

export const Hero = () => {
	const [user, setUser] = useState(null);
	const [userData, setUserData] = useState(null);
	const navigate = useNavigate();

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

	const handleGetStartedClick = () => {
		if (user && userData.role === "lecturer") {
			navigate("/lecturer-dashboard");
		} else if (user && userData.role === "student") {
			window.scrollTo({
				top: window.innerHeight,
				behavior: "smooth",
			});
		} else {
			navigate("/register");
		}
	};

	return (
		<div>
			<div
				className="hero min-h-screen "
				style={{
					backgroundImage:
						"url(https://timemaster.ae/uploads/news_article/10-daily-activities-that-contribute-to-a-child-s-academic-performance_2023_02_22_09_12_06.webp)",
				}}>
				<div className="hero-overlay bg-opacity-60"></div>
				<div className="hero-content text-center text-neutral-content">
					<div className="max-w-md">
						{user ? (
							<>
								<h1 className="mb-5 text-5xl font-bold">
									Selamat datang di Acaform
								</h1>
								<p className="mb-5 ">
									Tingkatkan perjalanan akademis Anda dengan platform online
									canggih kami. Menghubungkan kesenjangan antara pendidik dan
									siswa, Acaform merevolusi pembelajaran melalui komunikasi yang
									lancar dan berbagi sumber daya. Jelajahi dunia kemungkinan
									dalam pendidikan.
								</p>

								<div class="w-full flex items-center justify-center">
									<a href="#_" class="relative inline-block text-lg group">
										<span class="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
											<span class="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
											<span class="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
											<span
												class="relative"
												onClick={handleGetStartedClick}
												colorScheme="blue">
												Mulai
											</span>
										</span>
										<span
											class="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
											data-rounded="rounded-lg"></span>
									</a>
								</div>
							</>
						) : (
							<>
								<h1 className="mb-5 text-5xl font-bold">
									Selamat datang di Acaform
								</h1>
								<p className="mb-5">
									Acaform merevolusi pembelajaran melalui komunikasi yang lancar
									dan berbagi sumber daya.
								</p>
								<p className="mb-5">
									Anda harus terdaftar dan masuk untuk menggunakan platform ini.
									Silahkan klik tombol Mulai di bawah.
								</p>
								<div class="w-full  flex items-center justify-center">
									<a href="#_" class="relative inline-block text-lg group">
										<span class="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
											<span class="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
											<span class="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
											<span
												class="relative"
												onClick={handleGetStartedClick}
												colorScheme="blue">
												Mulai
											</span>
										</span>
										<span
											class="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
											data-rounded="rounded-lg"></span>
									</a>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
