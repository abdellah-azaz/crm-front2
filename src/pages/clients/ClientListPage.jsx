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
    Search,
    ChevronDown,
    X
} from 'lucide-react';

// Importez votre API de lead
import { leadAPI } from '../../api/leadAPI'; // Ajustez le chemin selon votre structure

const InputField = ({ label, type = 'text', placeholder, name, value, onChange, required = false }) => (
    <div className="flex flex-col space-y-1">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            id={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
        />
    </div>
);

const AddContactForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        info: {}
    });
    
    const [infoFields, setInfoFields] = useState([{ key: '', value: '' }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInfoFieldChange = (index, field, value) => {
        const updatedFields = [...infoFields];
        updatedFields[index][field] = value;
        setInfoFields(updatedFields);
        
        // Mettre à jour l'objet info
        const updatedInfo = {};
        updatedFields.forEach(field => {
            if (field.key && field.value) {
                updatedInfo[field.key] = field.value;
            }
        });
        setFormData(prev => ({ ...prev, info: updatedInfo }));
    };

    const addInfoField = () => {
        setInfoFields([...infoFields, { key: '', value: '' }]);
    };

    const removeInfoField = (index) => {
        if (infoFields.length > 1) {
            const updatedFields = infoFields.filter((_, i) => i !== index);
            setInfoFields(updatedFields);
            
            // Mettre à jour l'objet info
            const updatedInfo = {};
            updatedFields.forEach(field => {
                if (field.key && field.value) {
                    updatedInfo[field.key] = field.value;
                }
            });
            setFormData(prev => ({ ...prev, info: updatedInfo }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validation
            if (!formData.name || !formData.email) {
                throw new Error('Le nom et l\'email sont requis');
            }

            // Filtrer les champs info vides
            const filteredInfo = {};
            Object.entries(formData.info).forEach(([key, value]) => {
                if (key && value) {
                    filteredInfo[key] = value;
                }
            });

            const leadData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone || undefined,
                info: Object.keys(filteredInfo).length > 0 ? filteredInfo : undefined
            };

            console.log('Envoi des données:', leadData);
            
            // Appel à l'API
            const response = await leadAPI.createLead(leadData);
            
            console.log('Lead créé avec succès:', response);
            alert('Lead créé avec succès!');
            onClose();
            
        } catch (err) {
            console.error('Erreur lors de la création:', err);
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-bold text-gray-900">Créer un nouveau Lead</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField 
                        label="Nom complet" 
                        name="name" 
                        placeholder="Ex: Charlie Brown" 
                        value={formData.name}
                        onChange={handleChange}
                        required 
                    />
                    
                    <InputField 
                        label="Email" 
                        name="email" 
                        type="email" 
                        placeholder="Ex: charlie@example.com" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                    />
                    
                    <InputField 
                        label="Téléphone" 
                        name="phone" 
                        placeholder="Ex: +1234567890" 
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-semibold text-gray-700">Informations supplémentaires</h3>
                            <button
                                type="button"
                                onClick={addInfoField}
                                className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                            >
                                <Plus size={14} />
                                Ajouter une info
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {infoFields.map((field, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Clé (ex: source)"
                                            value={field.key}
                                            onChange={(e) => handleInfoFieldChange(index, 'key', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Valeur (ex: website)"
                                            value={field.value}
                                            onChange={(e) => handleInfoFieldChange(index, 'value', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeInfoField(index)}
                                        disabled={infoFields.length === 1}
                                        className={`p-2 ${infoFields.length === 1 ? 'text-gray-300' : 'text-gray-500 hover:text-red-500'}`}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {Object.keys(formData.info).length > 0 && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 className="text-xs font-semibold text-gray-600 mb-2">Informations ajoutées:</h4>
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                    {JSON.stringify(formData.info, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button 
                            type="button" 
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading || !formData.name || !formData.email}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Création...
                                </>
                            ) : (
                                'Sauvegarder le Lead'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ClientListPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    
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
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-semibold text-gray-900">Gestion des Leads</h1>
                </div>

                {/* Toolbar Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-0">
                            {toolbarIcons.map((btn, index) => (
                                <ToolbarButton key={index} {...btn} />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-500">0 leads trouvés</span>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="flex space-x-3 items-center">
                        <button className="flex items-center text-sm font-medium text-gray-700 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Columns <ChevronDown size={14} className="ml-1" />
                        </button>

                        <div className="relative flex-1 max-w-sm">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher des leads..."
                                className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                        <FileText size={32} className="text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mt-4">Aucun lead trouvé</h2>
                    <p className="text-gray-500 mt-1">Commencez par créer votre premier lead</p>
                    <button 
                        className="mt-6 px-6 py-2 bg-blue-500 text-white text-base font-medium rounded-lg shadow hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        onClick={() => setIsFormOpen(true)}
                    >
                        <Plus size={18} />
                        <span>Créer un Lead</span>
                    </button>
                </div>
            </div>

            {isFormOpen && <AddContactForm onClose={() => setIsFormOpen(false)} />}
        </>
    );
};

export default ClientListPage;