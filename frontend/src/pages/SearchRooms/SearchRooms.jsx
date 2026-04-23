import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaParking, FaSpa } from 'react-icons/fa';
import { Container, Card, Button, Input, Checkbox, Alert, Grid, Modal } from '../../components/ui';
import { locationService } from '../../services/locationService';
import { reservationService } from '../../services/reservationService';
import './SearchRooms.css';

function SearchRooms() {
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    hotelName: '',
    city: '',
    minRating: '',
    freeParking: false,
    wellnessCenter: false,
  });
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingDialog, setBookingDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await locationService.getAllLocations();
      setLocations(data.locations || []);
      setFilteredLocations(data.locations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name) => {
    setSearchParams((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSearch = () => {
    let filtered = [...locations];

    if (searchParams.hotelName) {
      filtered = filtered.filter((loc) =>
        loc.name.toLowerCase().includes(searchParams.hotelName.toLowerCase())
      );
    }

    if (searchParams.city) {
      filtered = filtered.filter((loc) =>
        loc.city.toLowerCase().includes(searchParams.city.toLowerCase())
      );
    }

    if (searchParams.minRating) {
      filtered = filtered.filter((loc) => loc.rating >= parseFloat(searchParams.minRating));
    }

    if (searchParams.freeParking) {
      filtered = filtered.filter((loc) => loc.freeParking);
    }

    if (searchParams.wellnessCenter) {
      filtered = filtered.filter((loc) => loc.wellnessCenter);
    }

    setFilteredLocations(filtered);
  };

  const handleBooking = (location) => {
    setSelectedLocation(location);
    setBookingDialog(true);
  };

  const confirmBooking = async () => {
    if (!searchParams.checkIn || !searchParams.checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    setBookingLoading(true);
    try {
      await reservationService.createReservation({
        locationId: selectedLocation.id,
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

  return (
    <Container>
      <motion.div
        className="search-rooms-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="page-title">Search Rooms</h1>

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
              />
              <Input
                label="Check-out"
                type="date"
                name="checkOut"
                value={searchParams.checkOut}
                onChange={handleInputChange}
                fullWidth
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
              <Input
                label="Hotel Name"
                type="text"
                name="hotelName"
                value={searchParams.hotelName}
                onChange={handleInputChange}
                placeholder="Search by name"
                fullWidth
              />
              <Input
                label="City"
                type="text"
                name="city"
                value={searchParams.city}
                onChange={handleInputChange}
                placeholder="Search by city"
                fullWidth
              />
              <Input
                label="Min Rating"
                type="number"
                name="minRating"
                value={searchParams.minRating}
                onChange={handleInputChange}
                placeholder="0-5"
                fullWidth
                min="0"
                max="5"
                step="0.1"
              />
              <div className="checkbox-group">
                <Checkbox
                  label="Free Parking"
                  checked={searchParams.freeParking}
                  onChange={() => handleCheckboxChange('freeParking')}
                />
                <Checkbox
                  label="Wellness Center"
                  checked={searchParams.wellnessCenter}
                  onChange={() => handleCheckboxChange('wellnessCenter')}
                />
              </div>
              <div className="search-button-wrapper">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<FaSearch />}
                  onClick={handleSearch}
                  fullWidth
                >
                  Search
                </Button>
              </div>
            </Grid>
          </Card.Body>
        </Card>

        {loading ? (
          <div className="loading-state">
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
          </div>
        ) : (
          <Grid cols={3} gap={4} className="results-grid">
            {filteredLocations.map((location) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glass" hoverable>
                  <Card.Body>
                    <h3 className="location-name">{location.name}</h3>
                    <p className="location-city">{location.city}</p>
                    <div className="location-details">
                      <p><strong>Rating:</strong> ⭐ {location.rating}</p>
                      <p><strong>Price:</strong> ${location.pricePerNight}/night</p>
                    </div>
                    <div className="location-amenities">
                      {location.freeParking && (
                        <span className="amenity"><FaParking /> Parking</span>
                      )}
                      {location.wellnessCenter && (
                        <span className="amenity"><FaSpa /> Wellness</span>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => handleBooking(location)}
                    >
                      Book Now
                    </Button>
                  </Card.Footer>
                </Card>
              </motion.div>
            ))}
          </Grid>
        )}

        {!loading && filteredLocations.length === 0 && (
          <Card variant="glass">
            <Card.Body>
              <p className="empty-state">No rooms found matching your criteria.</p>
            </Card.Body>
          </Card>
        )}

        <Modal
          isOpen={bookingDialog}
          onClose={() => setBookingDialog(false)}
          title="Confirm Booking"
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
          {selectedLocation && (
            <div className="booking-details">
              <h4>{selectedLocation.name}</h4>
              <p><strong>City:</strong> {selectedLocation.city}</p>
              <p><strong>Check-in:</strong> {searchParams.checkIn}</p>
              <p><strong>Check-out:</strong> {searchParams.checkOut}</p>
              <p><strong>Guests:</strong> {searchParams.guests}</p>
              <p className="total-price">
                <strong>Total:</strong> ${selectedLocation.pricePerNight} x nights
              </p>
            </div>
          )}
        </Modal>
      </motion.div>
    </Container>
  );
}

export default SearchRooms;
