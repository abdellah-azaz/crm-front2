// src/api/gmailApi.js
import axiosInstance from './axiosConfig';

const API_PATH = '/gmail-oauth';

/**
 * Gmail OAuth API Service
 */

/**
 * 1. CONNEXION DIRECTE (Redirection)
 * Redirige directement vers Google OAuth
 */
export const redirectToGmailAuth = () => {
  // Méthode 1 : Redirection simple
  window.location.href = `${axiosInstance.defaults.baseURL}${API_PATH}/auth`;
};

/**
 * 2. CONNEXION AVEC POPUP (Meilleure UX)
 * Ouvre une popup pour la connexion Google
 */
export const connectGmailWithPopup = () => {
  const width = 600;
  const height = 700;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  // Ouvre directement l'URL d'auth dans une popup
  const popup = window.open(
    `${axiosInstance.defaults.baseURL}${API_PATH}/auth`,
    'ConnectGmail',
    `width=${width},height=${height},left=${left},top=${top}`
  );

  if (!popup) {
    alert('Popup bloquée. Veuillez autoriser les popups pour ce site.');
    return null;
  }

  return popup;
};

/**
 * 3. VÉRIFIER LE STATUT DE CONNEXION
 * Vérifie si Gmail est connecté (utilise axios)
 */
export const checkGmailStatus = async () => {
  try {
    const response = await axiosInstance.get(`${API_PATH}/status`);
    return response.data;
  } catch (error) {
    console.error('Erreur vérification statut Gmail:', error);
    return { connected: false, error: error.message };
  }
};

/**
 * 4. RÉCUPÉRER LES EMAILS
 * Récupère les emails depuis Gmail (utilise axios)
 */
export const fetchGmailEmails = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(`${API_PATH}/emails`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur récupération emails:', error);
    throw error.response?.data || error;
  }
};

/**
 * 5. DÉCONNECTER GMAIL
 * Déconnecte l'utilisateur de Gmail (utilise axios)
 */
export const disconnectGmail = async () => {
  try {
    const response = await axiosInstance.delete(`${API_PATH}/disconnect`);
    return response.data;
  } catch (error) {
    console.error('Erreur déconnexion Gmail:', error);
    throw error.response?.data || error;
  }
};

/**
 * 6. SURVEILLER LA POPUP (Utilitaire)
 * Surveille la fermeture d'une popup et vérifie le statut
 */
export const monitorPopupAndCheckStatus = (popup) => {
  return new Promise((resolve, reject) => {
    if (!popup) {
      reject(new Error('Popup non disponible'));
      return;
    }

    const interval = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(interval);
        
        // Attendre un peu puis vérifier le statut
        setTimeout(async () => {
          try {
            const status = await checkGmailStatus();
            resolve(status);
          } catch (error) {
            reject(error);
          }
        }, 1500);
      }
    }, 500);
  });
};

/**
 * 7. FONCTION COMPLÈTE DE CONNEXION
 * Combine popup + surveillance + vérification
 */
export const connectToGmail = async () => {
  try {
    // Ouvrir la popup
    const popup = connectGmailWithPopup();
    
    if (!popup) {
      throw new Error('Impossible d\'ouvrir la popup');
    }
    
    // Surveiller la popup et vérifier le statut après fermeture
    const result = await monitorPopupAndCheckStatus(popup);
    
    return result;
  } catch (error) {
    console.error('Erreur connexion Gmail:', error);
    throw error;
  }
};

// Export par défaut
const GmailAPI = {
  redirectToGmailAuth,
  connectGmailWithPopup,
  connectToGmail,
  checkGmailStatus,
  fetchGmailEmails,
  disconnectGmail,
  monitorPopupAndCheckStatus
};

export default GmailAPI;