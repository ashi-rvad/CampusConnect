import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Building2, Globe, Star, MessageSquare } from 'lucide-react';
import api from '../../services/api';

const Companies = () => {
    const { user } = useSelector(state => state.auth);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Review form state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [formData, setFormData] = useState({
        rating: 5,
        comment: '',
        isAnonymous: false
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/companies');
            setCompanies(response.data.data);
        } catch (error) {
            console.error('Failed to fetch companies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCompany = async (company) => {
        setSelectedCompany(company);
        setShowReviewForm(false);
        try {
            const response = await api.get(`/reviews/company/${company._id}`);
            setReviews(response.data.data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reviews', {
                companyId: selectedCompany._id,
                ...formData
            });
            alert('Review submitted successfully!');
            setShowReviewForm(false);
            setFormData({ rating: 5, comment: '', isAnonymous: false });
            // Refresh reviews
            handleSelectCompany(selectedCompany);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading companies...</div>;

    return (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Left side: Company List */}
            <div className="w-full md:w-1/3 space-y-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Companies</h1>
                {companies.map((company) => (
                    <div 
                        key={company._id} 
                        onClick={() => handleSelectCompany(company)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedCompany?._id === company._id ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                    >
                        <div className="flex items-center gap-4">
                            {company.logo ? (
                                <img src={company.logo} alt={company.name} className="w-12 h-12 rounded-lg object-contain bg-white" />
                            ) : (
                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Building2 size={24} className="text-gray-400" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-gray-900">{company.name}</h3>
                                <p className="text-sm text-gray-500">{company.industry}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right side: Selected Company & Reviews */}
            <div className="w-full md:w-2/3">
                {selectedCompany ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                {selectedCompany.logo ? (
                                    <img src={selectedCompany.logo} alt={selectedCompany.name} className="w-20 h-20 rounded-xl object-contain bg-white border" />
                                ) : (
                                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center">
                                        <Building2 size={40} className="text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">{selectedCompany.name}</h2>
                                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                                        <span className="flex items-center"><Building2 size={16} className="mr-1" /> {selectedCompany.industry}</span>
                                        {selectedCompany.website && (
                                            <a href={selectedCompany.website} target="_blank" rel="noreferrer" className="flex items-center text-primary hover:underline">
                                                <Globe size={16} className="mr-1" /> Website
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {user?.role === 'Student' && (
                                <button 
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
                                >
                                    <MessageSquare size={18} className="mr-2" />
                                    Write a Review
                                </button>
                            )}
                        </div>

                        <p className="text-gray-700 mb-8 pb-8 border-b border-gray-100">{selectedCompany.description}</p>

                        {/* Review Form */}
                        {showReviewForm && (
                            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-lg mb-4">Rate & Review {selectedCompany.name}</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button 
                                                type="button" 
                                                key={star}
                                                onClick={() => setFormData({...formData, rating: star})}
                                                className={`p-1 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                            >
                                                <Star size={28} fill="currentColor" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                                    <textarea 
                                        required 
                                        rows="4" 
                                        value={formData.comment} 
                                        onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="What was your interview process or work experience like?"
                                    ></textarea>
                                </div>
                                <div className="flex items-center mb-6">
                                    <input 
                                        type="checkbox" 
                                        id="anonymous" 
                                        checked={formData.isAnonymous}
                                        onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                                        className="h-4 w-4 text-primary rounded border-gray-300"
                                    />
                                    <label htmlFor="anonymous" className="ml-2 text-sm text-gray-600">Post review anonymously</label>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowReviewForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">Submit Review</button>
                                </div>
                            </form>
                        )}

                        {/* Reviews List */}
                        <div className="space-y-6">
                            <h3 className="font-bold text-xl mb-4">Student Reviews ({reviews.length})</h3>
                            {reviews.length === 0 ? (
                                <p className="text-gray-500 italic">No reviews yet for this company. Be the first to review!</p>
                            ) : (
                                reviews.map(review => (
                                    <div key={review._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                {review.studentId.profilePicture ? (
                                                    <img src={review.studentId.profilePicture} alt="User" className="w-10 h-10 rounded-full" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {review.studentId.firstName[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900">{review.studentId.firstName} {review.studentId.lastName}</p>
                                                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex text-yellow-400">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} size={16} fill="currentColor" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl p-12">
                        <Building2 size={64} className="mb-4 opacity-50" />
                        <h2 className="text-2xl font-medium mb-2">Select a Company</h2>
                        <p>Choose a company from the list to view details and read student reviews.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Companies;
