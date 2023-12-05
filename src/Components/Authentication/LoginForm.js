// LoginForm.js
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
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
} from "@chakra-ui/react";

const LoginForm = () => {
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const toast = useToast();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: yup.object().shape({
			email: yup
				.string()
				.email("Alamat email tidak valid")
				.required("Email diperlukan"),
			password: yup
				.string()
				.required("Kata sandi kosong.")
				.min(3, "Kata sandi tidak valid - minimum 8 karakter."),
		}),
		onSubmit: async (values) => {
			try {
				await signInWithEmailAndPassword(auth, values.email, values.password);
				navigate("/");
			} catch (error) {
				setError(error.message);
				toast({
					title: "Login Error",
					description: error.message,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
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
			<VStack spacing={4} align={"flex-start"} w={"full"}>
				<VStack spacing={1} align={["center", "center"]} w={"full"} mb={4}>
					<Heading fontSize="24px">Silakan Masuk</Heading>
				</VStack>
				<form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
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
					<HStack w={"full"} justify={"space-between"}>
						<Link href="/register" className="text-sm mt-2">
							<span className="text-black">Belum punya akun?</span>
						</Link>
					</HStack>
					<Button
						colorScheme="teal"
						mt={6}
						type="submit"
						isLoading={formik.isSubmitting}>
						Masuk
					</Button>
				</form>
			</VStack>
		</Box>
	);
};

export default LoginForm;
