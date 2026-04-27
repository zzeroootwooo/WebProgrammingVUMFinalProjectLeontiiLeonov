import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaHotel, FaDoorOpen } from 'react-icons/fa';
import { Container, Card, Button, Alert, Modal, Input, Checkbox, Badge, Select } from '../../components/ui';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';
import './AdminLocations.css';

function AdminLocations() {
  const [activeTab, setActiveTab] = useState('locations'); // 'locations' or 'rooms'
  const [locations, setLocations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationDialog, setLocationDialog] = useState(false);
  const [roomDialog, setRoomDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const locationsResponse = await api.get('/api/admin/locations');
      setLocations(locationsResponse.data.locations || []);

      if (activeTab === 'locations') {
        setRooms([]);
      } else {
        const response = await api.get('/api/admin/rooms');
        setRooms(response.data.rooms || []);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load data.'));
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddLocation = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      city: '',
      address: '',
      description: '',
      rating: 4.5,
      hasFreeParking: true,
      hasWellnessCenter: false,
      imageUrl: '',
    });
    setFormError('');
    setValidationErrors({});
    setLocationDialog(true);
  };

  const handleEditLocation = (location) => {
    setSelectedItem(location);
    setFormData({ ...location });
    setFormError('');
    setValidationErrors({});
    setLocationDialog(true);
  };

  const handleAddRoom = () => {
    setSelectedItem(null);
    setFormData({
      locationId: locations[0]?.id || '',
      name: '',
      type: 'Standard',
      capacity: 2,
      pricePerNight: 100,
      description: '',
      imageUrl: '',
    });
    setFormError('');
    setValidationErrors({});
    setRoomDialog(true);
  };

  const handleEditRoom = (room) => {
    setSelectedItem(room);
    setFormData({
      locationId: room.locationId,
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      pricePerNight: room.pricePerNight,
      description: room.description,
      imageUrl: room.imageUrl || '',
    });
    setFormError('');
    setValidationErrors({});
    setRoomDialog(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteDialog(true);
  };

  const validateLocationForm = () => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = 'Name is required.';
    }
    if (!formData.city?.trim()) {
      errors.city = 'City is required.';
    }
    if (!formData.address?.trim()) {
      errors.address = 'Address is required.';
    }
    if (!formData.description?.trim()) {
      errors.description = 'Description is required.';
    }
    if (formData.rating === '' || formData.rating === undefined || formData.rating === null) {
      errors.rating = 'Rating is required.';
    } else if (Number(formData.rating) < 1 || Number(formData.rating) > 5) {
      errors.rating = 'Rating must be between 1 and 5.';
    }

    return errors;
  };

  const validateRoomForm = () => {
    const errors = {};

    if (!formData.locationId) {
      errors.locationId = 'Location is required.';
    }
    if (!formData.name?.trim()) {
      errors.name = 'Room name is required.';
    }
    if (!formData.type?.trim()) {
      errors.type = 'Room type is required.';
    }
    if (formData.capacity === '' || formData.capacity === undefined || formData.capacity === null) {
      errors.capacity = 'Capacity is required.';
    } else if (Number(formData.capacity) < 1) {
      errors.capacity = 'Capacity must be at least 1.';
    }
    if (formData.pricePerNight === '' || formData.pricePerNight === undefined || formData.pricePerNight === null) {
      errors.pricePerNight = 'Price per night is required.';
    } else if (Number(formData.pricePerNight) <= 0) {
      errors.pricePerNight = 'Price per night must be greater than 0.';
    }
    if (!formData.description?.trim()) {
      errors.description = 'Description is required.';
    }

    return errors;
  };

  const handleSaveLocation = async () => {
    const errors = validateLocationForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setFormError('');
      return;
    }

    setValidationErrors({});
    setFormError('');
    setFormLoading(true);
    try {
      if (selectedItem) {
        await api.put(`/api/admin/locations/${selectedItem.id}`, formData);
      } else {
        await api.post('/api/admin/locations', formData);
      }
      setLocationDialog(false);
      fetchData();
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Failed to save location.'));
    } finally {
      setFormLoading(false);
    }
  };

  const handleSaveRoom = async () => {
    const errors = validateRoomForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setFormError('');
      return;
    }

    setValidationErrors({});
    setFormError('');
    setFormLoading(true);
    try {
      if (selectedItem) {
        await api.put(`/api/admin/rooms/${selectedItem.id}`, formData);
      } else {
        await api.post('/api/admin/rooms', formData);
      }
      setRoomDialog(false);
      fetchData();
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Failed to save room.'));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      const endpoint = activeTab === 'locations'
        ? `/api/admin/locations/${selectedItem.id}`
        : `/api/admin/rooms/${selectedItem.id}`;
      await api.delete(endpoint);
      setDeleteDialog(false);
      fetchData();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete item.'));
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setFormError('');
    setValidationErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  return (
    <Container>
      <motion.div
        className="admin-locations-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="page-header">
          <h1 className="page-title">Manage Locations & Rooms</h1>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'locations' ? 'active' : ''}`}
              onClick={() => setActiveTab('locations')}
            >
              <FaHotel /> Locations
            </button>
            <button
              className={`tab ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              <FaDoorOpen /> Rooms
            </button>
          </div>
        </div>

        {error && (
          <Alert type="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <div className="actions-bar">
          <Button
            variant="primary"
            icon={<FaPlus />}
            onClick={activeTab === 'locations' ? handleAddLocation : handleAddRoom}
          >
            Add {activeTab === 'locations' ? 'Location' : 'Room'}
          </Button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
          </div>
        ) : activeTab === 'locations' ? (
          <div className="locations-grid">
            {locations.map((location) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glass" hoverable>
                  <Card.Body>
                    <h3 className="item-name">{location.name}</h3>
                    <p className="item-subtitle">{location.city}</p>
                    <div className="item-details">
                      <p><strong>Address:</strong> {location.address}</p>
                      <p><strong>Rating:</strong> ⭐ {location.rating}</p>
                      <div className="item-amenities">
                        {location.hasFreeParking && <Badge>Free Parking</Badge>}
                        {location.hasWellnessCenter && <Badge>Wellness Center</Badge>}
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <div className="item-actions">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<FaEdit />}
                        onClick={() => handleEditLocation(location)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<FaTrash />}
                        onClick={() => handleDeleteClick(location)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rooms-grid">
            {rooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glass" hoverable>
                  <Card.Body>
                    <h3 className="item-name">{room.name}</h3>
                    <p className="item-subtitle">{room.type}</p>
                    <div className="item-details">
                      <p><strong>Location:</strong> {room.location.name}</p>
                      <p><strong>Capacity:</strong> {room.capacity} guests</p>
                      <p><strong>Price:</strong> ${room.pricePerNight}/night</p>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <div className="item-actions">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<FaEdit />}
                        onClick={() => handleEditRoom(room)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<FaTrash />}
                        onClick={() => handleDeleteClick(room)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Location Form Dialog */}
        <Modal
          isOpen={locationDialog}
          onClose={() => setLocationDialog(false)}
          title={selectedItem ? 'Edit Location' : 'Add Location'}
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => setLocationDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveLocation}
                loading={formLoading}
                disabled={formLoading}
              >
                {formLoading ? 'Saving...' : 'Save Location'}
              </Button>
            </>
          }
        >
          {formError && (
            <Alert type="warning" onClose={() => setFormError('')}>
              {formError}
            </Alert>
          )}
          <div className="form-grid">
            <Input
              label="Name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              error={validationErrors.name}
              fullWidth
              required
            />
            <Input
              label="City"
              name="city"
              value={formData.city || ''}
              onChange={handleInputChange}
              error={validationErrors.city}
              fullWidth
              required
            />
            <Input
              label="Address"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              error={validationErrors.address}
              fullWidth
              required
            />
            <Input
              label="Rating (1-5)"
              type="number"
              name="rating"
              value={formData.rating || ''}
              onChange={handleInputChange}
              error={validationErrors.rating}
              min="1"
              max="5"
              step="0.1"
              fullWidth
              required
            />
            <Input
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <Input
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              error={validationErrors.description}
              fullWidth
              required
            />
            <div className="checkbox-group">
              <Checkbox
                label="Free Parking"
                name="hasFreeParking"
                checked={formData.hasFreeParking || false}
                onChange={handleInputChange}
              />
              <Checkbox
                label="Wellness Center"
                name="hasWellnessCenter"
                checked={formData.hasWellnessCenter || false}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </Modal>

        {/* Room Form Dialog */}
        <Modal
          isOpen={roomDialog}
          onClose={() => setRoomDialog(false)}
          title={selectedItem ? 'Edit Room' : 'Add Room'}
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => setRoomDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveRoom}
                loading={formLoading}
                disabled={formLoading}
              >
                {formLoading ? 'Saving...' : 'Save Room'}
              </Button>
            </>
          }
        >
          {formError && (
            <Alert type="warning" onClose={() => setFormError('')}>
              {formError}
            </Alert>
          )}
          <div className="form-grid">
            <Select
              label="Location"
              name="locationId"
              value={String(formData.locationId || '')}
              onChange={handleInputChange}
              error={validationErrors.locationId}
              options={locations.map((location) => ({
                value: String(location.id),
                label: `${location.name} (${location.city})`,
              }))}
              placeholder={locations.length > 0 ? 'Select a location' : 'No locations available'}
              disabled={locations.length === 0}
              fullWidth
              required
            />
            <Input
              label="Room Name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              error={validationErrors.name}
              fullWidth
              required
            />
            <Input
              label="Type"
              name="type"
              value={formData.type || ''}
              onChange={handleInputChange}
              error={validationErrors.type}
              fullWidth
              required
            />
            <Input
              label="Capacity"
              type="number"
              name="capacity"
              value={formData.capacity || ''}
              onChange={handleInputChange}
              error={validationErrors.capacity}
              min="1"
              fullWidth
              required
            />
            <Input
              label="Price per Night ($)"
              type="number"
              name="pricePerNight"
              value={formData.pricePerNight || ''}
              onChange={handleInputChange}
              error={validationErrors.pricePerNight}
              min="0"
              fullWidth
              required
            />
            <Input
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <Input
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              error={validationErrors.description}
              fullWidth
              required
            />
          </div>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <Modal
          isOpen={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          title={`Delete ${activeTab === 'locations' ? 'Location' : 'Room'}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setDeleteDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                loading={formLoading}
                disabled={formLoading}
              >
                {formLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </>
          }
        >
          <p>Are you sure you want to delete this {activeTab === 'locations' ? 'location' : 'room'}?</p>
          {selectedItem && (
            <div className="delete-warning">
              <p><strong>{activeTab === 'locations' ? 'Location' : 'Room'}:</strong> {selectedItem.name}</p>
              {activeTab === 'locations' && (
                <p className="warning-text">⚠️ This will also delete all rooms in this location!</p>
              )}
            </div>
          )}
        </Modal>
      </motion.div>
    </Container>
  );
}

export default AdminLocations;
