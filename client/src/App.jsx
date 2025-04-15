// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import Layout from "./components/custom/Layout";

import GroupsPage from "./pages/manager/GroupsPage";
import GroupForm from "./pages/manager/GroupForm";

import ManagerTimeSlotsPage from "./pages/manager/TimeSlotsPage";
import TimeSlotForm from "./pages/manager/TimeSlotForm";
import QueuePage from "./pages/manager/QueuePage";
import ShareGroupsPage from "./pages/manager/ShareGroupsPage";

import UserGroupPage from "./pages/user/GroupPage";
import UserGroupsPage from "./pages/user/GroupsPage";
import JoinGroupsPage from "./pages/user/JoinGroupsPage";
import Timetable from "./pages/user/TimeTable";
import TimeSlotsPage from "./pages/user/TimeSlotsUserPage";
import TimeSlotUserDetailsPage from "./pages/user/TimeslotUserDetailsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />} path="manager">
          <Route path="groups/new" element={<GroupForm isEdit={false} />} />
          <Route path="groups/:id/edit" element={<GroupForm isEdit={true} />} />
          <Route path="groups/:id/share" element={<ShareGroupsPage />} />
          <Route path="groups" element={<GroupsPage />} />

          <Route
            path="timeslots/new"
            element={<TimeSlotForm isEdit={false} />}
          />
          <Route path="timeslots/:id" element={<QueuePage />} />
          <Route
            path="timeslots/:id/edit"
            element={<TimeSlotForm isEdit={true} />}
          />
          <Route path="timeslots" element={<ManagerTimeSlotsPage />} />
        </Route>

        <Route element={<Layout />} path="user">
          <Route path="groups" element={<UserGroupsPage />} />
          <Route path="groups/:id" element={<UserGroupPage />} />
          <Route path="groups/:id/join" element={<JoinGroupsPage />} />
          <Route path="timeslots" element={<TimeSlotsPage />} />
          <Route path="timeslots/details" element={<TimeSlotUserDetailsPage />} />


          <Route path="" element={<></>} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;