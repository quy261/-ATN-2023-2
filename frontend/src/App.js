import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

import Homepage from "./pages/Homepage";
import LogedinDashboard from "./pages/admin/LogedinDashboard";
import LoginPage from "./pages/LoginPage";
import ChooseUser from "./pages/ChooseUser";

const App = () => {
  const { currentRole } = useSelector(state => state.user);

  return (
    <Router>
      {currentRole == null ? (
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/choose" element={<ChooseUser />} />
          <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
          <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
          <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <LogedinDashboard />
      )}
    </Router>
  );
};

export default App;
