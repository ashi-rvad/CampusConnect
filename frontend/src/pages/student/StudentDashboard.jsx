import { useEffect, useState } from 'react';
import { Briefcase, FileText, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, appsRes] = await Promise.all([
          api.get('/students/profile'),
          api.get('/applications/student')
        ]);
        setProfile(profileRes.data.data);
        setApplications(appsRes.data.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-10 bg-muted rounded w-1/4"></div>
      <div className="grid grid-cols-4 gap-4"><div className="h-24 bg-muted rounded"></div></div>
    </div>;
  }

  const activeApps = applications.filter(a => ['Applied', 'Shortlisted', 'Interview_Scheduled'].includes(a.status)).length;
  const interviews = applications.filter(a => a.status === 'Interview_Scheduled').length;
  const selected = applications.filter(a => a.status === 'Selected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Welcome, {profile?.firstName || 'Student'}!</h2>
          <p className="text-muted-foreground mt-1">Profile Completion: {profile?.profileCompletionPercentage || 0}%</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary"><Briefcase className="w-6 h-6" /></div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Total Applications</div>
            <div className="text-2xl font-bold">{applications.length}</div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-secondary p-3 rounded-full text-secondary-foreground"><Clock className="w-6 h-6" /></div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Active</div>
            <div className="text-2xl font-bold">{activeApps}</div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-accent p-3 rounded-full text-accent-foreground"><FileText className="w-6 h-6" /></div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Interviews</div>
            <div className="text-2xl font-bold">{interviews}</div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Offers</div>
            <div className="text-2xl font-bold">{selected}</div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.slice(0, 5).map((app) => (
              <div key={app._id} className="flex justify-between items-center p-4 bg-background border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  {app.jobId?.companyId?.logo ? (
                    <img src={app.jobId.companyId.logo} alt="Company Logo" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-foreground">{app.jobId?.title}</h4>
                    <p className="text-sm text-muted-foreground">{app.jobId?.companyId?.name}</p>
                  </div>
                </div>
                <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
                  {app.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">You haven't applied to any jobs yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
