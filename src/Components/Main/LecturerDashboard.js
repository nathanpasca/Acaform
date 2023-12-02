import React, { useState, useEffect } from "react";
import AnnouncementForm from "../Announcement/AnnouncementForm";
import ClassScheduleForm from "../ClassSchedule/ClassScheduleForm";
import ProfileForm from "../Profile/ProfileForm";
import { Button, Box, VStack, Heading, Text } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import SubjectForm from "../Subject/SubjectForm";
import EnrollmentForm from "../Enrollment/EnrollmentForm";

const LecturerDashboard = () => {
	const [isAnnouncementFormOpen, setAnnouncementFormOpen] = useState(false);
	const [isClassScheduleFormOpen, setClassScheduleFormOpen] = useState(false);
	const [isProfileFormOpen, setProfileFormOpen] = useState(false);

	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
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
						? "Tutup Formulir Jadwal Kelas"
						: "Buka Formulir Jadwal Kelas"}
				</Button>
				{isClassScheduleFormOpen && <ClassScheduleForm />}

				<Button
					onClick={toggleProfileForm}
					colorScheme={isClassScheduleFormOpen ? "teal" : "gray"}>
					{isClassScheduleFormOpen
						? "Tutup Formulir Profil"
						: "Buka Formulir Profil"}
				</Button>
				{isProfileFormOpen && <ProfileForm />}
				<SubjectForm />
			</VStack>
		</Box>
	);
};

export default LecturerDashboard;
