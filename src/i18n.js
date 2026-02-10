import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "dashboard": "Dashboard",
      "clients": "Clients",
      "pipeline": "Pipeline",
      "calendar": "Calendar",
      "settings": "Settings",
      "profile": "Profile",
      "team": "Team",
      "enterprise": "Enterprise",
      "logout": "Logout",
      "notifications": "Notifications",
      "dark_mode": "Dark Mode",
      "setup": "Setup",
      "knowledge_base": "Knowledge Base",
      "facebook_ads": "Facebook Ads",
      "conversations": "Conversations",
      "team_chat": "Team Chat",
      "apps": "Apps",
      "landing_pages": "Landing Pages",
      "search": "Search...",
      "main": "MAIN"
    }
  },
  fr: {
    translation: {
      "dashboard": "Tableau de bord",
      "clients": "Clients",
      "pipeline": "Pipeline",
      "calendar": "Calendrier",
      "settings": "Paramètres",
      "profile": "Profil",
      "team": "Équipe",
      "enterprise": "Entreprise",
      "logout": "Déconnexion",
      "notifications": "Notifications",
      "dark_mode": "Mode Sombre",
      "setup": "Configuration",
      "knowledge_base": "Base de connaissances",
      "facebook_ads": "Facebook Ads",
      "conversations": "Conversations",
      "team_chat": "Chat d'équipe",
      "apps": "Applications",
      "landing_pages": "Pages d'atterrissage",
      "search": "Rechercher...",
      "main": "PRINCIPAL"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
