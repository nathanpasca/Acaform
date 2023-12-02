// LoginForm.js
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
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

const LoginForm = () => {
	const [error, setError] = useState(null);
	const navigate = useNavigate();

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

				// console.log("API Response:", response.data)
			} catch (error) {
				setError(error.message);
			}
		},
	});

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
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
						<FormControl
							isInvalid={formik.touched.email && formik.errors.email}>
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
						<HStack w={"full"} justify={"space-between"}>
							<Link href="/register" className="text-sm mt-2">
								<span className="text-primary">Belum punya akun?</span>
							</Link>
						</HStack>
						<button
							className="btn btn-primary place-content-center mt-6 text-white"
							type="submit">
							Masuk
						</button>
					</VStack>
				</Box>
			</form>
		</>
	);
};

export default LoginForm;
