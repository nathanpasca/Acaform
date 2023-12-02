import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
	Box,
	Button,
	Input,
	FormControl,
	FormLabel,
	Select,
	VStack,
} from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { subjectsCollection } from "../../firebase";
import { AuthContext } from "../Authentication/AuthContext"; // Assuming you have an AuthContext

const SubjectForm = () => {
	const { user } = useContext(AuthContext);

	const formik = useFormik({
		initialValues: {
			subjectName: "",
			day: "",
			time: "",
			room: "",
		},
		validationSchema: Yup.object({
			subjectName: Yup.string().required("Subject name is required"),
			day: Yup.string().required("Day is required"),
			time: Yup.string()
				.required("Time is required")
				.matches(
					/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
					"Invalid time format (HH:mm)"
				),
			room: Yup.string().required("Room is required"),
		}),
		onSubmit: async (values) => {
			try {
				await addDoc(subjectsCollection, {
					userId: user.uid, // Associate subject with the user
					subjectName: values.subjectName,
					day: values.day,
					time: values.time,
					room: values.room,
					createdAt: serverTimestamp(),
				});

				console.log("Subject added successfully!");
				formik.resetForm();
			} catch (error) {
				console.error("Error adding subject: ", error);
			}
		},
	});

	return (
		<VStack align="center" spacing={4} w="50%">
			<Box p={8} rounded="xl" shadow="md" w="50%" bg="white">
				<Box textAlign="center" mb={4}>
					<h2 className="text-lg">Add Subject</h2>
				</Box>
				<VStack align="stretch" spacing={4}>
					<FormControl
						isInvalid={formik.touched.subjectName && formik.errors.subjectName}>
						<FormLabel>Subject Name:</FormLabel>
						<Input
							type="text"
							placeholder="Enter subject name"
							value={formik.values.subjectName}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="subjectName"
						/>
					</FormControl>
					{formik.touched.subjectName && formik.errors.subjectName && (
						<Box color="red.500" fontSize="sm">
							{formik.errors.subjectName}
						</Box>
					)}

					<FormControl isInvalid={formik.touched.day && formik.errors.day}>
						<FormLabel>Day:</FormLabel>
						<Select
							placeholder="Select day"
							value={formik.values.day}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="day">
							<option value="Monday">Monday</option>
							<option value="Tuesday">Tuesday</option>
							<option value="Wednesday">Wednesday</option>
							<option value="Thursday">Thursday</option>
							<option value="Friday">Friday</option>
							{/* Add more options as needed */}
						</Select>
					</FormControl>

					<FormControl isInvalid={formik.touched.time && formik.errors.time}>
						<FormLabel>Time:</FormLabel>
						<Input
							type="text"
							placeholder="Enter time (HH:mm)"
							value={formik.values.time}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="time"
						/>
					</FormControl>
					<FormControl isInvalid={formik.touched.room && formik.errors.room}>
						<FormLabel>Room:</FormLabel>
						<Input
							type="text"
							placeholder="Enter room"
							value={formik.values.room}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="room"
						/>
					</FormControl>

					{formik.touched.room && formik.errors.room && (
						<Box color="red.500" fontSize="sm">
							{formik.errors.room}
						</Box>
					)}

					<Button onClick={formik.handleSubmit} colorScheme="blue" size="md">
						Add Subject
					</Button>
				</VStack>
			</Box>
		</VStack>
	);
};

export default SubjectForm;
