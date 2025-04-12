// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ManagerMainPage from "./pages/manager/MainPage";

import Layout from "./components/custom/Layout";

import GroupsPage from "./pages/manager/GroupsPage";
import GroupForm from "./pages/manager/GroupForm";

import TimeSlotsPage from "./pages/manager/TimeSlotsPage";
import TimeSlotForm from "./pages/manager/TimeSlotForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />} path="manager">
          <Route path="groups/new" element={<GroupForm isEdit={false} />} />
          <Route path="groups/:id/edit" element={<GroupForm isEdit={true} />} />
          <Route path="groups" element={<GroupsPage />} />

          <Route
            path="timeslots/new"
            element={<TimeSlotForm isEdit={false} />}
          />
          <Route
            path="timeslots/:id/edit"
            element={<TimeSlotForm isEdit={true} />}
          />
          <Route path="timeslots" element={<TimeSlotsPage />} />

          <Route path="" element={<ManagerMainPage />} />
        </Route>

        <Route elemetn={<Layout />} path="/user"></Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
