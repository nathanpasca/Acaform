// AnnouncementList.js
import React, { useState, useEffect } from "react";
import { announcementsCollection } from "../../firebase";
import { onSnapshot } from "firebase/firestore";
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

	// Menggunakan useEffect untuk mengambil dan memperbarui pengumuman saat komponen dimuat
	useEffect(() => {
		const unsubscribe = onSnapshot(announcementsCollection, (snapshot) => {
			const newAnnouncements = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setAnnouncements(newAnnouncements);
		});

		// Fungsi pembersihan untuk berhenti berlangganan ketika komponen dilepas
		return () => unsubscribe();
	}, []);

	// Fungsi untuk menangani menampilkan modal pengumuman
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
					</Box>
				))}
				{announcements.length > 3 && (
					<Button colorScheme="blue" onClick={handleShowAnnouncements}>
						Lihat Semua Pengumuman
					</Button>
				)}

				{/* Modal untuk Pengumuman */}
				<AnnouncementModal
					isOpen={isOpen}
					onClose={onClose}
					announcements={announcements}
				/>
			</VStack>
		</Flex>
	);
};

export default AnnouncementList;
