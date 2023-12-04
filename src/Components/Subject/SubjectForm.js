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
			subjectName: Yup.string().required("Nama Mata Kuliah wajib diisi"),
			day: Yup.string().required("Hari wajib diisi"),
			time: Yup.string()
				.required("Waktu wajib diisi")
				.matches(
					/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
					"Format waktu tidak valid (HH:mm)"
				),
			room: Yup.string().required("Ruangan wajib diisi"),
		}),
		onSubmit: async (values) => {
			try {
				await addDoc(subjectsCollection, {
					userId: user.uid, // Mengaitkan mata kuliah dengan pengguna
					subjectName: values.subjectName,
					day: values.day,
					time: values.time,
					room: values.room,
					createdAt: serverTimestamp(),
				});

				console.log("Mata kuliah berhasil ditambahkan!");
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
					<h2 className="text-lg">Tambah Mata Kuliah</h2>
				</Box>
				<VStack align="stretch" spacing={4}>
					<FormControl
						isInvalid={formik.touched.subjectName && formik.errors.subjectName}>
						<FormLabel>Nama Mata Kuliah:</FormLabel>
						<Input
							type="text"
							placeholder="Masukkan nama mata kuliah"
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
						<FormLabel>Hari:</FormLabel>
						<Select
							placeholder="Pilih hari"
							value={formik.values.day}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="day">
							<option value="Senin">Senin</option>
							<option value="Selasa">Selasa</option>
							<option value="Rabu">Rabu</option>
							<option value="Kamis">Kamis</option>
							<option value="Jumat">Jumat</option>
							{/* Tambahkan opsi lain sesuai kebutuhan */}
						</Select>
					</FormControl>

					<FormControl isInvalid={formik.touched.time && formik.errors.time}>
						<FormLabel>Waktu:</FormLabel>
						<Input
							type="text"
							placeholder="Masukkan waktu (HH:mm)"
							value={formik.values.time}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="time"
						/>
					</FormControl>
					<FormControl isInvalid={formik.touched.room && formik.errors.room}>
						<FormLabel>Ruangan:</FormLabel>
						<Input
							type="text"
							placeholder="Masukkan ruangan"
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
						Tambah Mata Kuliah
					</Button>
				</VStack>
			</Box>
		</VStack>
	);
};

export default SubjectForm;
