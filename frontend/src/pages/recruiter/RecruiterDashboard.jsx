import { useEffect, useState } from 'react';
import { Users, Briefcase, Plus, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        // Note: For production, there should be a /jobs/recruiter endpoint to fetch ONLY this recruiter's jobs
        setJobs(res.data.data);
      } catch (err) {
        console.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div className="animate-pulse h-32 bg-muted rounded-xl"></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Recruiter Dashboard</h2>
          <p className="text-muted-foreground mt-1">Manage your job postings and applicants.</p>
        </div>
        <Link to="/jobs/new" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5" />
          Post New Job
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary"><Briefcase className="w-6 h-6" /></div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Active Jobs</div>
            <div className="text-2xl font-bold">{jobs.filter(j => j.status === 'Open').length}</div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-accent p-3 rounded-full text-accent-foreground"><Users className="w-6 h-6" /></div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Total Applicants</div>
            <div className="text-2xl font-bold">--</div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Interviews Scheduled</div>
            <div className="text-2xl font-bold">--</div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Your Recent Postings</h3>
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="flex justify-between items-center p-4 bg-background border border-border rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground text-lg">{job.title}</h4>
                  <p className="text-sm text-muted-foreground">{job.location} • {job.role}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {job.status}
                  </span>
                  <Link to={`/jobs/${job._id}/applicants`} className="text-sm text-primary hover:underline font-medium">
                    View Applicants
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">You haven't posted any jobs yet.</p>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
