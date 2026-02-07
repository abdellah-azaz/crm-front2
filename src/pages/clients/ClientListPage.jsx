import React, { useState } from 'react';
import { 
    Plus, 
    RotateCcw, 
    Mail, 
    Heart, 
    Star, 
    Trash2, 
    Download, 
    Upload, 
    Bookmark, 
    FileText,
    List,
    Search,
    ChevronDown
} from 'lucide-react';

const InputField = ({ label, type = 'text', placeholder, name, required = false }) => (
    <div className="flex flex-col space-y-1">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            id={name}
            placeholder={placeholder}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
        />
    </div>
);

const AddContactForm = ({ onClose }) => {
    // Note: State management for form data is omitted for UI implementation focus
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Contact added!");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-3">Ajouter un nouveau contact</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Nom complet" name="fullName" placeholder="Entrez le nom complet" required />
                    <InputField label="Email" name="email" type="email" placeholder="Entrez l'adresse email" required />
                    <InputField label="Téléphone" name="phone" placeholder="Entrez le numéro de téléphone" />
                    <InputField label="Tag" name="tag" placeholder="Ajoutez un tag (ex: prospect, client, VIP)" />

                    <div className="flex justify-end space-x-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition-colors"
                        >
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ClientListPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // Icons for the toolbar, based on the image
    const toolbarIcons = [
        { icon: Plus, label: 'Add Contact', action: () => setIsFormOpen(true) },
        { icon: RotateCcw, label: 'Reset Filter' },
        { icon: Mail, label: 'Email' },
        { icon: Heart, label: 'Favorite' },
        { icon: Star, label: 'Star' },
        { icon: Trash2, label: 'Delete' },
        { icon: Download, label: 'Download' },
        { icon: Upload, label: 'Upload' },
        { icon: Bookmark, label: 'Bookmark' },
        { icon: FileText, label: 'Document' },
    ];
    
    // Updated ToolbarButton component to handle action
    const ToolbarButton = ({ icon: Icon, label, action }) => (
        <button 
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-150" 
            title={label}
            onClick={action}
        >
            <Icon size={20} />
        </button>
    );

    return (
        <>
            <div className="space-y-6">
                {/* Header / Primary Action */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
                    {/* Placeholder for actions next to title if needed */}
                </div>

                {/* Toolbar Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-0">
                            {toolbarIcons.map((btn, index) => (
                                <ToolbarButton key={index} {...btn} />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-500">0 contacts found</span>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="flex space-x-3 items-center">
                        {/* Columns dropdown (replaces All/Columns group) */}
                        <button className="flex items-center text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Columns <ChevronDown size={14} className="ml-1" />
                        </button>

                        {/* Search Input */}
                        <div className="relative flex-1 max-w-sm">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        {/* Removed More Filters Button */}
                    </div>
                </div>

                {/* Empty State / No Contacts Found */}
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                        <FileText size={32} className="text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mt-4">No contacts found</h2>
                    <p className="text-gray-500 mt-1">Get started by adding your first contact</p>
                    <button 
                        className="mt-6 px-6 py-2 bg-blue-500 text-white text-base font-medium rounded-lg shadow hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        onClick={() => setIsFormOpen(true)}
                    >
                        <Plus size={18} />
                        <span>Add Contact</span>
                    </button>
                </div>
            </div>

            {isFormOpen && <AddContactForm onClose={() => setIsFormOpen(false)} />}
        </>
    );
};

export default ClientListPage;