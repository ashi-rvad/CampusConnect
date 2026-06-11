import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Briefcase } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="border-b bg-background shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Briefcase className="h-6 w-6" />
          <span>CampusConnect</span>
        </Link>
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              {user?.role === 'Student' && (
                <>
                  <Link to="/jobs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    Find Jobs
                  </Link>
                  <Link to="/profile" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    My Profile
                  </Link>
                </>
              )}
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <div className="text-sm font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                {user?.role}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors border border-destructive/20 px-4 py-1.5 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
