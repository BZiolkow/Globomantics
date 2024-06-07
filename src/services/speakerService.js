import axios from 'axios';

export const speakerService = {
  getSpeakerById: async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/speakers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching speaker with ID ${id}:`, error);
      throw error;
    }
  }
};