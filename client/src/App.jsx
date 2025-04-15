import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Layout from "./components/custom/Layout";

// Manager routes
import GroupsPage from "./pages/manager/GroupsPage";
import GroupForm from "./pages/manager/GroupForm";
import ManagerTimeSlotsPage from "./pages/manager/TimeSlotsPage";
import TimeSlotForm from "./pages/manager/TimeSlotForm";
import QueuePage from "./pages/manager/QueuePage";
import ShareGroupsPage from "./pages/manager/ShareGroupsPage";

// User routes
import UserGroupPage from "./pages/user/GroupPage";
import UserGroupsPage from "./pages/user/GroupsPage";
import JoinGroupsPage from "./pages/user/JoinGroupsPage";
import Timetable from "./pages/user/TimeTable";
import TimeSlotsPage from "./pages/user/TimeSlotsUserPage";
import TimeSlotUserDetailsPage from "./pages/user/TimeslotUserDetailsPage";
import PreConsultationForm from "./pages/user/PreConsultationForm";
import ConsultationConfirmation from "./pages/user/ConsultationConfirmation";
import SubmissionsListPage from './pages/user/SubmissionsListPage';
import SubmissionDetailsPage from './pages/user/SubmissionDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Manager Routes */}
        <Route element={<Layout />} path="manager">
          <Route path="groups/new" element={<GroupForm isEdit={false} />} />
          <Route path="groups/:id/edit" element={<GroupForm isEdit={true} />} />
          <Route path="groups/:id/share" element={<ShareGroupsPage />} />
          <Route path="groups" element={<GroupsPage />} />

          <Route path="timeslots/new" element={<TimeSlotForm isEdit={false} />} />
          <Route path="timeslots/:id" element={<QueuePage />} />
          <Route path="timeslots/:id/edit" element={<TimeSlotForm isEdit={true} />} />
          <Route path="timeslots" element={<ManagerTimeSlotsPage />} />
        </Route>

        {/* User Routes */}
        <Route element={<Layout />} path="user">
          <Route path="groups" element={<UserGroupsPage />} />
          <Route path="groups/:id" element={<UserGroupPage />} />
          <Route path="groups/:id/join" element={<JoinGroupsPage />} />
          
          {/* Timeslot Routes */}
          <Route path="timeslots" element={<TimeSlotsPage />} />
          <Route path="timeslots/:slotId" element={<TimeSlotUserDetailsPage />} />
          <Route path="timeslots/:slotId/preconsultation" element={<PreConsultationForm />} />
          <Route path="timeslots/:slotId/confirmation" element={<ConsultationConfirmation />} />
          <Route path="submissions" element={<SubmissionsListPage />} />
          <Route path="submissions/:id" element={<SubmissionDetailsPage />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="" element={<></>} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;