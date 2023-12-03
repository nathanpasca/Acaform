import { Flex } from "@chakra-ui/react";
import AnnouncementList from "../Announcement/AnnouncementList";
import EnrolledSubjects from "../Enrollment/EnrolledSubjects";
import { React, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { firestore, auth } from "../../firebase";
import ChatRoom from "../Others/ChatRoom";

const ParentContainer = () => {
	const [user, setUser] = useState(null);
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setUser(user);
			if (user) {
				const userDoc = await getDoc(doc(firestore, "users", user.uid));
				if (userDoc.exists()) {
					const fetchedUserData = userDoc.data();
					setUserData(fetchedUserData);

					const userRole = fetchedUserData.role;
				} else {
					console.error("Dokumen pengguna tidak ditemukan di Firestore");
				}
			}
		});

		return () => unsubscribe();
	}, []);
	return (
		<Flex justifyContent="center" alignItems="center" minHeight="100vh">
			{userData && userData.role === "lecturer" ? (
				<>
					<AnnouncementList />
					<ChatRoom />
				</>
			) : (
				<>
					<AnnouncementList />
					<EnrolledSubjects />
					<ChatRoom />
				</>
			)}
		</Flex>
	);
};

export default ParentContainer;
