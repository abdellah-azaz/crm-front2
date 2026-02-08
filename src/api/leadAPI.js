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
  }
};