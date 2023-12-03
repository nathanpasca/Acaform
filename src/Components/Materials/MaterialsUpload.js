import React, { useState } from "react";
import {
	Box,
	Heading,
	VStack,
	Input,
	Textarea,
	Button,
	useToast,
} from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { firestore, storage, auth } from "../../firebase";

const MaterialUpload = () => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [file, setFile] = useState(null);
	const toast = useToast();

	const user = auth.currentUser;
	const userId = user ? user.uid : null;

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);
	};

	const handleUpload = async () => {
		try {
			console.log("File:", file);
			// Ensure the user is authenticated
			const userId = auth.currentUser?.uid;
			if (!userId) {
				throw new Error("User not authenticated.");
			}

			// Validate the selected file
			if (!file) {
				throw new Error("No file selected.");
			}

			// Generate a unique filename based on timestamp
			const fileName = `${Date.now()}_${file.name}`;
			console.log("Storage Object:", storage);
			// Create a storage reference with the new filename
			const storageRef = ref(storage, `materials/${fileName}`);
			console.log("Storage Ref:", storageRef);

			// Upload file to Firebase Storage
			await uploadBytes(storageRef, file);

			// Get file download URL
			const fileURL = await getDownloadURL(storageRef);

			// Add material data to Firestore
			const materialsCollection = collection(firestore, "materials");
			await addDoc(materialsCollection, {
				title,
				content,
				fileURL,
				userId, // Associate material with user
				timestamp: serverTimestamp(), // Add timestamp for sorting
				// Add more fields as needed
			});

			toast({
				title: "Material uploaded!",
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			// Clear input fields after successful upload
			setTitle("");
			setContent("");
			setFile(null);
		} catch (error) {
			console.error("Error uploading material:", error.message);
			toast({
				title: "Error uploading material",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<Box bg="white" p="6" rounded="lg" shadow="md" w="full" mb="4">
			<VStack spacing="4" align="start" w="full">
				<Heading fontSize="xl" fontWeight="bold">
					Upload Educational Material
				</Heading>
				<Input
					placeholder="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<Textarea
					placeholder="Content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
				<Input type="file" onChange={handleFileChange} />
				{/* Add more input fields for different types of materials */}
				<Button onClick={handleUpload} colorScheme="blue">
					Upload Material
				</Button>
			</VStack>
		</Box>
	);
};

export default MaterialUpload;
