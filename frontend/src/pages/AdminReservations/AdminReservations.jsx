import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Card, Alert, Badge, Grid, Button, Modal } from '../../components/ui';
import api from '../../services/api';
import './AdminReservations.css';

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/reservations');
      setReservations(response.data.reservations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (reservation) => {
    setSelectedReservation(reservation);
    setCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    setCancelLoading(true);
    try {
      await api.delete(`/api/reservations/${selectedReservation.id}`);
      setCancelDialog(false);
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel reservation');
      setCancelDialog(false);
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="loading-state">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <motion.div
        className="admin-reservations-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="page-title">All Reservations</h1>

        {error && (
          <Alert type="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {reservations.length === 0 ? (
          <Card variant="glass">
            <Card.Body>
              <p className="empty-state">No reservations found.</p>
            </Card.Body>
          </Card>
        ) : (
          <div className="reservations-table-wrapper">
            <Card variant="glass">
              <Card.Body>
                <div className="table-container">
                  <table className="reservations-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Guest</th>
                        <th>Room</th>
                        <th>Location</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Guests</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((reservation) => (
                        <motion.tr
                          key={reservation.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td>{reservation.id}</td>
                          <td>
                            <div className="guest-info">
                              <div className="guest-name">{reservation.guestName}</div>
                              <div className="guest-email">{reservation.guestEmail}</div>
                            </div>
                          </td>
                          <td>
                            <div className="room-info">
                              <div className="room-name">{reservation.roomName}</div>
                              <div className="room-type">{reservation.roomType}</div>
                            </div>
                          </td>
                          <td>
                            <div className="location-info">
                              <div>{reservation.locationName}</div>
                              <div className="location-city">{reservation.locationCity}</div>
                            </div>
                          </td>
                          <td>{reservation.checkIn}</td>
                          <td>{reservation.checkOut}</td>
                          <td>{reservation.guests}</td>
                          <td className="price-cell">${reservation.totalPrice}</td>
                          <td>
                            <Badge variant={reservation.status === 'active' ? 'success' : 'default'}>
                              {reservation.status}
                            </Badge>
                          </td>
                          <td>
                            {reservation.status === 'active' && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleCancelClick(reservation)}
                              >
                                Cancel
                              </Button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        <Modal
          isOpen={cancelDialog}
          onClose={() => setCancelDialog(false)}
          title="Cancel Reservation"
          footer={
            <>
              <Button variant="ghost" onClick={() => setCancelDialog(false)}>
                Keep Reservation
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmCancel}
                loading={cancelLoading}
                disabled={cancelLoading}
              >
                {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
              </Button>
            </>
          }
        >
          <p>Are you sure you want to cancel this reservation?</p>
          {selectedReservation && (
            <div className="cancel-dialog-details">
              <p><strong>Guest:</strong> {selectedReservation.guestName} ({selectedReservation.guestEmail})</p>
              <p><strong>Room:</strong> {selectedReservation.roomName}</p>
              <p><strong>Dates:</strong> {selectedReservation.checkIn} - {selectedReservation.checkOut}</p>
            </div>
          )}
        </Modal>
      </motion.div>
    </Container>
  );
}

export default AdminReservations;
