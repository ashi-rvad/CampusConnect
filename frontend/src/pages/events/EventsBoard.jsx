import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, MapPin, Users, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

const EventsBoard = () => {
    const { user } = useSelector(state => state.auth);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        type: 'Workshop',
        location: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data.data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowCreateModal(false);
            setFormData({ title: '', description: '', date: '', type: 'Workshop', location: '' });
            fetchEvents();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create event');
        }
    };

    const handleRegister = async (eventId) => {
        try {
            await api.post(`/events/${eventId}/register`);
            alert('Successfully registered!');
            fetchEvents();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to register');
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${eventId}`);
                fetchEvents();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete event');
            }
        }
    };

    if (loading) return <div className="text-center mt-10">Loading events...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
                    <p className="text-gray-600 mt-2">Discover and register for upcoming workshops, hackathons, and seminars.</p>
                </div>
                {user?.role === 'PlacementOfficer' && (
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center hover:bg-primary/90 transition-colors"
                    >
                        <Plus size={20} className="mr-2" />
                        Create Event
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => {
                    const isRegistered = event.attendees?.includes(user?._id);
                    const eventDate = new Date(event.date);
                    const isPast = eventDate < new Date();

                    return (
                        <div key={event._id} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${isPast ? 'opacity-70' : ''}`}>
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    {event.type}
                                </span>
                                {user?.role === 'PlacementOfficer' && (
                                    <button onClick={() => handleDelete(event._id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                            
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar size={16} className="mr-2 text-primary" />
                                    {eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <MapPin size={16} className="mr-2 text-primary" />
                                    {event.location}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Users size={16} className="mr-2 text-primary" />
                                    {event.attendees?.length || 0} registered
                                </div>
                            </div>

                            {user?.role === 'Student' && !isPast && (
                                <button 
                                    onClick={() => handleRegister(event._id)}
                                    disabled={isRegistered}
                                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                                        isRegistered 
                                            ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    }`}
                                >
                                    {isRegistered ? 'Registered' : 'Register Now'}
                                </button>
                            )}
                            {isPast && (
                                <div className="w-full py-2 text-center text-gray-500 bg-gray-100 rounded-lg font-medium text-sm">
                                    Event Ended
                                </div>
                            )}
                        </div>
                    );
                })}
                {events.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No upcoming events found.
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                        <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea required rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent">
                                        <option value="Workshop">Workshop</option>
                                        <option value="Hackathon">Hackathon</option>
                                        <option value="Seminar">Seminar</option>
                                        <option value="Pre-Placement Talk">Pre-Placement Talk</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                                    <input type="datetime-local" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g., Main Auditorium or Zoom Link" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">Create Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsBoard;
