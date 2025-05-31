    import React, { useState, useEffect } from "react";
    import { LuPlus } from "react-icons/lu";
    import { CARD_BG } from "../../utils/data";
    import { toast } from "react-hot-toast";  
    import DashboardLayout from "../../components/Layout/DashboardLayout";
    import { useNavigate } from "react-router-dom";
    import { API_PATHS } from "../../utils/apiPaths";
    import axiosInstance from "../../utils/axiosInstance";
    import SummaryCard from "../../components/Cards/SummaryCard";
    import Modal from "../../components/Loader/Modal";
    import CreateSessionForm from "./CreateSessionForm";

    const Dashboard = () => {
        const navigate = useNavigate();
        const [openCreateModal, setOpenCreateModal] = useState(false);
        const [openDeleteAlert, setOpenDeleteAlert] = useState(null);
        const [sessions, setSessions] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [refreshTrigger, setRefreshTrigger] = useState(0);

        const fetchAllSessions = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
                
                // Validate response structure
                if (response?.data) {
                    console.log('Sessions response:', response.data); // Debug log
                    setSessions(Array.isArray(response.data) ? response.data : 
                            (Array.isArray(response.data.sessions) ? response.data.sessions : []));
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (error) {
                console.error('Error fetching sessions:', error);
                const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch sessions. Please try again later.';
                setError(errorMessage);
                toast.error(errorMessage);
                setSessions([]);
            } finally {
                setLoading(false);
            }
        };

        const handleDeleteSession = async (sessionId) => {
            try {
                setLoading(true);
                await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionId));
                setSessions(prev => prev.filter(session => session._id !== sessionId));
                toast.success("Session deleted successfully");
                setOpenDeleteAlert(null);
            } catch (error) {
                console.error('Error deleting session:', error);
                const errorMessage = error?.response?.data?.message || "Failed to delete session";
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        
        const handleCreateSession = async (sessionData) => {
            // This function is passed to CreateSessionForm but now CreateSessionForm 
            // handles session creation internally - this is kept for backward compatibility
            setRefreshTrigger(prev => prev + 1);
            setOpenCreateModal(false);
            return true;
        };
        
        useEffect(() => {
            fetchAllSessions();
        }, [refreshTrigger]);

        const renderEmptyState = () => (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">No Interview Sessions Yet</h3>
                    <p className="text-gray-600">Create your first interview session to get started!</p>
                </div>
                <button 
                    onClick={() => setOpenCreateModal(true)}
                    className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-200"
                >
                    <span className="flex items-center gap-2">
                        <LuPlus className="text-xl"/>
                        Create Session
                    </span>
                </button>
            </div>
        );

        // In Dashboard.jsx
// In Dashboard.jsx
const renderSessionGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-6 pb-6">
      {sessions.map((session, index) => {
        // Ensure session data exists before rendering
        if (!session) return null;
        
        return (
          <SummaryCard
            key={session._id || `session-${index}`}
            colors={CARD_BG[index % CARD_BG.length].bgcolor}
            role={session.role || "No Role Specified"} // Fallback text
            topicsToFocus={session.topicToFocus || session.topicsToFocus || "General Preparation"} 
            experience={session.experience || "Not specified"}
            questions={Array.isArray(session.questions) ? session.questions.length : 0}
            description={session.description || "Click to add details"}
            lastUpdated={session.updatedAt || session.createdAt} // Fallback to createdAt
            onSelect={() => session._id && navigate(`/interview-prep/${session._id}`)}
            onDelete={() => setOpenDeleteAlert({ 
              sessionId: session._id,
              sessionName: session.role || "this session" 
            })}
          />
        );
      })}
    </div>
  );

        const renderContent = () => {
            if (loading && sessions.length === 0) {
                return (
                    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                );
            }

            if (error && sessions.length === 0) {
                return (
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button 
                            onClick={fetchAllSessions}
                            className="text-orange-600 hover:text-orange-700 font-medium px-4 py-2 border border-orange-300 rounded-lg"
                        >
                            Try Again
                        </button>
                    </div>
                );
            }

            if (!sessions || sessions.length === 0) {
                return renderEmptyState();
            }

            return renderSessionGrid();
        };

        return ( 
            <DashboardLayout>
                <div className="container mx-auto px-4 pb-4">
                    {/* Loading overlay shown when operations in progress with existing data */}
                    {loading && sessions.length > 0 && (
                        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
                            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
                                <div className="w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                <span>Loading...</span>
                            </div>
                        </div>
                    )}

                    {/* Session Grid */}
                    {renderContent()}

                    {/* Add New Button - Only show if there are existing sessions */}
                    {sessions && sessions.length > 0 && (
                        <button 
                            className="fixed bottom-10 md:bottom-20 right-10 md:right-20 h-12 md:h-14 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-200" 
                            onClick={() => setOpenCreateModal(true)}
                        >
                            <LuPlus className="text-2xl"/>
                            Add New
                        </button>
                    )}

                    {/* Create Session Modal */}
                    {openCreateModal && (
                        <CreateSessionForm 
                            onSubmit={handleCreateSession} 
                            onCancel={() => setOpenCreateModal(false)} 
                        />
                    )}

                    {/* Delete Confirmation Modal */}
                    {openDeleteAlert && (
                        <Modal
                            isOpen={true}
                            onClose={() => setOpenDeleteAlert(null)}
                            title="Delete Session"
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Are you sure you want to delete "{openDeleteAlert.sessionName}"?
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    This action cannot be undone.
                                </p>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setOpenDeleteAlert(null)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 border border-gray-300 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSession(openDeleteAlert.sessionId)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Modal>
                    )}

                    {/* Error message toast if error occurs while sessions exist */}
                    {error && sessions.length > 0 && (
                        <div className="fixed bottom-5 left-5 bg-red-50 border border-red-200 text-red-600 rounded-md px-4 py-3 shadow-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm">{error}</p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <button
                                        onClick={() => setError(null)}
                                        className="inline-flex text-red-400 focus:outline-none"
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        );
    }

    export default Dashboard;