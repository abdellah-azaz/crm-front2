import React from 'react';
import { ArrowLeft, Eye, Code, Palette, Save, Plus, Home, Star, Zap, Paintbrush } from 'lucide-react';

const SidebarComponent = ({ Icon, name }) => (
    <button className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-150 w-full text-left border border-gray-200">
        <Plus size={16} className="text-gray-500" />
        <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">
            <Icon size={16} className="text-gray-600" />
        </span>
        <span className="font-medium text-gray-700">{name}</span>
    </button>
);

const LandingPageEditor = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-xl">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2 mb-4">
                        <ArrowLeft className="w-5 h-5 text-gray-600 cursor-pointer" onClick={() => window.history.back()} />
                        <h1 className="text-2xl font-bold text-gray-900">Landing Pages</h1>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">Create your first landing page to boost your online presence.</p>

                    {/* Editor Controls */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button className="flex items-center justify-center space-x-2 p-3 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            <Eye size={16} />
                            <span>Preview</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 p-3 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            <Code size={16} />
                            <span>Code</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 p-3 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            <Palette size={16} />
                            <span>Theme</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 p-3 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            <Save size={16} />
                            <span>Save</span>
                        </button>
                    </div>

                    <h2 className="text-sm font-semibold text-gray-700 mt-4 mb-3">Add Components</h2>
                    <div className="space-y-3">
                        <SidebarComponent Icon={Home} name="Header" />
                        <SidebarComponent Icon={Star} name="Hero Section" />
                        <SidebarComponent Icon={Zap} name="Features" />
                        {/* More components can be added here */}
                    </div>
                </div>
            </div>

            {/* Main Build Zone */}
            <div className="flex-1 flex flex-col p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Build Zone</h2>
                </div>
                <p className="text-gray-500 mb-6">Drag and drop components to build your page</p>

                {/* Canvas */}
                <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-12 bg-white">
                    <div className="text-center">
                        <Paintbrush size={64} className="mx-auto text-pink-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800">Your canvas is empty</h3>
                        <p className="text-sm text-gray-500 mt-1">Start by adding components from the sidebar</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPageEditor;