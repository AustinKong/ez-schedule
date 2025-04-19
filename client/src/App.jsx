import LandingPage from "./pages/auth/LandingPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ForgetPasswordPage from './pages/auth/ForgetPasswordPage';
import Layout from './components/custom/Layout';
import ProfilePage from './pages/user/ProfilePage';
import UserProfilePage from './pages/user/UserProfilePage';

// Manager routes
import GroupsPage from "./pages/manager/GroupsPage";
import GroupForm from "./pages/manager/GroupForm";
import ManagerTimeSlotsPage from "./pages/manager/TimeSlotsPage";
import TimeSlotForm from "./pages/manager/TimeSlotForm";
import ManagerQueuePage from "./pages/manager/QueuePage";
import ShareGroupsPage from "./pages/manager/ShareGroupsPage";
import ManagerNotificationsPage from "./pages/manager/ManagerNotificationsPage";
import ManagerGroupPage from "./pages/manager/GroupPage";

// User routes
import UserGroupPage from "./pages/user/GroupPage";
import UserGroupsPage from "./pages/user/GroupsPage";
import JoinGroupsPage from "./pages/user/JoinGroupsPage";
import PreconsultFormPage from "./pages/user/PreconsultForm";
import Timetable from "./pages/user/TimeTable";
import TimeSlotsPage from "./pages/user/TimeSlotsUserPage";
import TimeSlotUserDetailsPage from "./pages/user/TimeslotUserDetailsPage";
import ConsultationConfirmation from "./pages/user/ConsultationConfirmation";
import SubmissionsListPage from "./pages/user/SubmissionsListPage";
import SubmissionDetailsPage from "./pages/user/SubmissionDetailsPage";
import UserQueuePage from "./pages/user/QueuePage";
import UserNotificationsPage from "./pages/user/UserNotificationsPage";


function App() {
  return (
    <Router>
      <Routes>
        {/* Manager Routes */}
        <Route element={<Layout />} path="manager">
          <Route path="groups/new" element={<GroupForm isEdit={false} />} />
          <Route path="groups/:id" element={<ManagerGroupPage />} />
          <Route path="groups/:id/edit" element={<GroupForm isEdit={true} />} />
          <Route path="groups/:id/share" element={<ShareGroupsPage />} />
          <Route path="groups" element={<GroupsPage />} />
          
          <Route
            path="timeslots/new"
            element={<TimeSlotForm isEdit={false} />}
          />
          <Route path="timeslots/:id" element={<ManagerQueuePage />} />
          <Route
            path="timeslots/:id/edit"
            element={<TimeSlotForm isEdit={true} />}
          />
          <Route path="timeslots" element={<ManagerTimeSlotsPage />} />
          <Route path="notifications" element={<ManagerNotificationsPage />} />
        </Route>

				{/* User Routes */}
				<Route
					element={<Layout />}
					path='user'>
					<Route
						path='groups'
						element={<UserGroupsPage />}
					/>
					<Route
						path='groups/:id'
						element={<UserGroupPage />}
					/>
					<Route
						path='groups/:id/join'
						element={<JoinGroupsPage />}
					/>
					<Route
						path='preconsultForm/new'
						element={<PreconsultFormPage />}
					/>
					{/* Timeslot Routes */}
					<Route
						path='timeslots'
						element={<TimeSlotsPage />}
					/>
					<Route
						path='/user/timeslots/:id/queue'
						element={<UserQueuePage />}
					/>
					<Route
						path='timeslots/all'
						element={<Timetable />}
					/>
					<Route
						path='timeslots/:id'
						element={<TimeSlotUserDetailsPage />}
					/>
					<Route
						path='timeslots/:slotId/preconsultation'
						element={<PreconsultFormPage />}
					/>
					<Route
						path='timeslots/:slotId/confirmation'
						element={<ConsultationConfirmation />}
					/>
					<Route
						path='submissions'
						element={<SubmissionsListPage />}
					/>
					<Route
						path='submissions/:id'
						element={<SubmissionDetailsPage />}
					/>
					<Route
						path='notifications'
						element={<UserNotificationsPage />}
					/>
					<Route
						path='profile'
						element={<ProfilePage />}
					/>
					{/* <Route path="timetable" element={<Timetable />} /> */}
					<Route
						path=''
						element={<></>}
					/>
				</Route>

				{/* Public User Profile Route */}
				<Route
					path='/users/:id'
					element={<UserProfilePage />}
				/>

				{/* Auth Routes */}
				<Route
					path='/login'
					element={<LoginPage />}
				/>
				<Route
					path='/register'
					element={<RegisterPage />}
				/>
				<Route
					path='/reset-password'
					element={<ResetPasswordPage />}
				/>
				<Route
					path='/forget-password'
					element={<ForgetPasswordPage />}
				/>
				<Route
					path='/'
					element={<LandingPage />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
