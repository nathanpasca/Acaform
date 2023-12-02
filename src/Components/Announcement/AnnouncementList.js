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

	// Use useEffect to fetch and update announcements when the component mounts
	useEffect(() => {
		const unsubscribe = onSnapshot(announcementsCollection, (snapshot) => {
			const newAnnouncements = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setAnnouncements(newAnnouncements);
		});

		// Cleanup function to unsubscribe when the component unmounts
		return () => unsubscribe();
	}, []);

	// Function to handle showing the announcement modal
	const handleShowAnnouncements = () => {
		onOpen();
	};

	return (
		<Flex align="center" justify="center" mt="4" p="4" minH="100vh">
			<VStack spacing="8" align="start" w="xl">
				<Heading mb="4" fontSize="4xl">
					Latest Announcements
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
								Posted on:{" "}
								{new Date(
									announcement.timestamp?.seconds * 1000
								).toLocaleString()}
							</Text>
						</Stack>
					</Box>
				))}
				{announcements.length > 3 && (
					<Button colorScheme="blue" onClick={handleShowAnnouncements}>
						View All Announcements
					</Button>
				)}

				{/* Modal for Announcements */}
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
