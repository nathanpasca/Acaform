// ClassScheduleList.js
import React, { useState, useEffect } from "react";
import {
	Box,
	Heading,
	Text,
	Stack,
	Flex,
	VStack,
	Button,
	useDisclosure,
} from "@chakra-ui/react";
import { onSnapshot, collection } from "firebase/firestore";
import { classSchedulesCollection } from "../../firebase";
import ScheduleModal from "../ClassSchedule/ClassScheduleModal";

const ClassScheduleList = () => {
	const [classScheduleData, setClassScheduleData] = useState([]);
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const unsubscribe = onSnapshot(classSchedulesCollection, (snapshot) => {
			const newClassSchedules = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setClassScheduleData(newClassSchedules);
		});

		// Cleanup function to unsubscribe when the component unmounts
		return () => unsubscribe();
	}, []);

	const handleShowFullList = () => {
		onOpen();
	};

	return (
		<Flex align="center" justify="center" p="4" minH="100vh">
			<VStack spacing="8" align="start" w="xl">
				<Heading mb="4" fontSize="4xl">
					Class Schedule
				</Heading>
				{classScheduleData.slice(0, 3).map((schedule) => (
					<Box
						key={schedule.id}
						bg="white"
						p="6"
						rounded="lg"
						shadow="md"
						w="full"
						mb="4">
						<Stack spacing="4">
							<Text fontSize="lg" fontWeight="bold">
								Day: {schedule.day}
							</Text>
							<Text>Time: {schedule.time}</Text>
							<Text>Subject: {schedule.subject}</Text>
							{/* Additional details */}
							<Text>Room: {schedule.room}</Text>
						</Stack>
					</Box>
				))}
				{classScheduleData.length > 3 && (
					<Button colorScheme="blue" onClick={handleShowFullList}>
						View Full List
					</Button>
				)}

				{/* Modal for Full List */}
				<ScheduleModal
					isOpen={isOpen}
					onClose={onClose}
					classScheduleData={classScheduleData}
				/>
			</VStack>
		</Flex>
	);
};

export default ClassScheduleList;
