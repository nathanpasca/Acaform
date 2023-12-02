// ParentContainer.js
import React from "react";
import { Flex } from "@chakra-ui/react";
import AnnouncementList from "../Announcement/AnnouncementList";
import ClassScheduleList from "../ClassSchedule/ClassScheduleList";

const ParentContainer = () => {
	return (
		<Flex justifyContent="center" alignItems="center" minHeight="100vh">
			<AnnouncementList />
			<ClassScheduleList />
		</Flex>
	);
};

export default ParentContainer;
