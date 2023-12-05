import React, { useState, useEffect } from "react";
import AnnouncementForm from "../Announcement/AnnouncementForm";
import ProfileForm from "../Profile/ProfileForm";
import SubjectForm from "../Subject/SubjectForm";
import { Button, Box, VStack, Heading, Text } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase";
import MaterialsForm from "../Materials/MaterialsForm"; // Import MaterialsForm

const LecturerDashboard = () => {
	const [isAnnouncementFormOpen, setAnnouncementFormOpen] = useState(false);
	const [isProfileFormOpen, setProfileFormOpen] = useState(false);
	const [isMaterialsFormOpen, setMaterialsFormOpen] = useState(false); // State for MaterialsForm
	const [isSubjectFormOpen, setSubjectFormOpen] = useState(false);

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

	const toggleProfileForm = () => {
		setProfileFormOpen((prev) => !prev);
	};

	const toggleMaterialsForm = () => {
		setMaterialsFormOpen((prev) => !prev);
	};

	const toggleSubjectForm = () => {
		setSubjectFormOpen((prev) => !prev);
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
								Selamat datang,{" "}
								{userData && userData.displayName
									? userData.displayName
									: user.email}
								!
							</Heading>
							<Text fontSize="md" color="gray.500">
								Mulai dengan mengelola pengumuman dan jadwal kelas Anda.
							</Text>
						</Box>
					)}
					<Button
						onClick={toggleAnnouncementForm}
						colorScheme={isAnnouncementFormOpen ? "teal" : "gray"}
						mb={4}
						mt={6}>
						{isAnnouncementFormOpen
							? "Tutup Formulir Pengumuman"
							: "Buka Formulir Pengumuman"}
					</Button>
					{isAnnouncementFormOpen && <AnnouncementForm />}

					<Button
						onClick={toggleProfileForm}
						colorScheme={isProfileFormOpen ? "teal" : "gray"}
						mb={4}>
						{isProfileFormOpen
							? "Tutup Formulir Profil"
							: "Buka Formulir Profil"}
					</Button>

					{isProfileFormOpen && <ProfileForm />}

					<Button
						onClick={toggleSubjectForm}
						colorScheme={isSubjectFormOpen ? "teal" : "gray"}
						mb={4}>
						{isSubjectFormOpen
							? "Tutup Formulir Mata Kuliah"
							: "Buka Formulir Mata Kuliah"}
					</Button>
					{isSubjectFormOpen && <SubjectForm />}

					{/* MaterialsForm Section */}
					<Button
						onClick={toggleMaterialsForm}
						colorScheme={isMaterialsFormOpen ? "teal" : "gray"}
						mb={4}>
						{isMaterialsFormOpen
							? "Tutup Formulir Materi"
							: "Buka Formulir Materi"}
					</Button>
					{isMaterialsFormOpen && <MaterialsForm />}
				</VStack>
			</Box>
		);
	}
};

export default LecturerDashboard;
