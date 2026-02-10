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
 * Ajoute un stage à un pipeline
 * @param {string} pipelineName - Nom du pipeline
 * @param {string} stageName - Nom du stage
 * @returns {Promise<Object>} Pipeline mis à jour
 */
addStage: async (pipelineName, stageName) => {
  try {
    // Encoder le nom du pipeline pour gérer les caractères spéciaux
    const encodedPipelineName = encodeURIComponent(pipelineName);
    
    const response = await axiosInstance.post(
      `/pipelines/${encodedPipelineName}/stages`,
      { stageName }  // Envoyer comme objet avec la propriété stageName
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding stage "${stageName}" to pipeline "${pipelineName}":`, error);
    throw error;
  }
},

/**
 * Ajoute un lead à un stage d'un pipeline
 * @param {string} pipelineName - Nom du pipeline
 * @param {string} stageName - Nom du stage
 * @param {Object} leadData - Données du lead à ajouter
 * @returns {Promise<Object>} Pipeline mis à jour
 */

/**
 * Déplace un lead d'un stage vers un autre dans un pipeline
 * @param {string} pipelineName - Nom du pipeline
 * @param {string} leadEmail - Email du lead à déplacer
 * @param {string} fromStageName - Nom du stage source
 * @param {string} toStageName - Nom du stage destination
 * @returns {Promise<Object>} Pipeline mis à jour
 */
moveLeadBetweenStages: async (pipelineName, leadEmail, fromStageName, toStageName) => {
  try {
    // Encoder le nom du pipeline pour gérer les caractères spéciaux
    const encodedPipelineName = encodeURIComponent(pipelineName);
    
    const response = await axiosInstance.patch(
      `/pipelines/${encodedPipelineName}/move-lead`,
      { 
        leadEmail, 
        fromStageName, 
        toStageName 
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error moving lead "${leadEmail}" from "${fromStageName}" to "${toStageName}" in pipeline "${pipelineName}":`, error);
    throw error;
  }
},



addLeadToStage: async (pipelineName, stageName, leadData) => {
  try {
    // Encoder les noms pour gérer les caractères spéciaux
    const encodedPipelineName = encodeURIComponent(pipelineName);
    const encodedStageName = encodeURIComponent(stageName);
    
    const response = await axiosInstance.post(
      `/pipelines/${encodedPipelineName}/stages/${encodedStageName}/leads`,
      leadData
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding lead to stage "${stageName}" in pipeline "${pipelineName}":`, error);
    throw error;
  }
},

  deleteStage: async (pipelineName, stageName) => {
    try {
      // Encoder les paramètres pour gérer les caractères spéciaux
      const encodedPipelineName = encodeURIComponent(pipelineName);
      const encodedStageName = encodeURIComponent(stageName);
      
      const response = await axiosInstance.delete(
        `/pipelines/${encodedPipelineName}/stages/${encodedStageName}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting stage "${stageName}" from pipeline "${pipelineName}":`, error);
      throw error;
    }
  },
};

export default pipelineAPI;