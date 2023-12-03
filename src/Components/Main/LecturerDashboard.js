import React, { useState, useEffect } from "react";
import AnnouncementForm from "../Announcement/AnnouncementForm";
import ProfileForm from "../Profile/ProfileForm";
import { Button, Box, VStack, Heading, Text } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import SubjectForm from "../Subject/SubjectForm";
import EnrollmentForm from "../Enrollment/EnrollmentForm";
import MaterialUpload from "../Materials/MaterialsUpload";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase";

const LecturerDashboard = () => {
	const [isAnnouncementFormOpen, setAnnouncementFormOpen] = useState(false);
	const [isClassScheduleFormOpen, setClassScheduleFormOpen] = useState(false);
	const [isProfileFormOpen, setProfileFormOpen] = useState(false);

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

	const toggleAnnouncementForm = () => {
		setAnnouncementFormOpen((prev) => !prev);
	};

	const toggleClassScheduleForm = () => {
		setClassScheduleFormOpen((prev) => !prev);
	};

	const toggleProfileForm = () => {
		setProfileFormOpen((prev) => !prev);
	};

	// Check if the user is a lecturer
	if (userData && userData.role !== "lecturer") {
		return (
			<Box p={5}>
				<Text fontSize="xl" color="red.500">
					Oops! You can't access this page.
				</Text>
			</Box>
		);
	} else {
		return (
			<Box p={5}>
				<VStack spacing={4} align="center">
					{user && (
						<Box>
							<Heading as="h1" size="xl" mb={2}>
								Selamat datang, {user.email}!
							</Heading>
							<Text fontSize="md" color="gray.500">
								Mulai dengan mengelola pengumuman dan jadwal kelas Anda.
							</Text>
						</Box>
					)}
					<Button
						onClick={toggleAnnouncementForm}
						colorScheme={isAnnouncementFormOpen ? "teal" : "gray"}>
						{isAnnouncementFormOpen
							? "Tutup Formulir Pengumuman"
							: "Buka Formulir Pengumuman"}
					</Button>
					{isAnnouncementFormOpen && <AnnouncementForm />}

					<Button
						onClick={toggleClassScheduleForm}
						colorScheme={isClassScheduleFormOpen ? "teal" : "gray"}>
						{isClassScheduleFormOpen
							? "Tutup Formulir Profil"
							: "Buka Formulir Profil"}
					</Button>
					{isProfileFormOpen && <ProfileForm />}
					<SubjectForm />
					<MaterialUpload />
				</VStack>
			</Box>
		);
	}
};

export default LecturerDashboard;
