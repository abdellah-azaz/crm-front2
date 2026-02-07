import React, { useState } from 'react';
import { Search, X, Plus, MessageCircle } from 'lucide-react';

const TeamChatPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const sidebarWidthClass = isSidebarCollapsed ? 'w-20' : 'w-80';

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
            
            {/* Left Panel: Conversations List */}
            <div className={`${sidebarWidthClass} border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out`}>
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-100">
                    {!isSidebarCollapsed && (
                        <>
                            <h2 className="text-lg font-semibold text-gray-900">TeamChat</h2>
                            <X size={18} className="text-gray-500 cursor-pointer hover:text-gray-900" onClick={toggleSidebar} />
                        </>
                    )}
                    {isSidebarCollapsed && (
                        <div className="mx-auto w-full text-center">
                            <X size={18} className="text-gray-500 cursor-pointer hover:text-gray-900 mx-auto" onClick={toggleSidebar} />
                        </div>
                    )}
                </div>

                {/* Content: Search Bar and List (Only visible when not collapsed) */}
                {!isSidebarCollapsed && (
                    <>
                        {/* Search Bar */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase flex justify-between items-center">
                                TEAM CONVERSATIONS
                                <Plus size={16} className="text-gray-500 cursor-pointer hover:text-gray-900" />
                            </h3>

                            {/* Empty State for Left Panel */}
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-500">No Team conversations found</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
            
            {/* Right Panel: Chat Area (Empty State) */}
            <div className="flex-1 flex flex-col justify-center items-center p-8">
                <div className="w-24 h-24 flex items-center justify-center bg-blue-50 rounded-full mb-6">
                    <MessageCircle size={40} className="text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Welcome to Team Chat</h2>
                <p className="text-gray-500 mt-1">Select a conversation to start messaging.</p>
            </div>
        </div>
    );
};

export default TeamChatPage;