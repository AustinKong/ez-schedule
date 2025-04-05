// src/App.jsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ManagerMainPage from './pages/manager/MainPage';
import GroupFormPage from './pages/manager/GroupFormPage';
import QueuePage from './pages/manager/QueuePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/manager" element={<ManagerMainPage />} />
                <Route path="/manager/group/create" element={<GroupFormPage />} />
                <Route path="/manager/group/edit/:id" element={<GroupFormPage />} />
                <Route path="/manager/queue/:id" element={<QueuePage />} />
                <Route path="/" element={<LoginPage />} />
            </Routes>
        </Router>
    );
}

export default App;
