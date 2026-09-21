import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Student_LoginComponent from "./components/Student_LoginComponent";
import Admin_LoginComponent from "./components/Admin_LoginComponent";
import Mentor_LoginComponent from "./components/Mentor_LoginComponent";
import RegisterComponent from "./components/RegisterComponent";
import Admin_ProfileUpdateComponent from "./components/Admin_ProfileUpdateComponent";
import Student_ProfileUpdateComponent from "./components/Student_ProfileUpdateComponent";
import Mentor_ProfileUpdateComponent from "./components/Mentor_ProfileUpdateComponent";
import Admin_profile from "./pages/admin_dashboard/Admin_profile";
import Student_profile from "./pages/student_dashboard/Student_profile";
import Mentor_profile from "./pages/mentor_dashboard/Mentor_profile";

import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Student_LoginComponent />} />
          <Route path="/admin-login" element={<Admin_LoginComponent />} />
          <Route path="/mentor-login" element={<Mentor_LoginComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route
            path="/admin/profile/update/:id"
            element={<Admin_ProfileUpdateComponent />}
          />
          <Route
            path="/student/profile/update/:id"
            element={<Student_ProfileUpdateComponent />}
          />
          <Route
            path="/mentor/profile/update/:id"
            element={<Mentor_ProfileUpdateComponent />}
          />
          <Route path="/admin-dashboard" element={<Admin_profile />} />
          <Route path="/student-dashboard" element={<Student_profile />} />
          <Route path="/mentor-dashboard" element={<Mentor_profile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
