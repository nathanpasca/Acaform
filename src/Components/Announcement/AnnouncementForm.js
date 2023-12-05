import React, { useContext } from "react";
import { announcementsCollection } from "../../firebase";
import { addDoc, serverTimestamp } from "firebase/firestore";
import {
	Box,
	Button,
	Input,
	Textarea,
	VStack,
	FormControl,
	FormLabel,
	useToast, // Import useToast
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../Authentication/AuthContext";

const AnnouncementForm = () => {
	const { user } = useContext(AuthContext);
	const toast = useToast(); // Initialize the useToast hook

	const formik = useFormik({
		initialValues: {
			title: "",
			content: "",
		},
		validationSchema: Yup.object({
			title: Yup.string().required("Judul diperlukan"),
			content: Yup.string().required("Konten pengumuman diperlukan"),
		}),
		onSubmit: async (values, { resetForm }) => {
			try {
				const docRef = await addDoc(announcementsCollection, {
					userId: user.uid,
					title: values.title,
					content: values.content,
					timestamp: serverTimestamp(),
				});

				console.log("Pengumuman ditambahkan dengan ID: ", docRef.id);
				resetForm();

				// Show success toast
				toast({
					title: "Pengumuman berhasil dikirim",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			} catch (error) {
				console.error("Error menambahkan pengumuman: ", error);

				// Show error toast
				toast({
					title: "Error",
					description: "Terjadi kesalahan saat mengirim pengumuman.",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		},
	});

	return (
		<VStack align="center" spacing={4} w="50%">
			<Box p={8} rounded="xl" shadow="md" w="50%" bg="white">
				<Box textAlign="center" mb={4}>
					<h2 className="text-lg">Kirim Pengumuman</h2>
				</Box>
				<VStack align="stretch" spacing={4}>
					<FormControl isInvalid={formik.touched.title && formik.errors.title}>
						<FormLabel>Judul:</FormLabel>
						<Input
							type="text"
							placeholder="Ketik di sini"
							value={formik.values.title}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="title"
						/>
					</FormControl>
					{formik.touched.title && formik.errors.title && (
						<Box color="red.500" fontSize="sm">
							{formik.errors.title}
						</Box>
					)}

					<FormControl
						isInvalid={formik.touched.content && formik.errors.content}>
						<FormLabel>Konten Pengumuman:</FormLabel>
						<Textarea
							height="24"
							value={formik.values.content}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="content"
							placeholder="Ketik pengumuman Anda di sini"
						/>
					</FormControl>
					{formik.touched.content && formik.errors.content && (
						<Box color="red.500" fontSize="sm">
							{formik.errors.content}
						</Box>
					)}

					<Button onClick={formik.handleSubmit} colorScheme="blue" size="md">
						Kirim Pengumuman
					</Button>
				</VStack>
			</Box>
		</VStack>
	);
};

export default AnnouncementForm;
