import React, { useState } from 'react';
import { Search, ChevronLeft, MessageCircle, Mail, AlertTriangle } from 'lucide-react';

/**
 * Component to display the Sidebar content (conversation list).
 * Mimics the ChatHub design from the image.
 */
const ConversationSidebar = ({ isCollapsed, toggleCollapse }) => {
    const [activeTab, setActiveTab] = useState('emails');
    const widthClass = isCollapsed ? 'w-20' : 'w-80';

    return (
        <div className={`flex-shrink-0 ${widthClass} border-r border-gray-200 flex flex-col bg-white h-full transition-all duration-300 ease-in-out overflow-hidden`}>
            {/* Header: ChatHub and Collapse Icon */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                        {/* Placeholder for small ChatHub icon (blue circle) */}
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <MessageCircle size={14} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">ChatHub</h2>
                    </div>
                )}
                {isCollapsed && (
                    <div className="flex items-center space-x-2 mx-auto">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <MessageCircle size={14} className="text-white" />
                        </div>
                    </div>
                )}
                <ChevronLeft
                    size={20}
                    className={`text-gray-400 cursor-pointer hover:text-gray-600 transition-transform duration-300 ease-in-out ${isCollapsed ? 'rotate-180' : ''} ${isCollapsed ? 'mx-auto' : ''}`}
                    onClick={toggleCollapse}
                />
            </div>

            {/* Search Bar */}
            {!isCollapsed && (
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}

            {/* Tabs */}
            {!isCollapsed && (
                <div className="flex border-b border-gray-200 px-4">
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'emails' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('emails')}
                    >
                        Emails
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'facebook' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('facebook')}
                    >
                        Facebook
                    </button>
                </div>
            )}

            {/* Conversation List (Placeholder/Error State) */}
            {!isCollapsed && (
                <div className="flex-1 overflow-y-auto pt-4">
                    {activeTab === 'emails' && (
                        <>
                            {/* Error State Mimicry: Emails */}
                            <div className="p-4 border-l-4 border-red-500 bg-red-50 mb-2 mx-4">
                                <div className="flex items-center space-x-2 text-red-700">
                                    <AlertTriangle size={20} />
                                    <span className="font-semibold">Error Loading Emails</span>
                                </div>
                                <p className="text-xs text-red-600 mt-1">Failed to load conversations</p>
                            </div>
                            <div className="px-4 text-sm text-gray-500">
                                Failed to load conversations
                            </div>
                        </>
                    )}
                    {activeTab === 'facebook' && (
                        <>
                            {/* Error State Mimicry: Facebook */}
                            <div className="p-4 border-l-4 border-red-500 bg-red-50 mb-2 mx-4">
                                <div className="flex items-center space-x-2 text-red-700">
                                    <AlertTriangle size={20} />
                                    <span className="font-semibold">Failed to load pages</span>
                                </div>
                                <p className="text-xs text-red-600 mt-1">no page found</p>
                            </div>
                            <div className="px-4 text-sm text-gray-500">
                                Failed to load pages
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * Component to display the Main Content area (conversation viewer).
 * Mimics the "Welcome to Email Hub" design.
 */
const ConversationMainContent = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white h-full">
            <div className="text-center max-w-md">
                {/* Illustration Mimicry */}
                <div className="relative inline-block mb-6">
                    {/* Large Chat Icon (light blue circle) */}
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle size={40} className="text-blue-500" />
                    </div>
                    {/* Envelope Icon (orange circle, top right) */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                        <Mail size={16} className="text-orange-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Email Hub</h1>
                <p className="text-gray-600 mb-6">
                    Select an email conversation from the sidebar to start reading and responding to messages
                </p>
                <button className="px-6 py-2 border border-blue-400 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                    Choose a conversation to get started
                </button>
            </div>
        </div>
    );
};

/**
 * The main Conversations page component.
 */
const ConversationHubPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    return (
        <div className="flex h-full w-full">
            <ConversationSidebar isCollapsed={isSidebarCollapsed} toggleCollapse={toggleSidebar} />
            <ConversationMainContent />
        </div>
    );
};

export default ConversationHubPage;
