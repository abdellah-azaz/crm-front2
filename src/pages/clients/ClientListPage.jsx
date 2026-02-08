import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    RefreshCw,
    Trash2,
    Search,
    X,
    Eye,
    Calendar,
    Phone,
    Mail,
    User,
    Check,
    AlertCircle
} from 'lucide-react';
import { leadAPI } from '../../api/leadAPI';

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

const Notification = ({ message, type = 'success', onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700';
    const icon = type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />;
    
    return (
        <div className={`${bgColor} border px-4 py-3 rounded-lg flex items-center justify-between mb-4`}>
            <div className="flex items-center gap-2">
                {icon}
                <span>{message}</span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={16} />
            </button>
        </div>
    );
};

const ConfirmationDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirmer", cancelText = "Annuler", type = "danger" }) => {
    if (!isOpen) return null;
    
    const buttonColor = type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600';
    
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        <AlertCircle size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
                
                <p className="text-gray-600">{message}</p>
                
                <div className="flex justify-end space-x-3 pt-4">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${buttonColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddContactForm = ({ onClose, onLeadCreated }) => {
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
            if (!formData.name || !formData.email) {
                throw new Error('Le nom et l\'email sont requis');
            }

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

            await leadAPI.createLead(leadData);
            
            setFormData({ name: '', email: '', phone: '', info: {} });
            setInfoFields([{ key: '', value: '' }]);
            
            if (onLeadCreated) {
                onLeadCreated();
            }
            
            onClose();
            
        } catch (err) {
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
                    <Notification 
                        message={error} 
                        type="error" 
                        onClose={() => setError('')} 
                    />
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

const LeadCard = ({ lead, onDelete, isDeleting }) => {
    const [showDetails, setShowDetails] = useState(false);
    
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{lead.email}</span>
                    </div>
                </div>
                <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-blue-500 hover:text-blue-700 p-1"
                    disabled={isDeleting}
                >
                    <Eye size={16} />
                </button>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                {lead.phone && (
                    <div className="flex items-center gap-1">
                        <Phone size={14} />
                        <span>{lead.phone}</span>
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            
            {showDetails && lead.info && Object.keys(lead.info).length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2">Informations supplémentaires:</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.entries(lead.info).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 rounded p-2">
                                <div className="text-xs text-gray-500">{key}</div>
                                <div className="text-sm font-medium">{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="mt-3 flex justify-end">
                <button 
                    onClick={() => onDelete(lead._id)}
                    disabled={isDeleting}
                    className="text-red-500 text-sm hover:text-red-700 px-3 py-1 border border-red-200 rounded hover:bg-red-50 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDeleting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                            Suppression...
                        </>
                    ) : (
                        <>
                            <Trash2 size={14} />
                            Supprimer
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

const ToolbarButton = ({ icon: Icon, label, action, disabled = false }) => (
    <button 
        className={`p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
        title={label}
        onClick={action}
        disabled={disabled}
    >
        <Icon size={20} />
    </button>
);

const ClientListPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingIds, setDeletingIds] = useState([]);
    const [deleteAllLoading, setDeleteAllLoading] = useState(false);
    const [confirmationDialog, setConfirmationDialog] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchLeads = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await leadAPI.getAllLeads();
            setLeads(data);
            if (data.length === 0) {
                showNotification('Aucun lead trouvé', 'info');
            }
        } catch (err) {
            setError('Erreur lors du chargement des leads');
            showNotification('Erreur lors du chargement des leads', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLead = async (leadId) => {
        setConfirmationDialog({
            isOpen: true,
            title: 'Supprimer le lead',
            message: 'Êtes-vous sûr de vouloir supprimer ce lead ? Cette action est irréversible.',
            onConfirm: async () => {
                try {
                    setDeletingIds(prev => [...prev, leadId]);
                    setConfirmationDialog(null);
                    
                    await leadAPI.deleteLead(leadId);
                    
                    setLeads(prev => prev.filter(lead => lead._id !== leadId));
                    showNotification('Lead supprimé avec succès');
                } catch (err) {
                    showNotification(err.message || 'Erreur lors de la suppression du lead', 'error');
                } finally {
                    setDeletingIds(prev => prev.filter(id => id !== leadId));
                }
            },
            onCancel: () => setConfirmationDialog(null),
            type: 'danger'
        });
    };

    const handleDeleteAll = async () => {
        if (leads.length === 0) return;
        
        setConfirmationDialog({
            isOpen: true,
            title: 'Supprimer tous les leads',
            message: `Êtes-vous sûr de vouloir supprimer TOUS les leads (${leads.length}) ? Cette action est irréversible.`,
            onConfirm: async () => {
                try {
                    setDeleteAllLoading(true);
                    setConfirmationDialog(null);
                    
                    for (const lead of leads) {
                        try {
                            await leadAPI.deleteLead(lead._id);
                        } catch (err) {
                            console.error(`Error deleting lead ${lead._id}:`, err);
                        }
                    }
                    
                    setLeads([]);
                    showNotification('Tous les leads ont été supprimés');
                } catch (err) {
                    showNotification('Erreur lors de la suppression des leads', 'error');
                } finally {
                    setDeleteAllLoading(false);
                }
            },
            onCancel: () => setConfirmationDialog(null),
            type: 'danger'
        });
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleLeadCreated = () => {
        fetchLeads();
        showNotification('Lead créé avec succès');
    };

    const filteredLeads = leads.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.phone && lead.phone.includes(searchTerm))
    );

    const toolbarIcons = [
        { 
            icon: Plus, 
            label: 'Ajouter un Lead', 
            action: () => setIsFormOpen(true),
            disabled: loading 
        },
        { 
            icon: RefreshCw, 
            label: 'Actualiser', 
            action: fetchLeads,
            disabled: loading 
        },
        { 
            icon: Trash2, 
            label: 'Tout supprimer', 
            action: handleDeleteAll,
            disabled: leads.length === 0 || loading || deleteAllLoading
        },
    ];

    return (
        <>
            <div className="space-y-6">
                {notification && (
                    <Notification 
                        message={notification.message} 
                        type={notification.type} 
                        onClose={() => setNotification(null)} 
                    />
                )}

                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Gestion des Leads</h1>
                        <p className="text-sm text-gray-500 mt-1">Gérez vos contacts et prospects</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">{leads.length}</div>
                            <div className="text-xs text-gray-500">Leads total</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-0">
                            {toolbarIcons.map((btn, index) => (
                                <ToolbarButton 
                                    key={index} 
                                    icon={btn.icon} 
                                    label={btn.label} 
                                    action={btn.action}
                                    disabled={btn.disabled}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                            {loading ? 'Chargement...' : `${filteredLeads.length} leads trouvés`}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <div className="relative flex-1 max-w-lg">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher des leads par nom, email ou téléphone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <Notification 
                        message={error} 
                        type="error" 
                        onClose={() => setError(null)} 
                    />
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-500">Chargement des leads...</p>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                            <Plus size={32} className="text-gray-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mt-4">
                            {searchTerm ? 'Aucun lead correspondant' : 'Aucun lead trouvé'}
                        </h2>
                        <p className="text-gray-500 mt-1">
                            {searchTerm ? 'Essayez une autre recherche' : 'Commencez par créer votre premier lead'}
                        </p>
                        <button 
                            className="mt-6 px-6 py-2 bg-blue-500 text-white text-base font-medium rounded-lg shadow hover:bg-blue-600 transition-colors flex items-center space-x-2"
                            onClick={() => setIsFormOpen(true)}
                        >
                            <Plus size={18} />
                            <span>Créer un Lead</span>
                        </button>
                    </div>
                ) : (
                    <div className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredLeads.map((lead) => (
                                <LeadCard 
                                    key={lead._id} 
                                    lead={lead} 
                                    onDelete={handleDeleteLead}
                                    isDeleting={deletingIds.includes(lead._id)}
                                />
                            ))}
                        </div>
                        
                        <div className="mt-8 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    Total: {leads.length} lead{leads.length > 1 ? 's' : ''}
                                </div>
                                <div className="flex gap-4 text-sm text-gray-600">
                                    <span>Avec téléphone: {leads.filter(l => l.phone).length}</span>
                                    <span>Avec infos: {leads.filter(l => l.info && Object.keys(l.info).length > 0).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <AddContactForm 
                    onClose={() => setIsFormOpen(false)} 
                    onLeadCreated={handleLeadCreated}
                />
            )}

            {confirmationDialog && (
                <ConfirmationDialog
                    isOpen={confirmationDialog.isOpen}
                    title={confirmationDialog.title}
                    message={confirmationDialog.message}
                    onConfirm={confirmationDialog.onConfirm}
                    onCancel={confirmationDialog.onCancel}
                    confirmText="Supprimer"
                    cancelText="Annuler"
                    type={confirmationDialog.type}
                />
            )}
        </>
    );
};

export default ClientListPage;