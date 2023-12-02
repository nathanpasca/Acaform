import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../Authentication/AuthContext";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { profilesCollection } from "../../firebase";
import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Textarea,
	VStack,
} from "@chakra-ui/react";

const ProfileForm = () => {
	const { user } = useAuth();

	const formik = useFormik({
		initialValues: {
			researchJournal: "",
			publications: "",
			achievements: "",
		},
		validationSchema: Yup.object({
			researchJournal: Yup.string().required("Research journal is required"),
			publications: Yup.string(),
			achievements: Yup.string(),
		}),
		onSubmit: async (values) => {
			try {
				const publicationsArray = values.publications
					? values.publications.split("\n").map((item) => item.trim())
					: [];

				const achievementsArray = values.achievements
					? values.achievements.split("\n").map((item) => item.trim())
					: [];

				const profileRef = doc(profilesCollection, user.uid);

				await setDoc(profileRef, {
					researchJournal: values.researchJournal,
					publications: publicationsArray,
					achievements: achievementsArray,
				});

				console.log("Profile updated/created successfully!");
			} catch (error) {
				console.error("Error updating/creating profile: ", error);
			}
		},
	});

	return (
		<VStack align="center" spacing={4} w="50%">
			<Box p={8} rounded="xl" shadow="md" w="50%" bg="white">
				<Box textAlign="center" mb={4}>
					<h2 className="text-lg">Update Your Profile</h2>
				</Box>
				<VStack align="stretch" spacing={4}>
					<FormControl
						isInvalid={
							formik.touched.researchJournal && formik.errors.researchJournal
						}>
						<FormLabel>Research Journal:</FormLabel>
						<Input
							type="text"
							placeholder="Enter your research journal"
							value={formik.values.researchJournal}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="researchJournal"
						/>
						<FormErrorMessage>{formik.errors.researchJournal}</FormErrorMessage>
					</FormControl>

					<FormControl
						isInvalid={
							formik.touched.publications && formik.errors.publications
						}>
						<FormLabel>Publications:</FormLabel>
						<Textarea
							height="24"
							placeholder="Enter your publications (one per line)"
							value={formik.values.publications}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="publications"
						/>
						<FormErrorMessage>{formik.errors.publications}</FormErrorMessage>
					</FormControl>

					<FormControl
						isInvalid={
							formik.touched.achievements && formik.errors.achievements
						}>
						<FormLabel>Achievements:</FormLabel>
						<Textarea
							height="24"
							placeholder="Enter your achievements (one per line)"
							value={formik.values.achievements}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="achievements"
						/>
						<FormErrorMessage>{formik.errors.achievements}</FormErrorMessage>
					</FormControl>

					<Button onClick={formik.handleSubmit} colorScheme="blue" size="md">
						Update Profile
					</Button>
				</VStack>
			</Box>
		</VStack>
	);
};

export default ProfileForm;
