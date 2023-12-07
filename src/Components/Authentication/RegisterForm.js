// RegistrationForm.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import {
	Box,
	VStack,
	Heading,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	InputGroup,
	HStack,
	Link,
	Button,
	useToast,
	Select,
} from "@chakra-ui/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebase";

const RegistrationForm = () => {
	const navigate = useNavigate();
	const toast = useToast();

	const checkSecretCode = async (enteredCode) => {
		try {
			// Fetch the secret code from Firestore
			const docRef = doc(firestore, "secrets", "secretCode");
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const secretCode = docSnap.data().secretCode;

				return enteredCode === secretCode;
			}

			return false;
		} catch (error) {
			console.error("Error checking secret code: ", error.message);
			return false;
		}
	};

	const onSubmit = async (values) => {
		try {
			if (values.role === "lecturer" && !values.secretCode) {
				formik.setFieldError("secretCode", "Kode Rahasia diperlukan");
				return;
			}

			const isCodeValid = await checkSecretCode(values.secretCode);

			if (values.role === "lecturer" && !isCodeValid) {
				toast({
					title: "Invalid Secret Code",
					description:
						"The secret code is not valid for lecturer registration.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				return;
			}

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				values.email,
				values.password
			);

			await setDoc(doc(firestore, "users", userCredential.user.uid), {
				email: userCredential.user.email,
				displayName: values.displayName,
				role: values.role,
				createdAt: serverTimestamp(),
				enrollments: [],
			});

			toast({
				title: "Registration Success",
				description: "Pengguna berhasil terdaftar!",
				status: "success",
				duration: 5000,
				isClosable: true,
			});

			navigate("/");
		} catch (error) {
			console.error("Error mendaftarkan pengguna: ", error.message);
			toast({
				title: "Registration Error",
				description: error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
			displayName: "",
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
			displayName: yup.string().required("Nama tampilan diperlukan"),
			role: yup.string().required("Peran diperlukan"),
			secretCode: yup.string().when(["role", "lecturer"], {
				is: (role, lecturer) => role === "lecturer" && lecturer,
				then: yup.string().required("Kode Rahasia diperlukan"),
			}),
		}),
		onSubmit,
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
			<form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
				<VStack spacing={4} align={"flex-start"} w={"full"}>
					<VStack spacing={1} align={["center", "center"]} w={"full"} mb={4}>
						<Heading fontSize="24px">Daftar</Heading>
					</VStack>
					<FormControl
						isInvalid={formik.touched.email && formik.errors.email}
						width="100%">
						<FormLabel>Email:</FormLabel>
						<Input
							type="email"
							name="email"
							{...formik.getFieldProps("email")}
							variant={"filled"}
						/>
						<FormErrorMessage>{formik.errors.email}</FormErrorMessage>
					</FormControl>
					<FormControl
						isInvalid={formik.touched.displayName && formik.errors.displayName}
						width="100%">
						<FormLabel>Nama Tampilan:</FormLabel>
						<Input
							type="text"
							name="displayName"
							{...formik.getFieldProps("displayName")}
							variant={"filled"}
						/>
						<FormErrorMessage>{formik.errors.displayName}</FormErrorMessage>
					</FormControl>
					<FormControl
						isInvalid={formik.touched.password && formik.errors.password}
						width="100%">
						<FormLabel>Kata Sandi:</FormLabel>
						<InputGroup>
							<Input
								type="password"
								name="password"
								{...formik.getFieldProps("password")}
								variant={"filled"}
							/>
						</InputGroup>
						<FormErrorMessage>{formik.errors.password}</FormErrorMessage>
					</FormControl>

					<FormControl
						isInvalid={formik.touched.role && formik.errors.role}
						width="100%">
						<FormLabel>Peran:</FormLabel>
						<Select
							name="role"
							value={formik.values.role}
							onChange={(e) => formik.setFieldValue("role", e.target.value)}
							onBlur={formik.handleBlur}
							variant={"filled"}>
							<option value="student">Mahasiswa</option>
							<option value="lecturer">Dosen</option>
						</Select>
						<FormErrorMessage>{formik.errors.role}</FormErrorMessage>
					</FormControl>
					{formik.values.role === "lecturer" && (
						<FormControl
							isInvalid={formik.touched.secretCode && formik.errors.secretCode}
							width="100%">
							<FormLabel>Kode Rahasia:</FormLabel>
							<Input
								type="text"
								name="secretCode"
								{...formik.getFieldProps("secretCode")}
								variant={"filled"}
							/>
							<FormErrorMessage>{formik.errors.secretCode}</FormErrorMessage>
						</FormControl>
					)}
					<HStack w={"full"} justify={"space-between"}>
						<Link href="/login" className="text-sm mt-2">
							<span className="text-black">Sudah punya akun? Masuk</span>
						</Link>
					</HStack>
					<Button
						type="submit"
						colorScheme="teal"
						mt={6}
						isLoading={formik.isSubmitting}>
						Daftar
					</Button>
				</VStack>
			</form>
		</Box>
	);
};

export default RegistrationForm;
