// ScheduleModal.js
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
} from "@chakra-ui/react";

const ClassScheduleModal = ({ isOpen, onClose, classScheduleData }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Full List of Class Schedules</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing="4" align="start">
						{classScheduleData.map((schedule) => (
							<Stack
								key={schedule.id}
								bg="white"
								p="6"
								rounded="lg"
								shadow="md"
								w="full"
								mb="4">
								<Text fontSize="lg" fontWeight="bold">
									Day: {schedule.day}
								</Text>
								<Text>Time: {schedule.time}</Text>
								<Text>Subject: {schedule.subject}</Text>
								<Text>Room: {schedule.room}</Text>
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

export default ClassScheduleModal;
