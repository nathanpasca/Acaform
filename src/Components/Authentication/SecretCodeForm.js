// SecretCodeForm.js
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
	useToast,
	Button,
	FormControl,
	FormLabel,
	Input,
	HStack,
	Text,
} from "@chakra-ui/react";
import { setDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";

const SecretCodeForm = () => {
	const toast = useToast();
	const [currentSecretCode, setCurrentSecretCode] = useState("");

	// Fungsi untuk mengambil dan menampilkan kode rahasia saat ini
	const fetchCurrentSecretCode = async () => {
		try {
			const docRef = doc(firestore, "secrets", "secretCode");
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const secretCode = docSnap.data().secretCode;
				setCurrentSecretCode(secretCode);
			} else {
				setCurrentSecretCode(""); // Set kosong jika kode rahasia tidak ada
			}
		} catch (error) {
			console.error("Error mengambil kode rahasia: ", error.message);
		}
	};

	useEffect(() => {
		// Mengambil kode rahasia saat komponen dimuat
		fetchCurrentSecretCode();
	}, []);

	const formik = useFormik({
		initialValues: {
			secretCode: "",
		},
		onSubmit: async (values) => {
			try {
				// Menyimpan kode rahasia ke Firestore
				await setDoc(doc(firestore, "secrets", "secretCode"), {
					secretCode: values.secretCode,
				});

				toast({
					title: "Kode Rahasia Diperbarui",
					description: "Kode rahasia telah berhasil diperbarui.",
					status: "success",
					duration: 5000,
					isClosable: true,
				});

				// Mengambil dan menampilkan kode rahasia yang diperbarui
				fetchCurrentSecretCode();
				formik.resetForm();
			} catch (error) {
				console.error("Error memperbarui kode rahasia: ", error.message);
				toast({
					title: "Kesalahan Pembaruan",
					description: error.message,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		},
	});

	const deleteSecretCode = async () => {
		try {
			// Menghapus kode rahasia dari Firestore
			await deleteDoc(doc(firestore, "secrets", "secretCode"));

			toast({
				title: "Kode Rahasia Dihapus",
				description: "Kode rahasia telah berhasil dihapus.",
				status: "success",
				duration: 5000,
				isClosable: true,
			});

			// Mengosongkan formulir setelah penghapusan
			formik.resetForm();

			// Mengambil dan menampilkan kode rahasia yang diperbarui (kosong setelah dihapus)
			fetchCurrentSecretCode();
		} catch (error) {
			console.error("Error menghapus kode rahasia: ", error.message);
			toast({
				title: "Kesalahan Penghapusan",
				description: error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<form onSubmit={formik.handleSubmit}>
			<FormControl>
				<FormLabel>Kode Rahasia Saat Ini:</FormLabel>
				<Text mb={4}>{currentSecretCode}</Text>
				<FormLabel>Kode Rahasia Baru:</FormLabel>
				<Input
					type="text"
					name="secretCode"
					{...formik.getFieldProps("secretCode")}
					variant={"filled"}
					placeholder="Masukkan kode rahasia baru"
				/>
			</FormControl>
			<HStack mt={4} spacing={4}>
				<Button type="submit" colorScheme="blue">
					Perbarui Kode Rahasia
				</Button>
				<Button colorScheme="red" onClick={deleteSecretCode}>
					Hapus Kode Rahasia
				</Button>
			</HStack>
		</form>
	);
};

export default SecretCodeForm;
