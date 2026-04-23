import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaHotel, FaDoorOpen } from 'react-icons/fa';
import { Container, Card, Button, Alert, Modal, Input, Checkbox, Badge } from '../../components/ui';
import api from '../../services/api';
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

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'locations') {
        const response = await api.get('/api/admin/locations');
        setLocations(response.data.locations || []);
      } else {
        const response = await api.get('/api/admin/rooms');
        setRooms(response.data.rooms || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

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
    setLocationDialog(true);
  };

  const handleEditLocation = (location) => {
    setSelectedItem(location);
    setFormData({ ...location });
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
    setRoomDialog(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteDialog(true);
  };

  const handleSaveLocation = async () => {
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
      setError(err.response?.data?.message || 'Failed to save location');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSaveRoom = async () => {
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
      setError(err.response?.data?.message || 'Failed to save room');
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
      setError(err.response?.data?.message || 'Failed to delete item');
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
          <div className="form-grid">
            <Input
              label="Name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <Input
              label="City"
              name="city"
              value={formData.city || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <Input
              label="Address"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <Input
              label="Rating (1-5)"
              type="number"
              name="rating"
              value={formData.rating || ''}
              onChange={handleInputChange}
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
          <div className="form-grid">
            <div className="form-select">
              <label>Location</label>
              <select
                name="locationId"
                value={formData.locationId || ''}
                onChange={handleInputChange}
                className="select-input"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
            <Input
              label="Room Name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <Input
              label="Type"
              name="type"
              value={formData.type || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <Input
              label="Capacity"
              type="number"
              name="capacity"
              value={formData.capacity || ''}
              onChange={handleInputChange}
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
