import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  FormControlLabel,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { locationService } from '../services/locationService';
import { reservationService } from '../services/reservationService';
import { useAuth } from '../context/AuthContext';

function SearchRooms() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    search: '',
    city: '',
    rating: '',
    freeParking: false,
    wellnessCenter: false,
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    if (!searchParams.checkIn || !searchParams.checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (searchParams.checkIn >= searchParams.checkOut) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setLoading(true);
    try {
      const data = await locationService.searchRooms(searchParams);
      setRooms(data.rooms || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (room) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedRoom(room);
    setBookingDialog(true);
  };

  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    try {
      await reservationService.createReservation({
        roomId: selectedRoom.id,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        guests: parseInt(searchParams.guests),
      });
      setBookingDialog(false);
      navigate('/my-reservations');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reservation');
      setBookingDialog(false);
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateNights = () => {
    if (searchParams.checkIn && searchParams.checkOut) {
      const start = new Date(searchParams.checkIn);
      const end = new Date(searchParams.checkOut);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const getTotalPrice = (pricePerNight) => {
    return pricePerNight * calculateNights();
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Available Rooms
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Check-in"
                type="date"
                name="checkIn"
                value={searchParams.checkIn}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Check-out"
                type="date"
                name="checkOut"
                value={searchParams.checkOut}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Guests"
                type="number"
                name="guests"
                value={searchParams.guests}
                onChange={handleChange}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Hotel Name"
                name="search"
                value={searchParams.search}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={searchParams.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Min Rating"
                type="number"
                name="rating"
                value={searchParams.rating}
                onChange={handleChange}
                inputProps={{ min: 0, max: 5, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="freeParking"
                    checked={searchParams.freeParking}
                    onChange={handleChange}
                  />
                }
                label="Free Parking"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="wellnessCenter"
                    checked={searchParams.wellnessCenter}
                    onChange={handleChange}
                  />
                }
                label="Wellness Center"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {rooms.length === 0 && !loading && (
          <Typography variant="body1" color="text.secondary">
            No rooms found. Try adjusting your search criteria.
          </Typography>
        )}

        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} md={6} key={room.id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {room.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {room.location.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {room.location.city}, {room.location.address}
                  </Typography>
                  <Box sx={{ my: 2 }}>
                    <Chip label={`${room.type}`} size="small" sx={{ mr: 1 }} />
                    <Chip label={`Capacity: ${room.capacity}`} size="small" sx={{ mr: 1 }} />
                    <Chip label={`Rating: ${room.location.rating}`} size="small" color="primary" />
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    {room.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {room.location.hasFreeParking && (
                      <Chip label="Free Parking" size="small" sx={{ mr: 1, mb: 1 }} />
                    )}
                    {room.location.hasWellnessCenter && (
                      <Chip label="Wellness Center" size="small" sx={{ mr: 1, mb: 1 }} />
                    )}
                  </Box>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    ${room.pricePerNight} / night
                  </Typography>
                  {calculateNights() > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Total: ${getTotalPrice(room.pricePerNight)} for {calculateNights()}{' '}
                      {calculateNights() === 1 ? 'night' : 'nights'}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleBookRoom(room)}
                  >
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          {selectedRoom && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Room:</strong> {selectedRoom.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Hotel:</strong> {selectedRoom.location.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Check-in:</strong> {searchParams.checkIn}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Check-out:</strong> {searchParams.checkOut}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Guests:</strong> {searchParams.guests}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                <strong>Total Price:</strong> ${getTotalPrice(selectedRoom.pricePerNight)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(false)} disabled={bookingLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirmBooking} variant="contained" disabled={bookingLoading}>
            {bookingLoading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SearchRooms;
