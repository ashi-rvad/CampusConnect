import { useState, useEffect } from 'react';
import api from '../../services/api';
import { UploadCloud, CheckCircle } from 'lucide-react';
import ResumeGenerator from '../../components/ResumeGenerator';

const ProfileBuilder = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    academicDetails: { cgpa: '', branch: '', graduationYear: '' },
    skills: '',
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/students/profile');
        const data = res.data.data;
        if (data) {
          setProfile({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            phone: data.phone || '',
            academicDetails: data.academicDetails || { cgpa: '', branch: '', graduationYear: '' },
            skills: data.skills ? data.skills.join(', ') : '',
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append('firstName', profile.firstName);
    formData.append('lastName', profile.lastName);
    formData.append('phone', profile.phone);
    formData.append('academicDetails', JSON.stringify(profile.academicDetails));
    
    const skillsArray = profile.skills.split(',').map(s => s.trim()).filter(Boolean);
    formData.append('skills', JSON.stringify(skillsArray));

    if (resume) {
      formData.append('resume', resume);
    }

    try {
      await api.put('/students/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Profile Builder</h2>
        <p className="text-muted-foreground mt-1">Complete your profile to stand out to recruiters.</p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
              <input type="text" className="w-full px-3 py-2 bg-background border border-border rounded-md" 
                value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
              <input type="text" className="w-full px-3 py-2 bg-background border border-border rounded-md" 
                value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Branch</label>
              <input type="text" className="w-full px-3 py-2 bg-background border border-border rounded-md" placeholder="e.g. CSE"
                value={profile.academicDetails.branch} onChange={e => setProfile({...profile, academicDetails: {...profile.academicDetails, branch: e.target.value}})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">CGPA</label>
              <input type="number" step="0.01" className="w-full px-3 py-2 bg-background border border-border rounded-md" 
                value={profile.academicDetails.cgpa} onChange={e => setProfile({...profile, academicDetails: {...profile.academicDetails, cgpa: e.target.value}})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Graduation Year</label>
              <input type="number" className="w-full px-3 py-2 bg-background border border-border rounded-md" 
                value={profile.academicDetails.graduationYear} onChange={e => setProfile({...profile, academicDetails: {...profile.academicDetails, graduationYear: e.target.value}})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Skills (Comma separated)</label>
            <input type="text" className="w-full px-3 py-2 bg-background border border-border rounded-md" placeholder="React, Node, Python, C++"
              value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Resume (PDF)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md hover:border-primary/50 transition-colors">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="flex text-sm text-muted-foreground justify-center mt-2">
                  <label className="relative cursor-pointer bg-background rounded-md font-medium text-primary hover:underline">
                    <span>Upload a file</span>
                    <input type="file" className="sr-only" accept=".pdf" onChange={e => setResume(e.target.files[0])} />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{resume ? resume.name : 'PDF up to 5MB'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <button type="submit" disabled={loading} className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
            <ResumeGenerator profile={profile} />
            {success && <div className="flex items-center gap-2 text-green-600 text-sm font-medium"><CheckCircle className="w-4 h-4"/> Saved Successfully</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileBuilder;
