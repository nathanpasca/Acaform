// ChatRoom.js
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
	Box,
	Input,
	Button,
	VStack,
	HStack,
	Text,
	Heading,
} from "@chakra-ui/react";
import {
	collection,
	addDoc,
	onSnapshot,
	doc,
	getDoc,
} from "firebase/firestore";
import { firestore, auth } from "../../firebase";

const ChatRoom = () => {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			collection(firestore, "chat"),
			(snapshot) => {
				const newMessages = snapshot.docs.map((doc) => doc.data());
				setMessages(newMessages);
			}
		);

		return () => unsubscribe();
	}, []);

	const formik = useFormik({
		initialValues: {
			newMessage: "",
		},
		onSubmit: async (values) => {
			const userDoc = await getDoc(
				doc(firestore, "users", auth.currentUser.uid)
			);
			const userData = userDoc.data();

			await addDoc(collection(firestore, "chat"), {
				userId: auth.currentUser.uid,
				content: values.newMessage,
				timestamp: new Date(),
				userName: userData.displayName,
			});

			formik.resetForm();
		},
	});

	return (
		<VStack spacing={8} align="stretch" p={4}>
			<Heading mb="4" fontSize="4xl">
				Obrolan Publik
			</Heading>
			<Box bg="gray.100" p={4} borderRadius="md" h="300px" overflowY="auto">
				{messages.map((message, index) => (
					<Box key={index} mb={2}>
						<Text fontSize="sm" fontWeight="bold">
							<span className="text-xs font-normal">
								{message.timestamp.toDate().toLocaleTimeString([], {
									weekday: "short",
									hour: "2-digit",
									minute: "2-digit",
								})}{" "}
							</span>
							{message.userName}:
						</Text>
						<Text>{message.content}</Text>
					</Box>
				))}
			</Box>
			<HStack>
				<Input
					placeholder="Ketik pesan Anda..."
					{...formik.getFieldProps("newMessage")}
				/>
				<Button colorScheme="blue" onClick={formik.handleSubmit}>
					Kirim
				</Button>
			</HStack>
		</VStack>
	);
};

export default ChatRoom;
