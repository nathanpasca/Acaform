import React from "react";
import { useFormik } from "formik";
import {
	Box,
	Button,
	Input,
	Textarea,
	useToast,
	FormControl,
	FormLabel,
	FormErrorMessage,
} from "@chakra-ui/react";
import { storage, firestore } from "../../firebase";
import "firebase/storage";
import "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const FormulirMaterial = () => {
	const toast = useToast();

	const formik = useFormik({
		initialValues: {
			title: "",
			content: "",
			youtubeEmbed: "",
			file: null,
		},
		validate: (values) => {
			const errors = {};
			if (!values.title) {
				errors.title = "Judul wajib diisi";
			}
			if (!values.content) {
				errors.content = "Konten wajib diisi";
			}
			return errors;
		},
		onSubmit: async (values) => {
			const { title, content, youtubeEmbed, file } = values;

			if (file) {
				const storageRef = ref(storage, `materials/${file.name}`);

				try {
					await uploadBytes(storageRef, file);
					const fileURL = await getDownloadURL(storageRef);

					const koleksiMaterial = collection(firestore, "materials");
					await addDoc(koleksiMaterial, {
						title,
						content,
						fileURL,
						youtubeEmbed,
						timestamp: serverTimestamp(),
					});

					toast({
						title: "Berkas berhasil diunggah!",
						status: "success",
						duration: 5000,
						isClosable: true,
					});

					formik.resetForm();
				} catch (error) {
					console.error("Error uploading file:", error);
				}
			} else {
				const koleksiMaterial = collection(firestore, "materials");
				await addDoc(koleksiMaterial, {
					title,
					content,
					youtubeEmbed,
					timestamp: serverTimestamp(),
				});

				toast({
					title: "Formulir berhasil disubmit tanpa berkas.",
					status: "success",
					duration: 5000,
					isClosable: true,
				});

				formik.resetForm();
			}
		},
	});

	return (
		<Box
			p={4}
			borderWidth="1px"
			borderRadius="md"
			boxShadow="md"
			bg="white"
			maxW="400px"
			m="auto">
			<form onSubmit={formik.handleSubmit}>
				<FormControl
					id="title"
					isInvalid={formik.touched.title && formik.errors.title}
					mb={4}>
					<FormLabel>Judul</FormLabel>
					<Input
						type="text"
						{...formik.getFieldProps("title")}
						placeholder="Judul"
						borderRadius="md"
					/>
					<FormErrorMessage>{formik.errors.title}</FormErrorMessage>
				</FormControl>

				<FormControl
					id="content"
					isInvalid={formik.touched.content && formik.errors.content}
					mb={4}>
					<FormLabel>Konten</FormLabel>
					<Textarea
						{...formik.getFieldProps("content")}
						placeholder="Konten"
						borderRadius="md"
					/>
					<FormErrorMessage>{formik.errors.content}</FormErrorMessage>
				</FormControl>

				<FormControl id="file" mb={4}>
					<FormLabel>Berkas (opsional)</FormLabel>
					<Input
						type="file"
						onChange={(e) => formik.setFieldValue("file", e.target.files[0])}
						borderRadius="md"
					/>
				</FormControl>

				<FormControl id="youtubeEmbed" mb={4}>
					<FormLabel>YouTube Embed (opsional)</FormLabel>
					<Input
						type="text"
						{...formik.getFieldProps("youtubeEmbed")}
						placeholder="YouTube Embed"
						borderRadius="md"
					/>
				</FormControl>

				<Button type="submit" colorScheme="blue" borderRadius="md" mt={4}>
					Submit
				</Button>
			</form>
		</Box>
	);
};

export default FormulirMaterial;
