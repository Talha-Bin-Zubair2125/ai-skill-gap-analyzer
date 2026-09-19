import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";
import Admin_profile from "./pages/admin_dashboard/admin_profile";
import Student_profile from "./pages/student_dashboard/student_profile";
import Mentor_profile from "./pages/mentor_dashboard/mentor_profile";

import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/admin-dashboard" element={<Admin_profile />} />
          <Route path="/student-dashboard" element={<Student_profile />} />
          <Route path="/mentor-dashboard" element={<Mentor_profile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
