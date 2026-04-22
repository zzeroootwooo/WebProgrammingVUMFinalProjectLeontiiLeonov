import api from './api';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },

  getAllReservations: async () => {
    const response = await api.get('/api/admin/reservations');
    return response.data;
  },

  getLocations: async () => {
    const response = await api.get('/api/admin/locations');
    return response.data;
  },

  createLocation: async (locationData) => {
    const response = await api.post('/api/admin/locations', locationData);
    return response.data;
  },

  updateLocation: async (locationId, locationData) => {
    const response = await api.put(`/api/admin/locations/${locationId}`, locationData);
    return response.data;
  },

  deleteLocation: async (locationId) => {
    const response = await api.delete(`/api/admin/locations/${locationId}`);
    return response.data;
  },
};
