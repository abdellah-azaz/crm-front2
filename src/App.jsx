import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layouts/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import SetupOnboardingPage from './pages/dashboard/SetupOnboardingPage';
import FacebookAdsDashboardPage from './pages/facebook/FacebookAdsDashboardPage';
import IntegrationsPage from './pages/apps/IntegrationsPage';
import ClientListPage from './pages/clients/ClientListPage';
import ConversationHubPage from './pages/chat/ConversationHubPage';
import TeamChatPage from './pages/chat/TeamChatPage'; // New Import
import CalendarPage from './pages/calendar/CalendarPage'; // Added CalendarPage
import KnowledgeBaseDashboardPage from './pages/knowledgebase/KnowledgeBaseDashboardPage'; // Added Knowledge Base Page
import LandingPageDashboard from './pages/landingpages/LandingPageDashboard'; // Added Landing Page Dashboard
import LandingPageEditor from './pages/landingpages/LandingPageEditor'; // Added Landing Page Editor
import './App.css';
import EntreprisePage from './components/settings/EntreprisePage';
import ProfilePage from './components/settings/ProfilePage';
import EquipePage from './components/settings/EquipePage';
import Pipeline from './pages/pipeline/Pipeline';
import Entreprise from './pages/Entreprise/Entreprise';
import { AuthProvider } from './contextes/AuthContext';

// Component that handles the core application logic and routing
const AppRoutes = () => {    
    // Wrapper to place pages inside dieu cash plus
    const LayoutWrapper = ({ children }) => {
        return <DashboardLayout>{children}</DashboardLayout>;
    };

    return (
        <Routes>
            {/* Login is still a specific route */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/landingEditor" element={<LayoutWrapper><LandingPageEditor /></LayoutWrapper>} /> 
<Route path="/profile" element={<LayoutWrapper><ProfilePage /></LayoutWrapper>} />
<Route path="/equipe" element={<EquipePage />} />
            
            {/* Dashboard Routes (Unsecured) */}
            <Route path="/" element={<LoginPage/>} />
            <Route path="/setup" element={<LayoutWrapper><SetupOnboardingPage /></LayoutWrapper>} />
            <Route path="/dashboard" element={<LayoutWrapper><DashboardPage /></LayoutWrapper>} />

            <Route path="/facebookads" element={<LayoutWrapper><FacebookAdsDashboardPage /></LayoutWrapper>} />
            <Route path="/landingEditor" element={<LandingPageEditor />} />
            <Route path="/apps" element={<LayoutWrapper><IntegrationsPage /></LayoutWrapper>} />
            <Route path="/pipelines" element={<LayoutWrapper><Pipeline /></LayoutWrapper>} />

            <Route path="/clients" element={<LayoutWrapper><ClientListPage /></LayoutWrapper>} />
            <Route path="/conversations" element={<LayoutWrapper><ConversationHubPage /></LayoutWrapper>} /> {/* Conversation Hub */}
            <Route path="/team-chat" element={<LayoutWrapper><TeamChatPage /></LayoutWrapper>} /> {/* New Route */}
            <Route path="/knowledge-base" element={<LayoutWrapper><KnowledgeBaseDashboardPage /></LayoutWrapper>} /> {/* Added Knowledge Base Route */}
            <Route path="/calendar" element={<LayoutWrapper><CalendarPage /></LayoutWrapper>} /> {/* Added Calendar Route */}
            <Route path="/landing-pages" element={<LayoutWrapper><LandingPageDashboard /></LayoutWrapper>} /> {/* Added Landing Pages Route */}
            <Route path="/entreprise" element={<LayoutWrapper><Entreprise /></LayoutWrapper>} />
             {/* Default redirect for unknown paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider><AppRoutes /></AuthProvider>
            
        </Router>
    );
}

export default App
