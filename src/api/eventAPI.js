import axiosInstance from './axiosConfig';

const API_PATH = '/events';

/**
 * Crée un nouvel événement.
 * @param {object} eventData - Les données de l'événement (title, start, end, description, allDay).
 * @returns {Promise<object>} L'événement créé.
 */
export const createEvent = async (eventData) => {
  try {
    const response = await axiosInstance.post(API_PATH, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Récupère tous les événements de l'utilisateur.
 * @returns {Promise<Array<object>>} La liste des événements.
 */
export const getAllEvents = async () => {
  try {
    const response = await axiosInstance.get(API_PATH);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
