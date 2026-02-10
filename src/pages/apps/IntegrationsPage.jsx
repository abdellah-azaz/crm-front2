import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle, Shield, Users, Mail, Facebook, ArrowRight, Loader, ExternalLink, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GmailAPI from '../../api/gmailAPI.JS'; // Import de votre fichier gmailApi

const FeatureCard = ({ value, label, icon: Icon, iconColor, iconBgColor }) => (
    <div className="flex-1 min-w-[250px] p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-center transition-shadow duration-300 hover:shadow-md">
        <div className={`w-12 h-12 flex items-center justify-center ${iconBgColor} rounded-full mx-auto mb-4`}>
            <Icon size={24} className={iconColor} />
        </div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
);

const ConnectionCard = ({ 
    title, 
    description, 
    features, 
    permissions, 
    status, // 'disconnected', 'connecting', 'connected', 'error'
    icon: Icon, 
    iconBgColor, 
    actionButtonText,
    onConnect,
    onDisconnect,
    onFetchEmails,
    emails = [],
    loading = false,
    error = null,
}) => {
    const isConnected = status === 'connected';
    const isConnecting = status === 'connecting';
    
    const getStatusColor = () => {
        switch(status) {
            case 'connected': return 'text-green-600';
            case 'connecting': return 'text-yellow-600';
            case 'error': return 'text-red-600';
            default: return 'text-red-600';
        }
    };
    
    const getStatusText = () => {
        switch(status) {
            case 'connected': return 'Connecté';
            case 'connecting': return 'Connexion en cours...';
            case 'error': return 'Erreur de connexion';
            default: return 'Déconnecté';
        }
    };
    
    const getButtonClass = () => {
        if (isConnecting) return 'bg-gray-100 text-gray-400 cursor-not-allowed';
        if (isConnected) return 'bg-red-50 text-red-600 hover:bg-red-100';
        return 'bg-blue-500 text-white hover:bg-blue-600';
    };

    const iconBaseClass = `w-14 h-14 flex items-center justify-center rounded-lg ${iconBgColor} mr-4`;

    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
                <div className={iconBaseClass}>
                    <Icon size={32} className="text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <p className="text-sm font-medium">
                        <span className={`inline-flex items-center space-x-1`}>
                            <span className={`h-2 w-2 rounded-full ${
                                status === 'connected' ? 'bg-green-600' : 
                                status === 'connecting' ? 'bg-yellow-600' : 
                                status === 'error' ? 'bg-red-600' : 'bg-red-600'
                            }`}></span>
                            <span className={getStatusColor()}>{getStatusText()}</span>
                        </span>
                    </p>
                </div>
            </div>

            <p className="text-sm text-gray-700 mb-4">{description}</p>
            
            <p className="text-xs font-semibold text-gray-500 tracking-wider mb-2">FONCTIONNALITÉS</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {features.map((feature, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                        {feature}
                    </span>
                ))}
            </div>

            <p className="text-xs font-semibold text-gray-500 tracking-wider mb-2">PERMISSIONS</p>
            <ul className="space-y-1 mb-6">
                {permissions.map((permission, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                        <CheckCircle size={16} className="text-yellow-500 flex-shrink-0" />
                        <span>{permission}</span>
                    </li>
                ))}
            </ul>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle size={16} className="text-red-500 mr-2" />
                        <span className="text-red-600 text-sm">{error}</span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
                {!isConnected ? (
                    <button 
                        onClick={onConnect}
                        disabled={isConnecting}
                        className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 flex items-center justify-center space-x-2 ${getButtonClass()} ${isConnecting ? 'opacity-70' : ''}`}
                    >
                        {isConnecting ? (
                            <>
                                <Loader size={16} className="animate-spin" />
                                <span>Connexion en cours...</span>
                            </>
                        ) : (
                            <>
                                <ExternalLink size={16} />
                                <span>{actionButtonText}</span>
                            </>
                        )}
                    </button>
                ) : (
                    <>
                        <button 
                            onClick={onFetchEmails}
                            disabled={loading}
                            className="w-full py-2.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors duration-150 flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <Loader size={16} className="animate-spin" />
                                    <span>Chargement des emails...</span>
                                </>
                            ) : (
                                <>
                                    <Mail size={16} />
                                    <span>Afficher mes emails</span>
                                </>
                            )}
                        </button>
                        <button 
                            onClick={onDisconnect}
                            disabled={loading}
                            className="w-full py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors duration-150 disabled:opacity-50"
                        >
                            Déconnecter Gmail
                        </button>
                    </>
                )}
            </div>

            {/* Emails Display */}
            {emails.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        📧 Derniers emails ({emails.length})
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {emails.map((email, index) => {
                            // Utilise la fonction de formatage de gmailApi si disponible
                            const formattedEmail = GmailAPI.formatEmail ? 
                                GmailAPI.formatEmail(email) : email;
                            
                            return (
                                <div 
                                    key={email.id || index} 
                                    className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm truncate">
                                                {formattedEmail.subject || '(Sans objet)'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 truncate">
                                                De: {formattedEmail.from}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formattedEmail.formattedDate || 
                                                    new Date(formattedEmail.date).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                        {formattedEmail.snippet}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const IntegrationsPage = () => {
    const navigate = useNavigate();
    
    const [gmailStatus, setGmailStatus] = useState('disconnected');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emails, setEmails] = useState([]);
    const [checkingStatus, setCheckingStatus] = useState(true);

    // Vérifier le statut de connexion au chargement
    useEffect(() => {
        checkGmailConnection();
    }, []);

    const checkGmailConnection = async () => {
        setCheckingStatus(true);
        try {
            const status = await GmailAPI.checkGmailStatus();
            
            if (status.connected) {
                setGmailStatus('connected');
            } else {
                setGmailStatus('disconnected');
            }
            
            if (status.error) {
                setError(status.error);
            }
        } catch (err) {
            console.error('Error checking Gmail status:', err);
            setGmailStatus('disconnected');
            setError(err.message || 'Erreur lors de la vérification du statut');
        } finally {
            setCheckingStatus(false);
        }
    };

    const connectGmail = async () => {
        setError(null);
        setGmailStatus('connecting');
        
        try {
            // Utiliser la méthode avec popup
            await GmailAPI.connectToGmail();
            
            // Vérifier le statut après connexion
            await checkGmailConnection();
            
        } catch (err) {
            console.error('Error connecting Gmail:', err);
            setGmailStatus('error');
            setError(err.message || 'Erreur lors de la connexion à Gmail');
        }
    };

    const disconnectGmail = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir déconnecter Gmail ?')) {
            return;
        }

        try {
            setLoading(true);
            await GmailAPI.disconnectGmail();
            
            setGmailStatus('disconnected');
            setEmails([]);
            setError(null);
            
            // Afficher un message de succès
            alert('✅ Gmail déconnecté avec succès !');
            
        } catch (err) {
            console.error('Error disconnecting Gmail:', err);
            setError(err.message || 'Erreur lors de la déconnexion');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await GmailAPI.fetchGmailEmails(5);
            
            // Formater les emails si la fonction existe
            const formattedEmails = response.emails ? 
                response.emails.map(email => GmailAPI.formatEmail ? 
                    GmailAPI.formatEmail(email) : email) : 
                [];
            
            setEmails(formattedEmails);
            
            if (formattedEmails.length === 0) {
                setError('Aucun email trouvé');
            }
            
        } catch (err) {
            console.error('Error fetching emails:', err);
            setError(err.message || 'Erreur lors de la récupération des emails');
            setEmails([]);
        } finally {
            setLoading(false);
        }
    };

    // Fonction alternative de connexion simple (sans popup)
    const connectGmailSimple = () => {
        GmailAPI.redirectToGmailAuth();
    };

    const featureCards = [
        {
            value: 'Sécurisé',
            label: 'Connexion OAuth 2.0 sécurisée',
            icon: Shield,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-50',
        },
        {
            value: 'Lecture seule',
            label: 'Accès en lecture seule',
            icon: CheckCircle,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-50',
        },
        {
            value: 'Instantané',
            label: 'Synchronisation en temps réel',
            icon: Zap,
            iconColor: 'text-yellow-600',
            iconBgColor: 'bg-yellow-50',
        },
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
            
            {/* Header Section */}
            <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 shadow-lg">
                    <Zap size={32} className="text-white" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                    Intégrations
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Connectez vos services préférés pour optimiser votre productivité. 
                    Gérez toutes vos connexions depuis un seul endroit.
                </p>
                
                {/* Bouton de connexion alternative */}
                <div className="mt-4">
                    <button
                        onClick={connectGmailSimple}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        Ou utilisez la connexion simple (redirection directe)
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featureCards.map((card, index) => (
                    <FeatureCard key={index} {...card} />
                ))}
            </div>

            {/* Connection Cards Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ConnectionCard 
                    title="Gmail"
                    description="Connectez votre compte Gmail pour lire vos emails directement depuis cette application."
                    features={['Lecture des emails', 'Synchronisation', 'Recherche']}
                    permissions={[
                        'Lire vos emails',
                        'Voir les métadonnées',
                        'Accéder aux pièces jointes'
                    ]}
                    status={checkingStatus ? 'connecting' : gmailStatus}
                    icon={Mail}
                    iconBgColor="bg-gradient-to-r from-red-500 to-red-600"
                    actionButtonText="Connecter Gmail"
                    onConnect={connectGmail}
                    onDisconnect={disconnectGmail}
                    onFetchEmails={fetchEmails}
                    emails={emails}
                    loading={loading}
                    error={error}
                />
                
                <ConnectionCard 
                    title="Facebook"
                    description="Connectez votre compte Facebook pour gérer vos pages et campagnes."
                    features={['Gestion des pages', 'Analytics', 'Campagnes']}
                    permissions={[
                        'Lire vos pages',
                        'Voir les statistiques',
                        'Gérer les publications'
                    ]}
                    status="disconnected"
                    icon={Facebook}
                    iconBgColor="bg-gradient-to-r from-blue-600 to-blue-700"
                    actionButtonText="Connecter Facebook"
                    onConnect={() => alert('Facebook integration coming soon!')}
                />
            </div>
            
            {/* Info Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <div className="flex items-start">
                    <Shield className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                        <h3 className="font-semibold text-blue-800 mb-1">Sécurité garantie</h3>
                        <p className="text-sm text-blue-700">
                            Vos connexions sont sécurisées avec OAuth 2.0. Nous ne stockons jamais vos mots de passe.
                            Vous pouvez révoquer l'accès à tout moment depuis les paramètres de sécurité de chaque service.
                        </p>
                    </div>
                </div>
            </div>

            {/* Debug Section (à enlever en production) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Debug Info:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>Statut Gmail: <span className="font-medium">{gmailStatus}</span></p>
                        <p>Emails chargés: <span className="font-medium">{emails.length}</span></p>
                        <p>Vérification statut: <span className="font-medium">{checkingStatus ? 'En cours' : 'Terminée'}</span></p>
                        <p>Erreur: <span className="font-medium">{error || 'Aucune'}</span></p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default IntegrationsPage;