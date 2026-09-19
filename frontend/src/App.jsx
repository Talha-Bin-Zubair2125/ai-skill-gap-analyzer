import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";
import adminprofile from "./pages/admin_dashboard/admin_profile";
import studentprofile from "./pages/student_dashboard/student_profile";
import mentorprofile from "./pages/mentor_dashboard/mentor_profile";

import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/admin-dashboard" element={<adminprofile />} />
          <Route path="/student-dashboard" element={<studentprofile />} />
          <Route path="/mentor-dashboard" element={<mentorprofile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
