import api from './api';

export const reservationService = {
  createReservation: async (reservationData) => {
    const response = await api.post('/api/reservations', reservationData);
    return response.data;
  },

  getMyReservations: async () => {
    const response = await api.get('/api/reservations/me');
    return response.data;
  },

  cancelReservation: async (reservationId) => {
    const response = await api.delete(`/api/reservations/${reservationId}`);
    return response.data;
  },
};
