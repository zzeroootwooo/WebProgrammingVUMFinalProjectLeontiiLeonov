import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaParking, FaSpa } from 'react-icons/fa';
import { Container, Card, Button, Input, Checkbox, Alert, Grid, Modal } from '../../components/ui';
import api from '../../services/api';
import { reservationService } from '../../services/reservationService';
import './SearchRooms.css';

function SearchRooms() {
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    freeParking: false,
    wellnessCenter: false,
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingDialog, setBookingDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = async () => {
    if (!searchParams.checkIn || !searchParams.checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/rooms/availability', {
        params: {
          checkIn: searchParams.checkIn,
          checkOut: searchParams.checkOut,
          guests: searchParams.guests,
          freeParking: searchParams.freeParking || undefined,
          wellnessCenter: searchParams.wellnessCenter || undefined,
        }
      });
      setRooms(response.data.rooms || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load available rooms');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (room) => {
    setSelectedRoom(room);
    setBookingDialog(true);
  };

  const confirmBooking = async () => {
    setBookingLoading(true);
    try {
      await reservationService.createReservation({
        roomId: selectedRoom.id,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        guests: searchParams.guests,
      });
      setBookingDialog(false);
      setError('');
      alert('Reservation created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reservation');
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateNights = () => {
    if (!searchParams.checkIn || !searchParams.checkOut) return 0;
    const start = new Date(searchParams.checkIn);
    const end = new Date(searchParams.checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const calculateTotal = (pricePerNight) => {
    const nights = calculateNights();
    return nights * pricePerNight;
  };

  return (
    <Container>
      <motion.div
        className="search-rooms-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="page-title">Search Available Rooms</h1>

        {error && (
          <Alert type="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Card variant="glass" className="search-card">
          <Card.Body>
            <Grid cols={4} gap={3}>
              <Input
                label="Check-in"
                type="date"
                name="checkIn"
                value={searchParams.checkIn}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <Input
                label="Check-out"
                type="date"
                name="checkOut"
                value={searchParams.checkOut}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <Input
                label="Guests"
                type="number"
                name="guests"
                value={searchParams.guests}
                onChange={handleInputChange}
                fullWidth
                min="1"
              />
              <div className="checkbox-group">
                <Checkbox
                  label="Free Parking"
                  name="freeParking"
                  checked={searchParams.freeParking}
                  onChange={handleInputChange}
                />
                <Checkbox
                  label="Wellness Center"
                  name="wellnessCenter"
                  checked={searchParams.wellnessCenter}
                  onChange={handleInputChange}
                />
              </div>
            </Grid>
            <div className="search-button-container">
              <Button
                variant="primary"
                size="lg"
                icon={<FaSearch />}
                onClick={handleSearch}
                disabled={!searchParams.checkIn || !searchParams.checkOut}
              >
                Search Rooms
              </Button>
            </div>
          </Card.Body>
        </Card>

        {loading ? (
          <div className="loading-state">
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
          </div>
        ) : rooms.length > 0 ? (
          <Grid cols={3} gap={4} className="results-grid">
            {rooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glass" hoverable>
                  <Card.Body>
                    <h3 className="room-name">{room.name}</h3>
                    <p className="room-type">{room.type}</p>
                    <div className="location-info">
                      <p className="location-name">{room.location.name}</p>
                      <p className="location-city">{room.location.city}</p>
                    </div>
                    <div className="room-details">
                      <p><strong>Capacity:</strong> {room.capacity} guests</p>
                      <p><strong>Rating:</strong> ⭐ {room.location.rating}</p>
                      <p><strong>Price:</strong> ${room.pricePerNight}/night</p>
                    </div>
                    <div className="location-amenities">
                      {room.location.hasFreeParking && (
                        <span className="amenity"><FaParking /> Parking</span>
                      )}
                      {room.location.hasWellnessCenter && (
                        <span className="amenity"><FaSpa /> Wellness</span>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => handleBooking(room)}
                    >
                      Book Now - ${calculateTotal(room.pricePerNight)}
                    </Button>
                  </Card.Footer>
                </Card>
              </motion.div>
            ))}
          </Grid>
        ) : searchParams.checkIn && searchParams.checkOut && !loading ? (
          <Card variant="glass">
            <Card.Body>
              <p className="empty-state">
                No available rooms found for the selected dates. Try different dates or change the number of guests.
              </p>
            </Card.Body>
          </Card>
        ) : null}

        <Modal
          isOpen={bookingDialog}
          onClose={() => setBookingDialog(false)}
          title="Confirm Booking"
          size="md"
          footer={
            <>
              <Button variant="ghost" onClick={() => setBookingDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmBooking}
                loading={bookingLoading}
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </>
          }
        >
          {selectedRoom && (
            <div className="booking-details">
              <h4>{selectedRoom.name}</h4>
              <p className="room-type-modal">{selectedRoom.type}</p>
              <div className="booking-info">
                <p><strong>Location:</strong> {selectedRoom.location.name}, {selectedRoom.location.city}</p>
                <p><strong>Check-in:</strong> {searchParams.checkIn}</p>
                <p><strong>Check-out:</strong> {searchParams.checkOut}</p>
                <p><strong>Nights:</strong> {calculateNights()}</p>
                <p><strong>Guests:</strong> {searchParams.guests}</p>
              </div>
              <p className="total-price">
                <strong>Total Price:</strong> ${calculateTotal(selectedRoom.pricePerNight)}
              </p>
            </div>
          )}
        </Modal>
      </motion.div>
    </Container>
  );
}

export default SearchRooms;
