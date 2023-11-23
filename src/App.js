import "./App.css";
import NavigationBar from "./Components/NavigationBar";
import AnnouncementForm from "./Components/Announcement/AnnouncementForm";
import AnnouncementList from "./Components/Announcement/AnnouncementList";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<NavigationBar />
			<Routes>
				<Route path="/announcement-form" element={<AnnouncementForm />} />
				<Route path="/announcement-list" element={<AnnouncementList />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
