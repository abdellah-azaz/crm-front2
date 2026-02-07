import React from 'react';
import { Zap, CheckCircle, Shield, Users, Mail, Facebook, ArrowRight } from 'lucide-react';

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
    status, // 'connected' or 'disconnected'
    icon: Icon, 
    iconBgColor, 
    actionButtonText,
}) => {
    const isConnected = status === 'connected';
    const statusTextClass = isConnected ? 'text-green-600' : 'text-red-600';
    const buttonClass = isConnected 
        ? 'bg-red-50 text-red-600 hover:bg-red-100'
        : 'bg-blue-500 text-white hover:bg-blue-600';
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
                            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}></span>
                            <span className={statusTextClass}>{isConnected ? 'Connecté' : 'Déconnecté'}</span>
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

            <button className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${buttonClass}`}>
                <span className="flex items-center justify-center space-x-2">
                    {isConnected ? <ArrowRight size={16} /> : null}
                    <span>{actionButtonText}</span>
                </span>
            </button>
        </div>
    );
};

const IntegrationsPage = () => {
    const featureCards = [
        {
            value: '1',
            label: 'Services connectés',
            icon: CheckCircle,
            iconColor: 'text-yellow-600',
            iconBgColor: 'bg-yellow-50',
        },
        {
            value: 'OAuth 2.0',
            label: 'Authentification sécurisée',
            icon: Shield,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-50',
        },
        {
            value: 'Prêt à l\'utilisation',
            label: 'Prêt à l\'utilisation',
            icon: Users,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-50',
        },
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 space-y-12">
            
            {/* Header Section */}
            <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-500 rounded-full mx-auto mb-4">
                    <Zap size={32} className="text-white" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Connectez vos comptes</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Simplifiez votre flux de travail en connectant vos plateformes préférées. Gérez toutes vos intégrations depuis un tableau de bord sécurisé.
                </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featureCards.map((card, index) => (
                    <FeatureCard key={index} {...card} />
                ))}
            </div>

            {/* Connection Cards Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ConnectionCard 
                    title="Gmail"
                    description="Envoyer des e-mails, gérer les messages et automatiser les flux de travail des e-mails."
                    features={['Automatisation des e-mails', 'Gestion des messages', 'Synchronisation des contacts']}
                    permissions={['Lire les e-mails', 'Envoyer des e-mails', 'Gérer les contacts']}
                    status="disconnected"
                    icon={Mail}
                    iconBgColor="bg-red-500"
                    actionButtonText="Connecter Gmail"
                />
                <ConnectionCard 
                    title="Facebook"
                    description="Gérer vos campagnes publicitaires, interagir avec les clients et automatiser vos publications."
                    features={['Automatisation des publicités', 'Gestion des posts', 'Synchronisation des contacts']}
                    permissions={['Lire les campagnes', 'Gérer les annonces', 'Accéder aux contacts']}
                    status="disconnected"
                    icon={Facebook}
                    iconBgColor="bg-blue-600"
                    actionButtonText="Connecter Facebook"
                />
            </div>
            
            {/* Placeholder for Integrations List */}
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Integrations disponibles</h2>
                <div className="h-40 flex items-center justify-center text-gray-500 border border-dashed rounded-lg">
                    Liste des applications (Stripe, Google Sheets, etc.) irait ici.
                </div>
            </div>

        </div>
    );
};

export default IntegrationsPage;