import api from './api';

export const locationService = {
  getLocations: async (filters = {}) => {
    const response = await api.get('/api/locations', { params: filters });
    return response.data;
  },

  searchRooms: async (searchParams) => {
    const response = await api.get('/api/rooms/availability', { params: searchParams });
    return response.data;
  },
};
