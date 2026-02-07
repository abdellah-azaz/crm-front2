import React, { useState } from 'react';
import { Activity, LayoutDashboard, Target, SquareStack, Image, AlertTriangle, ArrowDown } from 'lucide-react';

// Helper component for KPI cards
const AdsKPICard = ({ title, value, icon: Icon, iconBgColor, iconColor }) => (
  <div className="flex-1 min-w-[200px] p-5 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-center transition-shadow duration-300 hover:shadow-md">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${iconBgColor}`}>
      <Icon size={20} className={iconColor} />
    </div>
  </div>
);

// Helper component for the dropdown/selector
const AccountSelector = ({ title, placeholder, isDisabled = false, createButtonText }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleDropdown = () => {
        if (!isDisabled) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="flex-1 relative">
            <p className="text-sm font-medium text-gray-700 mb-3">{title}</p>
            <div 
                className={`p-3 border rounded-lg flex justify-between items-center transition-colors duration-150 ${
                    isDisabled 
                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' 
                        : isOpen 
                            ? 'bg-white text-gray-800 border-blue-500 cursor-pointer shadow-md' 
                            : 'bg-white text-gray-600 border-gray-300 hover:border-blue-500 cursor-pointer'
                }`}
                onClick={toggleDropdown}
            >
                <div className="flex items-center space-x-2">
                    <input type="radio" className="form-radio text-blue-600" checked={!isDisabled} readOnly disabled={isDisabled} />
                    <span className="text-sm">{placeholder}</span>
                </div>
                <ArrowDown size={16} className={`text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-10 py-1">
                    {/* Placeholder for account list items */}
                    <div className="text-sm text-gray-500 p-2 border-b border-gray-100">Aucun compte trouvé</div>
                    
                    {/* Create New Account Button */}
                    <div className="p-2">
                        <button className="w-full text-blue-600 hover:text-white bg-white hover:bg-blue-500 text-sm font-medium py-1.5 px-3 rounded-md transition-colors duration-150 border border-blue-500 hover:border-blue-500">
                            {createButtonText}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const FacebookAdsDashboardPage = () => {
    const kpis = [
        { 
            title: 'Total des campagnes', 
            value: '0', 
            icon: Target, 
            iconBgColor: 'bg-blue-50', 
            iconColor: 'text-blue-500' 
        },
        { 
            title: 'Campagnes actives', 
            value: '0', 
            icon: Activity, 
            iconBgColor: 'bg-green-50', 
            iconColor: 'text-green-500' 
        },
        { 
            title: 'Total des ensembles de publicités', 
            value: '0', 
            icon: SquareStack, 
            iconBgColor: 'bg-purple-50', 
            iconColor: 'text-purple-500' 
        },
        { 
            title: 'Total des annonces', 
            value: '0', 
            icon: Image, 
            iconBgColor: 'bg-yellow-50', 
            iconColor: 'text-yellow-500' 
        },
    ];

    return (
        <div className="space-y-8 p-6">
            
            {/* Header Section */}
            <div className="flex items-start space-x-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                    <LayoutDashboard size={28} className="text-blue-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Tableau de bord des publicités Facebook</h1>
                    <p className="text-gray-600 mt-1">Gérez vos campagnes publicitaires Facebook, ensembles de publicités et annonces</p>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi) => (
                    <AdsKPICard
                        key={kpi.title}
                        title={kpi.title}
                        value={kpi.value}
                        icon={kpi.icon}
                        iconBgColor={kpi.iconBgColor}
                        iconColor={kpi.iconColor}
                    />
                ))}
            </div>

            {/* Error Alert Box */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex justify-between items-center rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                    <AlertTriangle size={20} className="text-red-500" />
                    <div>
                        <p className="text-sm font-semibold text-red-800">Erreur</p>
                        <p className="text-sm text-red-700">Invalid or expired token. Reconnect required.</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg shadow hover:bg-red-600 transition-colors">
                    Réauthentifier
                </button>
            </div>

            {/* Account Selectors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AccountSelector
                    title="Compte professionnel"
                    placeholder="Sélectionner un compte professionnel"
                    createButtonText="Créer un compte professionnel +"
                />
                <AccountSelector
                    title="Compte publicitaire"
                    placeholder="Sélectionner un compte publicitaire"
                    createButtonText="Créer un compte publicitaire +"
                    isDisabled={false}
                />
            </div>

            {/* Placeholder for remaining dashboard content (charts, tables, etc.) */}
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 border border-dashed">
                Contenu de gestion des publicités Facebook (Campagnes, Ensembles, etc.) irait ici.
            </div>

        </div>
    );
};

export default FacebookAdsDashboardPage;