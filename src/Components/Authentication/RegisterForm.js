// RegistrationForm.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	Box,
	VStack,
	Heading,
	Input,
	HStack,
	Link,
	InputGroup,
} from "@chakra-ui/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, firestore } from "../../firebase";

const RegistrationForm = () => {
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
			role: "student",
			secretCode: "",
		},
		validationSchema: yup.object().shape({
			email: yup
				.string()
				.email("Email tidak valid")
				.required("Email diperlukan"),
			password: yup
				.string()
				.required("Kata sandi diperlukan")
				.min(8, "Kata sandi harus minimal 8 karakter"),
			role: yup.string().required("Peran diperlukan"),
			secretCode: yup.string().test({
				name: "secretCode",
				test: function (value) {
					const { role } = this.parent;
					if (role === "lecturer") {
						return (
							!!value ||
							this.createError({ message: "Kode Rahasia diperlukan" })
						);
					}
					return true;
				},
			}),
		}),

		onSubmit: async (values) => {
			try {
				if (values.role === "lecturer" && values.secretCode !== "0000") {
					alert(
						"Kode rahasia tidak valid untuk pendaftaran dosen. Silahkan hubungi Admin untuk mendapatkan Kode Rahasia."
					);
					return;
				}

				const userCredential = await createUserWithEmailAndPassword(
					auth,
					values.email,
					values.password
				);

				await setDoc(doc(firestore, "users", userCredential.user.uid), {
					email: userCredential.user.email,
					role: values.role,
				});

				alert("Pengguna berhasil terdaftar!");

				navigate("/home");
			} catch (error) {
				console.error("Error mendaftarkan pengguna: ", error.message);
			}
		},
	});

	return (
		<Box
			w={["full", "md"]}
			p={[8, 10]}
			mt={[20, "10vh"]}
			mx="auto"
			border={["none", "1px"]}
			borderColor={["", "gray.300"]}
			borderRadius={10}>
			<form onSubmit={formik.handleSubmit}>
				<VStack spacing={4} align={"flex-start"} w={"full"}>
					<VStack spacing={1} align={["center", "center"]} w={"full"} mb={4}>
						<Heading fontSize="24px">Daftar</Heading>
					</VStack>
					<FormControl isInvalid={formik.touched.email && formik.errors.email}>
						<FormLabel>Email:</FormLabel>
						<Input
							type="email"
							name="email"
							width="full"
							{...formik.getFieldProps("email")}
							variant={"filled"}
						/>
						<FormErrorMessage>{formik.errors.email}</FormErrorMessage>
					</FormControl>
					<FormControl
						isInvalid={formik.touched.password && formik.errors.password}>
						<FormLabel>Kata Sandi:</FormLabel>
						<InputGroup>
							<Input
								type="password"
								name="password"
								width="full"
								{...formik.getFieldProps("password")}
								variant={"filled"}
							/>
						</InputGroup>
						<FormErrorMessage>{formik.errors.password}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={formik.touched.role && formik.errors.role}>
						<FormLabel>Peran:</FormLabel>
						<Input
							as="select"
							name="role"
							width="full"
							{...formik.getFieldProps("role")}
							variant={"filled"}>
							<option value="student">Mahasiswa</option>
							<option value="lecturer">Dosen</option>
						</Input>
						<FormErrorMessage>{formik.errors.role}</FormErrorMessage>
					</FormControl>
					{formik.values.role === "lecturer" && (
						<FormControl
							isInvalid={formik.touched.secretCode && formik.errors.secretCode}>
							<FormLabel>Kode Rahasia:</FormLabel>
							<Input
								type="text"
								name="secretCode"
								width="full"
								{...formik.getFieldProps("secretCode")}
								variant={"filled"}
							/>
							<FormErrorMessage>{formik.errors.secretCode}</FormErrorMessage>
						</FormControl>
					)}
					<HStack w={"full"} justify={"space-between"}>
						<Link href="/login" className="text-sm mt-2">
							<span className="text-primary">Sudah punya akun? Masuk</span>
						</Link>
					</HStack>
					<button
						className="btn btn-primary place-content-center mt-6 text-white"
						type="submit">
						Daftar
					</button>
				</VStack>
			</form>
		</Box>
	);
};

export default RegistrationForm;