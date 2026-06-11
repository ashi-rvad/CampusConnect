import { useEffect, useState } from 'react';
import { Briefcase, MapPin, DollarSign, Search } from 'lucide-react';
import api from '../../services/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        setJobs(res.data.data);
      } catch (err) {
        console.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      await api.post(`/applications/job/${jobId}`);
      alert('Successfully applied for the job!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Available Jobs</h2>
          <p className="text-muted-foreground mt-1">Browse and apply to the latest opportunities.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="w-full pl-9 pr-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="animate-pulse h-32 bg-muted rounded-xl"></div>)}
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.length > 0 ? jobs.map(job => (
            <div key={job._id} className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {job.companyId?.logo ? (
                  <img src={job.companyId.logo} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Briefcase className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                  <div className="text-primary font-medium">{job.companyId?.name}</div>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</div>
                    <div className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job.salary?.min} - {job.salary?.max}</div>
                    <div className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs">{job.role}</div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleApply(job._id)}
                className="w-full md:w-auto bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Apply Now
              </button>
            </div>
          )) : (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground">No jobs available right now.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Jobs;
