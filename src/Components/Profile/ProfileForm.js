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
			researchJournal: Yup.string().required("Wajib diisi"),
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

				console.log("Profil berhasil diperbarui/dibuat!");
			} catch (error) {
				console.error("Error updating/creating profile: ", error);
			}
		},
	});

	return (
		<VStack align="center" spacing={4} w="50%">
			<Box p={8} rounded="xl" shadow="md" w="50%" bg="white">
				<Box textAlign="center" mb={4}>
					<h2 className="text-lg">Perbarui Profil Anda</h2>
				</Box>
				<VStack align="stretch" spacing={4}>
					<FormControl
						isInvalid={
							formik.touched.researchJournal && formik.errors.researchJournal
						}>
						<FormLabel>Jurnal Penelitian:</FormLabel>
						<Input
							type="text"
							placeholder="Masukkan jurnal penelitian Anda"
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
						<FormLabel>Publikasi:</FormLabel>
						<Textarea
							height="24"
							placeholder="Masukkan publikasi Anda (satu per baris)"
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
						<FormLabel>Pencapaian:</FormLabel>
						<Textarea
							height="24"
							placeholder="Masukkan pencapaian Anda (satu per baris)"
							value={formik.values.achievements}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="achievements"
						/>
						<FormErrorMessage>{formik.errors.achievements}</FormErrorMessage>
					</FormControl>

					<Button onClick={formik.handleSubmit} colorScheme="blue" size="md">
						Perbarui Profil
					</Button>
				</VStack>
			</Box>
		</VStack>
	);
};

export default ProfileForm;
