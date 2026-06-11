import { Link } from 'react-router-dom';
import { Briefcase, Users, LineChart } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
        Streamline your <span className="text-primary">Campus Placements</span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-[800px] mb-12 leading-relaxed">
        CampusConnect bridges the gap between students, recruiters, and placement officers.
        Manage jobs, track applications, and schedule interviews all in one place.
      </p>
      <div className="flex gap-4 mb-24">
        <Link
          to="/register"
          className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium text-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-medium text-lg hover:bg-secondary/80 transition-all"
        >
          Login
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl text-left">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-primary">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">For Students</h3>
          <p className="text-muted-foreground">Build your profile, browse top opportunities, and track your applications seamlessly.</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-primary">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">For Recruiters</h3>
          <p className="text-muted-foreground">Post jobs, filter candidates effectively, and schedule interviews with top talent.</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-primary">
            <LineChart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">For Placement Officers</h3>
          <p className="text-muted-foreground">Verify profiles, manage recruiters, and generate deep analytics and placement reports.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
