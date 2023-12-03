import React, { useState, useEffect } from "react";
import {
	Box,
	Heading,
	FormControl,
	FormLabel,
	Select,
	Button,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
	addDoc,
	getDocs,
	collection,
	doc,
	setDoc,
	getDoc,
} from "firebase/firestore";
import {
	classesCollection,
	usersCollection,
	subjectsCollection,
	enrollmentsCollection,
} from "../../firebase";
import { useAuth } from "../Authentication/AuthContext";

const EnrollmentForm = () => {
	const { user } = useAuth();
	const [subjectsList, setSubjectsList] = useState([]);

	useEffect(() => {
		console.log("Subjects Collection Path: ", subjectsCollection);

		const fetchSubjects = async () => {
			try {
				console.log("Fetching subjects...");
				const subjectsSnapshot = await getDocs(subjectsCollection);
				const subjectsData = subjectsSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				console.log("Subjects data:", subjectsData);
				setSubjectsList(subjectsData);
			} catch (error) {
				console.error("Error fetching subjects: ", error);
			}
		};

		fetchSubjects();
	}, []);

	const formik = useFormik({
		initialValues: {
			classId: "",
			subjectIds: [],
		},
		validationSchema: Yup.object({
			subjectIds: Yup.array().min(1, "Select at least one subject"),
		}),
		onSubmit: async (values) => {
			try {
				// Update the enrollments in the users collection
				const userDoc = await doc(usersCollection, user.uid);
				const userEnrollments =
					(await getDoc(userDoc)).data().enrollments || [];

				// Check if the user is already enrolled in the specified subjects
				const isAlreadyEnrolled = await Promise.all(
					userEnrollments.map(async (enrollmentId) => {
						const enrollment = await getDoc(
							await doc(enrollmentsCollection, enrollmentId)
						);
						const enrolledSubjects = enrollment.data().subject_ids;
						return (
							enrolledSubjects &&
							enrolledSubjects.some((subjectId) =>
								values.subjectIds.includes(subjectId)
							)
						);
					})
				);

				if (isAlreadyEnrolled.includes(true)) {
					console.log("User is already enrolled in the specified subjects.");
					return; // Do not proceed with enrollment
				}

				// Create a new enrollment document
				const enrollmentDocRef = await addDoc(enrollmentsCollection, {
					user_id: user.uid,
					subject_ids: values.subjectIds,
				});

				userEnrollments.push(enrollmentDocRef.id);
				await setDoc(
					userDoc,
					{ enrollments: userEnrollments },
					{ merge: true }
				);

				console.log(
					"Enrollment created successfully with ID: ",
					enrollmentDocRef.id
				);
			} catch (error) {
				console.error("Error creating enrollment: ", error);
			}
		},
	});

	return (
		<Box
			p={8}
			rounded="xl"
			shadow="md"
			bg="white"
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			height="80vh"
			width="80%"
			mx="auto">
			<Heading mb={4} fontSize="xl">
				Enroll in Classes
			</Heading>
			<form
				onSubmit={formik.handleSubmit}
				className="w-full max-w-md" // Tailwind CSS classes for width
			>
				<FormControl id="subjectIds" isRequired mb={4}>
					<FormLabel>Subjects:</FormLabel>
					<Select
						name="subjectIds"
						value={formik.values.subjectIds}
						onChange={formik.handleChange}
						multiple
						className="w-full">
						{/* Render options dynamically from the subjectsList */}
						{subjectsList.map((subject) => (
							<option key={subject.id} value={subject.id}>
								{subject.subjectName}
							</option>
						))}
					</Select>
				</FormControl>

				<Button type="submit" colorScheme="blue" className="w-full mt-4">
					Enroll
				</Button>
			</form>
		</Box>
	);
};

export default EnrollmentForm;
