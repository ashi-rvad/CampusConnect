import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import api from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'Student', companyId: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center my-8">
      <div className="w-full max-w-md bg-card p-8 rounded-xl border border-border shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full text-primary mb-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Create an account</h2>
          <p className="text-muted-foreground text-sm mt-1">Join CampusConnect today</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
              <input type="text" required className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-primary/50" 
                value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
              <input type="text" required className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-primary/50"
                value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input type="email" required className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-primary/50"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input type="password" required minLength={6} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-primary/50"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">I am a</label>
            <select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-primary/50"
              value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="Student">Student</option>
              <option value="Recruiter">Recruiter</option>
              <option value="PlacementOfficer">Placement Officer</option>
            </select>
          </div>
          
          {formData.role === 'Recruiter' && (
             <div>
               <label className="block text-sm font-medium text-foreground mb-1">Company ID</label>
               <input type="text" required className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-primary/50"
                 value={formData.companyId} onChange={(e) => setFormData({...formData, companyId: e.target.value})} />
             </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium mt-4 hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
