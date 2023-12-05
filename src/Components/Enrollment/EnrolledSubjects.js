// EnrolledSubjects.js
import React, { useEffect, useState } from "react";
import {
	getDocs,
	query,
	where,
	collection,
	doc,
	getDoc,
} from "firebase/firestore";
import { useAuth } from "../Authentication/AuthContext";
import { subjectsCollection, enrollmentsCollection } from "../../firebase";
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

const EnrolledSubjects = () => {
	const { user } = useAuth();
	const [enrolledSubjects, setEnrolledSubjects] = useState([]);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleShowFullList = () => {
		onOpen();
	};

	useEffect(() => {
		const fetchEnrolledSubjects = async () => {
			try {
				// Fetch the user's enrollments
				const userEnrollmentsQuery = query(
					enrollmentsCollection,
					where("user_id", "==", user.uid)
				);
				const userEnrollmentsSnapshot = await getDocs(userEnrollmentsQuery);
				const userEnrollmentsData = userEnrollmentsSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				// Fetch the subject details for the user's enrollments
				const enrolledSubjectsData = [];
				for (const enrollment of userEnrollmentsData) {
					const subjectIds = enrollment.subject_ids;

					for (const subjectId of subjectIds) {
						const subjectDocRef = doc(subjectsCollection, subjectId);
						const subjectDocSnapshot = await getDoc(subjectDocRef);

						if (subjectDocSnapshot.exists()) {
							const subjectData = {
								id: subjectDocSnapshot.id,
								...subjectDocSnapshot.data(),
							};

							// Include additional details in subjectData
							const { day, room, time } = subjectData;
							enrolledSubjectsData.push({
								...subjectData,
								day,
								room,
								time,
							});
						}
					}
				}

				setEnrolledSubjects(enrolledSubjectsData);
			} catch (error) {
				console.error("Error fetching enrolled subjects: ", error);
			}
		};

		fetchEnrolledSubjects();
	}, [user.uid]);

	return (
		<Flex
			align="center"
			justify="center"
			p="4"
			overflowX={{ base: "auto", lg: "hidden" }} // Add horizontal scroll on smaller screens
		>
			<VStack spacing="8" align="start" w={{ base: "full", lg: "xl" }}>
				<Heading mb="4" fontSize="4xl">
					Jadwal Kelas
				</Heading>
				{enrolledSubjects.map((subject) => (
					<Box
						key={subject.id}
						bg="white"
						p="6"
						rounded="lg"
						shadow="md"
						h="full"
						w={{ base: "full", lg: "full" }} // Adjust width on smaller screens
						mb="4">
						<Stack spacing="4">
							<Text fontSize="lg" fontWeight="bold">
								Hari: {subject.day}
							</Text>
							<Text>Waktu: {subject.time}</Text>
							<Text>Mata Pelajaran: {subject.subjectName}</Text>
							{/* Detail tambahan */}
							<Text>Ruangan: {subject.room}</Text>
						</Stack>
					</Box>
				))}
				{enrolledSubjects.length > 3 && (
					<Button colorScheme="blue" onClick={handleShowFullList}>
						Lihat Semua Jadwal
					</Button>
				)}
			</VStack>
		</Flex>
	);
};

export default EnrolledSubjects;
