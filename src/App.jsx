import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { me } from "./Redux/Slices/authSlice"
import RegistrationPage from './Pages/RegistrationPage';
import LoginPage from "./Pages/LoginPage"
import HomePage from './Pages/HomePage';
import ServicePage from './Pages/ServicePage';
import PreferenceSelection from './Pages/PreferencePage';
import ChooseRolePage from "./Pages/ChooseRolePage";
import ChatAndRTCPage from './Pages/ChatAndRTCPage';
import VictimProfilePage from "./Pages/VictimProfilePage"
import SupportProfilePage from "./Pages/SupportProfilePage"
import SupportApply from "./Pages/SupportApplyPage"
import ReportForm from './Pages/ReportForm';
import VictimReport from "./Pages/VictimReport";
import ResourcePage from "./Pages/ResourcePage";
import NotFoundPage from './Components/404';
import LoadingPage from './Components/Loading';
import EmergencyContactsPage from './Pages/Emergency';
import SupporterProfilePage from "./Pages/supporterprofilePage"
import ReportOnVolunteer from "./Pages/ReportOnVolunteer"

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token'); // Retrieve token from localStorage


  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

function GuestRoute({ children }) {
 
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  if (token) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && token) { 
      dispatch(me(token)); // Dispatch the me action with the token
    }
  }, [token,user, dispatch]);

  console.log("User from Redux:", user);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/emergency" element={<EmergencyContactsPage />} />
           <Route path="/resource" element={<ResourcePage />} />
          <Route path="/supporterProfile" element={<SupporterProfilePage />} />
          <Route path="/reportOnVolunteer" element={<ReportOnVolunteer />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegistrationPage /></GuestRoute>} />

          <Route path="/role" element={<GuestRoute allowedRoles={['guest']}><ChooseRolePage /></GuestRoute>} />
          <Route path="/services" element={<ProtectedRoute allowedRoles={['client']}><ServicePage /></ProtectedRoute>} />
          <Route path="/preferences" element={<ProtectedRoute allowedRoles={['client']}><PreferenceSelection /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute allowedRoles={['client', 'support']}><ChatAndRTCPage /></ProtectedRoute>} />
          <Route path="/victimProfile" element={<ProtectedRoute allowedRoles={['client']}><VictimProfilePage /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute allowedRoles={['client']}><ReportForm /></ProtectedRoute>} />
          <Route path="/victimReport" element={<ProtectedRoute allowedRoles={['client']}><VictimReport /></ProtectedRoute>} />
          <Route path="/supportProfile" element={<ProtectedRoute allowedRoles={['support']}><SupportProfilePage /></ProtectedRoute>} />
          <Route path="/supportApply" element={<ProtectedRoute allowedRoles={['support']}><SupportApply /></ProtectedRoute>} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
