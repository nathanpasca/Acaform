// ClassScheduleForm.js
import React, { useState } from "react";
import {
	Box,
	Heading,
	Input,
	Select,
	Button,
	FormControl,
	FormLabel,
	Stack,
} from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { classSchedulesCollection } from "../../firebase";

const ClassScheduleForm = () => {
	const [scheduleData, setScheduleData] = useState({
		day: "",
		time: "",
		subject: "",
		room: "", // Add room location to the state
	});

	const handleChange = (e) => {
		setScheduleData({
			...scheduleData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Add the schedule to Firebase
		try {
			const docRef = await addDoc(classSchedulesCollection, {
				...scheduleData,
				timestamp: serverTimestamp(),
			});
			console.log("Document written with ID: ", docRef.id);
			// Optionally, you can clear the form or show a success message here
		} catch (error) {
			console.error("Error adding document: ", error);
			// Handle error (show error message, etc.)
		}
	};

	return (
		<Box p="4" mb="8" bg="white" rounded="lg" shadow="md">
			<Heading mb="4" fontSize="xl">
				Add Class Schedule
			</Heading>
			<form onSubmit={handleSubmit}>
				<Stack spacing="4">
					{/* Existing form fields */}
					<FormControl id="day" isRequired>
						<FormLabel>Day</FormLabel>
						<Select name="day" value={scheduleData.day} onChange={handleChange}>
							<option value="Monday">Monday</option>
							<option value="Tuesday">Tuesday</option>
							<option value="Wednesday">Wednesday</option>
							<option value="Thursday">Thursday</option>
							<option value="Friday">Friday</option>
						</Select>
					</FormControl>

					<FormControl id="time" isRequired>
						<FormLabel>Time</FormLabel>
						<Input
							type="text"
							name="time"
							value={scheduleData.time}
							onChange={handleChange}
							placeholder="10:00 AM - 12:00 PM"
						/>
					</FormControl>

					<FormControl id="subject" isRequired>
						<FormLabel>Subject</FormLabel>
						<Input
							type="text"
							name="subject"
							value={scheduleData.subject}
							onChange={handleChange}
							placeholder="Mathematics"
						/>
					</FormControl>

					{/* Add room location field */}
					<FormControl id="room" isRequired>
						<FormLabel>Room Location</FormLabel>
						<Input
							type="text"
							name="room"
							value={scheduleData.room}
							onChange={handleChange}
							placeholder="Room 101"
						/>
					</FormControl>

					<Button type="submit" colorScheme="blue">
						Add Schedule
					</Button>
				</Stack>
			</form>
		</Box>
	);
};

export default ClassScheduleForm;
