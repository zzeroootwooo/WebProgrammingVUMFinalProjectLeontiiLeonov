import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { reservationService } from '../services/reservationService';

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
        <Box sx={{ my: 4 }}>
          <Typography>Loading reservations...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Reservations
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {reservations.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            You don't have any reservations yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {reservations.map((reservation) => (
              <Grid item xs={12} md={6} key={reservation.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">{reservation.roomName}</Typography>
                      <Chip
                        label={reservation.status}
                        color={reservation.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>

                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {reservation.locationName}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {reservation.locationCity}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Room Type:</strong> {reservation.roomType}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Check-in:</strong> {reservation.checkIn}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Check-out:</strong> {reservation.checkOut}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Guests:</strong> {reservation.guests}
                      </Typography>
                    </Box>

                    {reservation.status === 'active' && (
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleCancelClick(reservation)}
                        >
                          Cancel Reservation
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
        <DialogTitle>Cancel Reservation</DialogTitle>
        <DialogContent>
          {selectedReservation && (
            <Typography>
              Are you sure you want to cancel your reservation for {selectedReservation.roomName} at{' '}
              {selectedReservation.locationName}?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)} disabled={cancelLoading}>
            No, Keep It
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            color="error"
            disabled={cancelLoading}
          >
            {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyReservations;
