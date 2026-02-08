import axiosInstance from "./axiosConfig";

const pipelineAPI = {
  /**
   * Crée un nouveau pipeline
   * @param {Object} pipelineData - Données du pipeline
   * @param {string} pipelineData.name - Nom du pipeline
   * @param {string[]} pipelineData.stageNames - Noms des stages
   * @param {string[]} pipelineData.leadIds - IDs des leads
   * @returns {Promise<Object>} Réponse du serveur
   */
  createPipeline: async (pipelineData) => {
    try {
      const response = await axiosInstance.post('/pipelines', pipelineData);
      return response.data;
    } catch (error) {
      console.error('Error creating pipeline:', error);
      throw error;
    }
  },

  /**
   * Récupère tous les pipelines de l'utilisateur
   * @returns {Promise<Array>} Liste des pipelines
   */
  getAllPipelines: async () => {
    try {
      const response = await axiosInstance.get('/pipelines');
      return response.data;
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      throw error;
    }
  },

  /**
   * Récupère un pipeline spécifique
   * @param {string} pipelineId - ID du pipeline
   * @returns {Promise<Object>} Pipeline
   */
  getPipelineById: async (pipelineId) => {
    try {
      const response = await axiosInstance.get(`/pipelines/${pipelineId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pipeline ${pipelineId}:`, error);
      throw error;
    }
  },

  /**
   * Met à jour un pipeline
   * @param {string} pipelineId - ID du pipeline
   * @param {Object} updateData - Données de mise à jour
   * @param {string} updateData.name - Nouveau nom du pipeline
   * @returns {Promise<Object>} Pipeline mis à jour
   */
  updatePipeline: async (pipelineId, updateData) => {
    try {
      const response = await axiosInstance.put(`/pipelines/${pipelineId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating pipeline ${pipelineId}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un pipeline
   * @param {string} pipelineId - ID du pipeline
   * @returns {Promise<Object>} Résultat de la suppression
   */
  deletePipeline: async (pipelineId) => {
    try {
      const response = await axiosInstance.delete(`/pipelines/${pipelineId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting pipeline ${pipelineId}:`, error);
      throw error;
    }
  },

  /**
   * Ajoute un stage à un pipeline
   * @param {string} pipelineId - ID du pipeline
   * @param {Object} stageData - Données du stage
   * @param {string} stageData.name - Nom du stage
   * @param {string[]} stageData.leadIds - IDs des leads
   * @returns {Promise<Object>} Pipeline mis à jour
   */
  addStage: async (pipelineId, stageData) => {
    try {
      const response = await axiosInstance.post(`/pipelines/${pipelineId}/stages`, stageData);
      return response.data;
    } catch (error) {
      console.error(`Error adding stage to pipeline ${pipelineId}:`, error);
      throw error;
    }
  },

  /**
   * Met à jour un stage
   * @param {string} pipelineId - ID du pipeline
   * @param {string} stageId - ID du stage
   * @param {Object} updateData - Données de mise à jour
   * @param {string} updateData.name - Nouveau nom du stage
   * @param {string[]} updateData.leadIds - Nouveaux IDs des leads
   * @returns {Promise<Object>} Pipeline mis à jour
   */
  updateStage: async (pipelineId, stageId, updateData) => {
    try {
      const response = await axiosInstance.put(`/pipelines/${pipelineId}/stages/${stageId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating stage ${stageId} in pipeline ${pipelineId}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un stage
   * @param {string} pipelineId - ID du pipeline
   * @param {string} stageId - ID du stage
   * @returns {Promise<Object>} Pipeline mis à jour
   */
  deleteStage: async (pipelineId, stageId) => {
    try {
      const response = await axiosInstance.delete(`/pipelines/${pipelineId}/stages/${stageId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting stage ${stageId} from pipeline ${pipelineId}:`, error);
      throw error;
    }
  },
};

export default pipelineAPI;