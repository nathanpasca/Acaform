// AnnouncementModal.js
import React from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	VStack,
	Heading,
	Text,
	Stack,
	Divider,
} from "@chakra-ui/react";

const AnnouncementModal = ({ isOpen, onClose, announcements }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Latest Announcements</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing="4" align="start">
						{announcements.map((announcement) => (
							<Stack
								key={announcement.id}
								bg="white"
								p="6"
								rounded="lg"
								shadow="md"
								w="full"
								mb="4">
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
						))}
					</VStack>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="blue" onClick={onClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AnnouncementModal;
