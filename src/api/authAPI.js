import axiosInstance from './axiosConfig';

export const authAPI = {
  // Login - POST vers /login (votre endpoint Spring)
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    
    // ✅ STOCKER les tokens dans le localStorage ici
    if (response.data.access_token && response.data.refresh_token) {
      localStorage.setItem('access_token', response.data.tokens.accessToken);
      localStorage.setItem('refresh_token', response.data.tokens.refreshToken);
      
      // Stocker également les infos utilisateur si disponibles
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  },
  
  // Register - Adaptez l'URL selon votre backend
  register: (userData) => 
    axiosInstance.post('/users', userData),
  
  // Logout (juste nettoyer le localStorage)
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
  
  // Récupérer l'utilisateur courant
  getCurrentUser: () => 
    axiosInstance.get('/users/me'),
  
  // Rafraîchir le token (nouvelle méthode)
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axiosInstance.post('/refresh-token', {
      refresh_token: refreshToken
    });
    
    if (response.data.tokens.accessToken) {
      localStorage.setItem('access_token', response.data.tokens.accessToken);
      // Stocker le nouveau refresh token s'il est renvoyé
      if (response.data.tokens.refreshToken) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
    }
    
    return response;
  }
};