import React, { useState, useEffect } from "react";
import { announcementsCollection } from "../../firebase";
import { onSnapshot } from "firebase/firestore";

const AnnouncementList = () => {
	const [announcements, setAnnouncements] = useState([]);

	// Use useEffect to fetch and update announcements when the component mounts
	useEffect(() => {
		const unsubscribe = onSnapshot(announcementsCollection, (snapshot) => {
			const newAnnouncements = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setAnnouncements(newAnnouncements);
		});

		// Cleanup function to unsubscribe when the component unmounts
		return () => unsubscribe();
	}, []);

	return (
		<div className="flex items-center justify-center mt-4">
			<div className="bg-white p-8 rounded-xl shadow-md w-1/2">
				<h1>Announcement</h1>
				{announcements.map((announcement) => (
					<div key={announcement.id} className="card w-96 bg-base-100 my-4">
						<div className="card-body">
							<h2 className="card-title">{announcement.title}</h2>
							<p>{announcement.content}</p>
							<p>
								Posted on:{" "}
								{new Date(
									announcement.timestamp?.seconds * 1000
								).toLocaleString()}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>

		// <div class="pt-6 w-full grid grid-cols-12 gap-4">
		// 	<div class="col-span-12 md:col-span-4 rounded-lg border border-gray">
		// 		{announcements.map((announcement) => (
		// 			<div key={announcement.id}>
		// 				<div class="w-full bg-gray-50 rounded-t-lg p-4">
		// 					<p class="text-lg">{announcement.title}</p>
		// 				</div>
		// 				<div class="w-full bg-white rounded-b-lg">
		// 					<div class="flex flex-col h-full w-full px-4 pt-8">
		// 						<div class="flex text-text mb-4 text-base">
		// 							{announcement.content}
		// 						</div>
		// 						<div class="flex text-text mb-4 text-sm">
		// 							Posted on:{" "}
		// 							{new Date(
		// 								announcement.timestamp?.seconds * 1000
		// 							).toLocaleString()}
		// 						</div>
		// 						<div class="flex flex-row flex-grow">
		// 							<button
		// 								type="button"
		// 								class="relative mt-auto w-full py-2 text-gray-900 border border-red-500 mb-4 items-center mt-auto">
		// 								GO
		// 							</button>
		// 						</div>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		))}
		// 	</div>
		// </div>
	);
};

export default AnnouncementList;
