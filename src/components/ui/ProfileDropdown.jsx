import React, { useEffect, useState } from 'react';
import { User, Settings, Moon, LogOut } from 'lucide-react';

const ProfileDropdown = ({ isOpen, onLogout }) => {
  const [user, setUser] = useState(null);

  // Récupérer les données utilisateur du localStorage
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        setUser(null);
      }
    };

    getUserFromStorage();
    
    // Écouter les changements de localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        getUserFromStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier périodiquement (pour les onglets multiples)
    const interval = setInterval(getUserFromStorage, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Items du menu avec actions
  const menuItems = [
    { 
      icon: User, 
      label: 'Profil', 
      color: 'text-gray-700', 
      action: () => console.log('Profil:', user) 
    },
    { 
      icon: Settings, 
      label: 'Paramètres', 
      color: 'text-gray-700', 
      action: () => console.log('Ouvrir paramètres') 
    },
    { 
      icon: Moon, 
      label: 'Mode sombre', 
      color: 'text-gray-700', 
      action: () => console.log('Changer le thème') 
    },
    { 
      icon: LogOut, 
      label: 'Déconnexion', 
      color: 'text-red-500', 
      action: () => {
        // Nettoyer le localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        // Appeler la callback de déconnexion
        if (onLogout) {
          onLogout();
        }
        
        // Rediriger si nécessaire
        window.location.href = '/login';
      } 
    },
  ];

  if (!isOpen) return null;

  // Données par défaut si aucun utilisateur n'est trouvé
  const displayUser = user || { 
    name: 'Utilisateur', 
    email: 'user@example.com' 
  };

  return (
    <div
      className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu"
    >
      {/* En-tête avec informations utilisateur */}
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">
          Bonjour {displayUser.firstName || 'Utilisateur'}
        </p>
        <p className="truncate text-xs text-gray-500">
          {displayUser.email || 'Email non disponible'}
        </p>
        {user?.roles && (
          <p className="text-xs text-blue-600 mt-1">
            {Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}
          </p>
        )}
      </div>

      {/* Items du menu */}
      <div className="py-1" role="none">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className={`group flex w-full items-center px-4 py-2 text-sm transition-colors duration-150 ${item.color} hover:bg-gray-50`}
              role="menuitem"
              type="button"
            >
              <Icon 
                size={18} 
                className={`mr-3 ${item.color} group-hover:text-gray-900`} 
              />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Information sur les données */}
      <div className="px-4 py-2 bg-gray-50">
        <p className="text-xs text-gray-500">
          Données stockées localement
        </p>
      </div>
    </div>
  );
};

// Version avec prop user optionnelle (fallback)
ProfileDropdown.defaultProps = {
  isOpen: false,
  onLogout: null,
};

export default ProfileDropdown;