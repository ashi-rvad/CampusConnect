import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { FileText } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const ResumeGenerator = ({ profile }) => {
    const { user } = useSelector(state => state.auth);
    const resumeRef = useRef();

    const generatePDF = () => {
        const element = resumeRef.current;
        
        // Un-hide it for rendering
        element.style.display = 'block';

        const opt = {
            margin: 10,
            filename: `${profile.firstName}_${profile.lastName}_Resume.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            // Hide it again
            element.style.display = 'none';
        });
    };

    return (
        <>
            <button 
                type="button" 
                onClick={generatePDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
                <FileText size={18} />
                Generate Auto-Resume
            </button>

            {/* Hidden Resume Template */}
            <div 
                ref={resumeRef} 
                style={{ display: 'none', width: '210mm', minHeight: '297mm', padding: '20mm', backgroundColor: 'white', color: 'black', fontFamily: 'Arial, sans-serif' }}
            >
                <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: '10px', marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#1e3a8a' }}>
                        {profile.firstName || user?.firstName} {profile.lastName || user?.lastName}
                    </h1>
                    <p style={{ fontSize: '14px', margin: '5px 0 0 0', color: '#4b5563' }}>
                        Email: {user?.email} | Phone: {profile.phone || 'N/A'}
                    </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '5px', marginBottom: '10px', color: '#1e3a8a' }}>
                        EDUCATION
                    </h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 'bold' }}>{profile.academicDetails?.branch || 'Undergraduate Degree'}</span>
                        <span style={{ color: '#4b5563' }}>Graduation Year: {profile.academicDetails?.graduationYear || 'N/A'}</span>
                    </div>
                    <p style={{ margin: 0, color: '#4b5563' }}>
                        CGPA: <strong>{profile.academicDetails?.cgpa || 'N/A'}</strong>
                    </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '5px', marginBottom: '10px', color: '#1e3a8a' }}>
                        SKILLS
                    </h2>
                    <p style={{ margin: 0, lineHeight: '1.6' }}>
                        {profile.skills || 'No skills added yet.'}
                    </p>
                </div>

                <div style={{ marginTop: '50px', fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
                    <p>Generated automatically via CampusConnect</p>
                </div>
            </div>
        </>
    );
};

export default ResumeGenerator;
