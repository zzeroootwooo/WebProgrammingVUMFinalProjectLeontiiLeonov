import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Card, Button, Alert, Badge, Grid, Modal } from '../components/ui';
import { reservationService } from '../services/reservationService';
import './MyReservations.css';

function MyReservations() {
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
      const data = await reservationService.getMyReservations();
      setReservations(data.reservations || []);
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
      await reservationService.cancelReservation(selectedReservation.id);
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
        className="my-reservations-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="page-title">My Reservations</h1>

        {error && (
          <Alert type="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {reservations.length === 0 ? (
          <Card variant="glass">
            <Card.Body>
              <p className="empty-state">You don't have any reservations yet.</p>
            </Card.Body>
          </Card>
        ) : (
          <Grid cols={2} gap={4}>
            {reservations.map((reservation) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glass" hoverable>
                  <Card.Body>
                    <div className="reservation-header">
                      <h3>{reservation.roomName}</h3>
                      <Badge variant={reservation.status === 'active' ? 'success' : 'default'}>
                        {reservation.status}
                      </Badge>
                    </div>
                    <div className="reservation-details">
                      <p><strong>Check-in:</strong> {reservation.checkIn}</p>
                      <p><strong>Check-out:</strong> {reservation.checkOut}</p>
                      <p><strong>Guests:</strong> {reservation.guests}</p>
                      <p><strong>Total Price:</strong> ${reservation.totalPrice}</p>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    {reservation.status === 'active' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelClick(reservation)}
                      >
                        Cancel Reservation
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              </motion.div>
            ))}
          </Grid>
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
              <p><strong>Room:</strong> {selectedReservation.roomName}</p>
              <p><strong>Dates:</strong> {selectedReservation.checkIn} - {selectedReservation.checkOut}</p>
            </div>
          )}
        </Modal>
      </motion.div>
    </Container>
  );
}

export default MyReservations;
