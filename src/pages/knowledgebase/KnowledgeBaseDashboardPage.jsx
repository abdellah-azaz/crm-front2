import React, { useRef, useState } from 'react';
import { Brain, BookOpen, Folder, TrendingUp, Users, Database, Upload, FileText, Layers, Zap, Search, Filter, SlidersHorizontal } from 'lucide-react'; // Added Search, Filter, SlidersHorizontal
import FAQBuilderForm from './FAQBuilderForm';
import ManualEntryForm from './ManualEntryForm';

const StatCard = ({ title, value, icon: Icon, bgColor, textColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg flex justify-between items-center transition duration-300 hover:shadow-xl">
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
            <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
    </div>
);

const TabButton = ({ tabId, Icon, label, activeTab, setActiveTab }) => {
    const isActive = activeTab === tabId;
    const activeClasses = 'text-blue-600 border-b-2 border-blue-600 font-semibold';
    const inactiveClasses = 'text-gray-500 hover:text-gray-700 font-medium';
    
    return (
        <button
            className={`flex items-center px-4 py-2 text-sm transition duration-150 ${isActive ? activeClasses : inactiveClasses}`}
            onClick={() => setActiveTab(tabId)}
        >
            <Icon className="w-4 h-4 mr-2" />
            {label}
        </button>
    );
};

const FileUploadContent = ({ fileInputRef, handleFileButtonClick }) => (
    <>
        {/* File Upload Dropzone (Image 1) */}
        <div className="p-10 border-2 border-dashed border-gray-300 rounded-xl mb-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-semibold text-gray-700 mb-1">Drop files here to upload</p>
            <p className="text-sm text-gray-500 mb-4">Supports PDF, DOC, TXT files up to 10MB</p>
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-150 shadow-md"
                onClick={handleFileButtonClick}
            >
                Choose Files
            </button>
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.txt" // Based on description
                onChange={(e) => { console.log(e.target.files); }} // Placeholder handler
            />
        </div>

        {/* Feature Cards (Image 2 - related to upload features) */}
        <div className="grid grid-cols-3 gap-6 pt-4">
            <div className="text-center">
                <div className="p-4 inline-flex items-center justify-center bg-blue-100 rounded-lg mb-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-semibold text-gray-800">Text Documents</p>
                <p className="text-xs text-gray-500">PDF, DOC, TXT</p>
            </div>
            <div className="text-center">
                <div className="p-4 inline-flex items-center justify-center bg-yellow-100 rounded-lg mb-3">
                    <Database className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="font-semibold text-gray-800">Structured Data</p>
                <p className="text-xs text-gray-500">CSV, JSON, XML</p>
            </div>
            <div className="text-center">
                <div className="p-4 inline-flex items-center justify-center bg-red-100 rounded-lg mb-3">
                    <Zap className="w-6 h-6 text-red-600" />
                </div>
                <p className="font-semibold text-gray-800">AI Processing</p>
                <p className="text-xs text-gray-500">Auto-categorization</p>
            </div>
        </div>
    </>
);

const FilterTag = ({ category, activeCategory, setActiveCategory }) => {
    const isActive = activeCategory === category;
    return (
        <button 
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1 text-sm rounded-full transition-colors duration-150 ${
                isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
            {category}
        </button>
    );
};

const KnowledgeBaseDashboardPage = () => {
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('manual-entry');
    const [activeCategory, setActiveCategory] = useState('All');

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

    const TabContent = () => {
        switch (activeTab) {
            case 'manual-entry':
                return <ManualEntryForm />;
            case 'faq-builder':
                return <FAQBuilderForm />;
            case 'file-upload':
            default:
                return <FileUploadContent fileInputRef={fileInputRef} handleFileButtonClick={handleFileButtonClick} />;
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center mb-8">
                <div className="flex justify-center mb-4">
                    <Brain className="w-12 h-12 text-blue-500" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Knowledge Base Management
                    <span className="ml-2 text-gray-400">
                        <svg className="inline w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm6 8a6 6 0 11-12 0 6 6 0 0112 0zm-1.732-4.268a1 1 0 01-1.414 1.414L13.25 6.75a1 1 0 011.414-1.414l.848.848zM3.25 6.75L4.098 5.902a1 1 0 011.414 1.414L4.664 8.164a1 1 0 01-1.414-1.414zM10 16a1 1 0 01-1 1v1a1 1 0 112 0v-1a1 1 0 01-1-1zm-6-2.268L5.902 13.25a1 1 0 01-1.414 1.414l-.848-.848a1 1 0 011.414-1.414zm11.732 0L13.25 15.098a1 1 0 011.414-1.414l.848.848a1 1 0 01-1.414 1.414z"></path>
                        </svg>
                    </span>
                </h1>
                <p className="text-lg text-gray-600">
                    Build and manage your company's knowledge base to power intelligent chatbots and support systems.
                </p>
            </div>

            {/* Main Content: Form + Sidebar (New Grid Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Left Column: Add Knowledge Form (Spans 2/3 on large screens) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center mb-6 border-b pb-4">
                        <Database className="w-8 h-8 text-blue-500 mr-3" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Add Knowledge</h2>
                            <p className="text-sm text-gray-500">Choose how you'd like to add information to your knowledge base</p>
                        </div>
                    </div>

                    {/* Tabs for Add Knowledge */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <TabButton tabId="manual-entry" Icon={FileText} label="Manual Entry" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton tabId="faq-builder" Icon={Layers} label="FAQ Builder" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton tabId="file-upload" Icon={Upload} label="File Upload" activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>

                    {/* Conditional Content */}
                    <TabContent />
                </div>

                {/* Right Column: Search & Recent Entries (New Sidebar) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Search & Filter Section */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center mb-4">
                            <Search className="w-6 h-6 text-yellow-500 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
                        </div>
                        
                        {/* Search Input */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search knowledge base..." 
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="mb-2">
                            <div className="flex items-center mb-3">
                                <SlidersHorizontal className="w-4 h-4 text-gray-500 mr-1" />
                                <span className="text-sm font-medium text-gray-700">Category</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['All', 'Product', 'Support', 'Policy', 'Technical', 'Sales'].map(cat => (
                                    <FilterTag 
                                        key={cat} 
                                        category={cat} 
                                        activeCategory={activeCategory} 
                                        setActiveCategory={setActiveCategory} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Entries Section */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Entries</h3>
                            <span className="text-sm text-gray-500">0 total</span>
                        </div>
                        
                        {/* No entries content */}
                        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-base font-semibold text-gray-700">No entries found</p>
                            <p className="text-sm text-gray-500">Start adding content to your knowledge base</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Existing Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Entries"
                    value="0"
                    icon={BookOpen}
                    bgColor="bg-blue-100"
                    textColor="text-blue-600"
                />
                <StatCard
                    title="Categories"
                    value="5"
                    icon={Folder}
                    bgColor="bg-yellow-100"
                    textColor="text-yellow-600"
                />
                <StatCard
                    title="This Month"
                    value="0"
                    icon={TrendingUp}
                    bgColor="bg-red-100"
                    textColor="text-red-600"
                />
                <StatCard
                    title="Active Users"
                    value="24"
                    icon={Users}
                    bgColor="bg-pink-100"
                    textColor="text-pink-600"
                />
            </div>
        </div>
    );
};

export default KnowledgeBaseDashboardPage;