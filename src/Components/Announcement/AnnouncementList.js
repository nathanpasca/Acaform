// AnnouncementList.js
import React, { useState, useEffect } from "react";
import { announcementsCollection, firestore, auth } from "../../firebase";
import { onSnapshot, addDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
	Box,
	Heading,
	Text,
	Stack,
	Flex,
	VStack,
	Button,
	useDisclosure,
	Divider,
} from "@chakra-ui/react";
import AnnouncementModal from "./AnnouncementModal";

const AnnouncementList = () => {
	const [announcements, setAnnouncements] = useState([]);
	const { isOpen, onOpen, onClose } = useDisclosure();

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

	useEffect(() => {
		const unsubscribe = onSnapshot(announcementsCollection, (snapshot) => {
			const newAnnouncements = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setAnnouncements(newAnnouncements);
		});

		return () => unsubscribe();
	}, []);

	const deleteAnnouncement = async (announcementId) => {
		try {
			await deleteDoc(doc(announcementsCollection, announcementId));
			handleDeleteAnnouncement(announcementId);
		} catch (error) {
			console.error("Error deleting announcement:", error);
		}
	};

	const handleDeleteAnnouncement = (announcementId) => {
		setAnnouncements((prevAnnouncements) =>
			prevAnnouncements.filter(
				(announcement) => announcement.id !== announcementId
			)
		);
	};

	const handleShowAnnouncements = () => {
		onOpen();
	};

	return (
		<Flex align="center" justify="center" p="4" minH="100vh">
			<VStack spacing="8" align="start" w="xl">
				<Heading mb="4" fontSize="4xl">
					Pengumuman Terbaru
				</Heading>
				{announcements.slice(0, 3).map((announcement) => (
					<Box
						key={announcement.id}
						bg="white"
						p="6"
						rounded="lg"
						shadow="md"
						w="full"
						mb="4">
						<Stack spacing="4">
							<Heading fontSize="xl" fontWeight="bold">
								{announcement.title}
							</Heading>
							<Text>{announcement.content}</Text>
							<Divider />
							<Text fontSize="sm" color="gray.500">
								Diposting pada:{" "}
								{new Date(
									announcement.timestamp?.seconds * 1000
								).toLocaleString()}
							</Text>
						</Stack>
						{/* Add delete button */}

						{/* Conditionally render the delete button */}
						{userData && userData.role === "lecturer" && (
							<Button
								colorScheme="red"
								w="50%"
								mt={4}
								onClick={() => deleteAnnouncement(announcement.id)}>
								Delete Announcement
							</Button>
						)}
					</Box>
				))}
				{announcements.length > 3 && (
					<Button colorScheme="blue" onClick={handleShowAnnouncements}>
						Lihat Semua Pengumuman
					</Button>
				)}

				<AnnouncementModal
					isOpen={isOpen}
					onClose={onClose}
					announcements={announcements}
					deleteAnnouncement={deleteAnnouncement}
				/>
			</VStack>
		</Flex>
	);
};

export default AnnouncementList;
