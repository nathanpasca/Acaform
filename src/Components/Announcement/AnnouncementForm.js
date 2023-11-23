import React, { useState } from "react";
import { announcementsCollection } from "../../firebase"; // Import only the necessary collection
import { addDoc, serverTimestamp } from "firebase/firestore";

const AnnouncementForm = () => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const handlePostAnnouncement = async () => {
		try {
			const docRef = await addDoc(announcementsCollection, {
				title,
				content,
				timestamp: serverTimestamp(),
			});

			console.log("Announcement added with ID: ", docRef.id);
		} catch (error) {
			console.error("Error adding announcement: ", error);
		}

		setTitle("");
		setContent(""); // Clear the content after posting
	};

	return (
		<div className="flex items-center justify-center mt-4">
			<div className="bg-white p-8 rounded-xl shadow-md w-1/2 ">
				<h2 className="text-center text-lg text">Post Announcement</h2>
				<div className="form-control">
					<label className="label">
						<span className="label-text">Title:</span>
					</label>
					<input
						type="text"
						placeholder="Type here"
						className="input input-bordered w-full"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div className="form-control mt-4">
					<label className="label">
						<span className="label-text">Announcement Content:</span>
					</label>
					<textarea
						className="textarea textarea-bordered h-24 w-full"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Type your announcement here"
					/>
				</div>
				<button
					onClick={handlePostAnnouncement}
					className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg mt-4">
					Post Announcement
				</button>
			</div>
		</div>
	);
};

export default AnnouncementForm;
