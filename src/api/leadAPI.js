import axiosInstance from './axiosConfig';

export const leadAPI = {
  createLead: async (leadData) => {
    try {
      const response = await axiosInstance.post('/leads', leadData);
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  getAllLeads: async () => {
    try {
      // Pas besoin de passer userId car il vient du token JWT
      const response = await axiosInstance.get('/leads');
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  deleteLead: async (leadId) => {
    try {
      const response = await axiosInstance.delete(`/leads/${leadId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }

};