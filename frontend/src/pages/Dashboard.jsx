import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import StudentDashboard from './student/StudentDashboard';
import RecruiterDashboard from './recruiter/RecruiterDashboard';
import PODashboard from './po/PODashboard';

const Dashboard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'Student') {
    return <StudentDashboard />;
  } else if (user?.role === 'Recruiter') {
    return <RecruiterDashboard />;
  } else if (user?.role === 'PlacementOfficer') {
    return <PODashboard />;
  } else if (user?.role === 'Admin') {
    return <div className="p-8"><h2 className="text-2xl font-bold">Admin Dashboard (Coming Soon)</h2></div>;
  }

  return <div>Unknown Role</div>;
};

export default Dashboard;
