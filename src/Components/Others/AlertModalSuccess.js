import { React, useState } from "react";
import { Modal, ModalContent } from "@chakra-ui/react";

export const AlertModalSuccess = () => {
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

	const closeSuccessModal = () => {
		setIsSuccessModalOpen(false);
	};

	return (
		<Modal isOpen={isSuccessModalOpen} onClose={closeSuccessModal}>
			<ModalContent>
				<div className="alert alert-success w-full h-full">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="stroke-current shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>Registrasi Berhasil!</span>
					<button className="btn btn-sm" onClick={closeSuccessModal}>
						X
					</button>
				</div>
			</ModalContent>
		</Modal>
	);
};
