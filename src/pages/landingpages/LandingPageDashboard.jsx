import React from 'react';
import { Plus, Eye, Trash2, FileText, Zap, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PageCard = ({ pageName, dateCreated, showTemplate = false }) => {
    const navigate = useNavigate();
    // Template cards will have a slightly different look (like the thumbnail placeholder)
    const headerClasses = showTemplate ? 'bg-gray-100 h-32 p-4 flex items-start' : 'bg-blue-500 h-32 p-4 flex items-start';
    const iconClasses = showTemplate ? 'text-gray-400' : 'text-white opacity-75';

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
            {/* Header / Page Thumbnail Placeholder */}
            <div className={headerClasses}>
                <FileText className={`w-8 h-8 ${iconClasses}`} />
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{pageName}</h3>
                
                {!showTemplate && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Zap className="w-4 h-4 mr-1 text-gray-400" />
                        <span>Created on {dateCreated}</span>
                    </div>
                )}
                
                {/* Actions */}
                <div className="flex space-x-2">
                    <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors">
                        <Eye size={16} className="mr-1" />
                        {showTemplate ? 'Preview' : 'Open'}
                    </button>
                    {/* Trash only for saved pages */}
                    {!showTemplate && (
                        <button className="p-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
                            <Trash2 size={16} />
                        </button>
                    )}
                    <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg text-yellow-600 bg-yellow-100 hover:bg-yellow-200 transition-colors">
                        View online
                    </button>
                </div>
            </div>
        </div>
    );
};

const LandingPageDashboard = () => {
    const navigate = useNavigate();
    // Invented data for demonstration
    const pages = [
        { id: '1', name: 'Page_b330d1e0', created: 'Feb 4, 2026' },
        { id: '2', name: 'Page_799477a0', created: 'Feb 4, 2026' },
        { id: '3', name: 'Page_bb45862a', created: 'Feb 4, 2026' },
        { id: '4', name: 'Page_c8e9f2d1', created: 'Feb 3, 2026' },
        { id: '5', name: 'Page_a1b2c3d4', created: 'Feb 3, 2026' },
        { id: '6', name: 'Page_f4g5h6i7', created: 'Feb 2, 2026' },
    ];
    
    // Invented template data
    const templates = [
        { id: 't1', name: 'Template 1: Minimal', created: 'Jan 1, 2026' },
        { id: 't2', name: 'Template 2: Lead Gen', created: 'Jan 5, 2026' },
        { id: 't3', name: 'Template 3: eCommerce', created: 'Jan 10, 2026' },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <Zap className="w-8 h-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-gray-900">Saved Pages</h1>
                </div>
                <button className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 shadow-md"  onClick={() => navigate('/landingEditor')}>
                    <Plus size={18} className="mr-1" />
                    New page
                </button>
            </div>
            
            {/* New Stats Block */}
            <div className="bg-white p-6 rounded-xl shadow-lg flex justify-between items-center mb-6">
                <div className="flex space-x-8">
                    <div>
                        <span className="text-3xl font-bold text-blue-600 block">6</span>
                        <span className="text-sm text-gray-500">Total pages</span>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-yellow-600 block">5</span>
                        <span className="text-sm text-gray-500">This week</span>
                    </div>
                </div>
                <span className="text-sm text-gray-500">Last updated: 2/4/2026</span>
            </div>

            <p className="text-gray-500 mb-6">{pages.length} page</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                {pages.map(page => (
                    <PageCard 
                        key={page.id}
                        pageName={page.name}
                        dateCreated={page.created}
                    />
                ))}
            </div>
            
            {/* New Templates Section Header */}
            <div className="flex items-center space-x-3 mb-6">
                <Zap className="w-8 h-8 text-blue-500" />
                <h2 className="text-3xl font-bold text-gray-900">Templates</h2>
            </div>

            {/* Templates Grid (using PageCard with special flag) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {templates.map(template => (
                    <PageCard 
                        key={template.id}
                        pageName={template.name}
                        dateCreated={template.created}
                        showTemplate={true}
                    />
                ))}
            </div>
        </div>
    );
};

export default LandingPageDashboard;