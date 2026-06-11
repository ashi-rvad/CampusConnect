import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/student/Jobs';
import ProfileBuilder from './pages/student/ProfileBuilder';
import EventsBoard from './pages/events/EventsBoard';
import Companies from './pages/student/Companies';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import socket from './services/socket';

function App() {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      socket.connect();
      socket.emit('join_user_room', user._id);
    } else {
      socket.disconnect();
    }
    return () => socket.disconnect();
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/profile" element={<ProfileBuilder />} />
          <Route path="/events" element={<EventsBoard />} />
          <Route path="/companies" element={<Companies />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
