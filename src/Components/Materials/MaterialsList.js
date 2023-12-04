import React, { useEffect, useState } from "react";
import {
	Box,
	Heading,
	Text,
	VStack,
	HStack,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	useDisclosure,
	Center,
	Container,
	Divider,
} from "@chakra-ui/react";
import { firestore, storage } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { saveAs } from "file-saver";
import ReactPlayer from "react-player";

const MaterialsList = () => {
	const [materials, setMaterials] = useState([]);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedMaterial, setSelectedMaterial] = useState(null);

	useEffect(() => {
		const fetchMaterials = async () => {
			const materialsCollection = collection(firestore, "materials");
			const querySnapshot = await getDocs(
				query(materialsCollection, orderBy("timestamp", "desc"))
			);

			const materialsData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setMaterials(materialsData);
		};

		fetchMaterials();
	}, []);
	const handleViewMaterial = (material) => {
		setSelectedMaterial(material);
		onOpen();
	};

	const handleDownloadMaterial = async (material) => {
		if (material && material.fileURL) {
			const storageRef = ref(storage, material.fileURL);

			try {
				const downloadURL = await getDownloadURL(storageRef);

				// Use FileSaver to initiate the download
				saveAs(downloadURL, material.title);
			} catch (error) {
				console.error("Error getting download URL:", error);
			}
		}
	};

	const renderMaterialContent = () => {
		if (selectedMaterial && selectedMaterial.fileURL) {
			const fileExtension = selectedMaterial.fileURL
				.split(".")
				.pop()
				.split("?")[0]; // Extract file extension, handling query parameters

			// Render different content based on file type
			switch (fileExtension) {
				case "pdf":
					return (
						<iframe
							src={selectedMaterial.fileURL}
							title={selectedMaterial.title}
							width="100%"
							height="500px"
						/>
					);
				case "jpg":
				case "jpeg":
				case "png":
					return (
						<img
							src={selectedMaterial.fileURL}
							alt={selectedMaterial.title}
							style={{ maxWidth: "100%", maxHeight: "500px" }}
						/>
					);
				default:
					return (
						<div>
							<p>No preview available for this file type.</p>
							<a href={selectedMaterial.fileURL} download>
								Download {fileExtension.toUpperCase()} file
							</a>
						</div>
					);
			}
		}

		return null;
	};

	return (
		<Center>
			<Container>
				<VStack align="stretch" spacing={4} p={4}>
					<Heading fontSize="2xl" mb={4}>
						Materials List
					</Heading>
					{materials.map((material) => (
						<Box
							key={material.id}
							borderWidth="1px"
							borderRadius="lg"
							overflow="hidden">
							<Box p="6">
								{material.fileURL ? (
									<React.Fragment>
										<Heading fontSize="xl" mb={2}>
											{material.title}
										</Heading>
										<Divider />
										<Text mt={4} mb={4} color="gray.500">
											{material.content}
										</Text>
										{material.youtubeEmbed && (
											<ReactPlayer
												url={material.youtubeEmbed}
												width="100%"
												height="315px" // Adjust the height as needed
											/>
										)}
										<HStack mt={4} spacing={4}>
											<Button
												colorScheme="blue"
												onClick={() => handleViewMaterial(material)}>
												View Material
											</Button>
										</HStack>
									</React.Fragment>
								) : (
									<React.Fragment>
										<Heading fontSize="xl" mb={2}>
											{material.title}
										</Heading>
										<Divider />
										<Text mt={4} mb={4} color="gray.500">
											{material.content}
										</Text>
										{/* Conditionally render YouTube embed outside the modal */}
										{material.youtubeEmbed && (
											<ReactPlayer
												url={material.youtubeEmbed}
												width="100%"
												height="315px" // Adjust the height as needed
											/>
										)}
									</React.Fragment>
								)}
							</Box>
						</Box>
					))}
					{/* Modal for displaying material details */}
					<Modal isOpen={isOpen} onClose={onClose} size="xl">
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>{selectedMaterial?.title}</ModalHeader>
							<ModalCloseButton />
							<ModalBody>{renderMaterialContent()}</ModalBody>
							<ModalFooter>
								<Button
									colorScheme="green"
									mr={3}
									onClick={() => handleDownloadMaterial(selectedMaterial)}>
									Download
								</Button>
								<Button colorScheme="blue" onClick={onClose}>
									Close
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				</VStack>
			</Container>
		</Center>
	);
};

export default MaterialsList;
