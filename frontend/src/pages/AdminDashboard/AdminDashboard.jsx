import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaHotel, FaDoorOpen, FaCalendarCheck, FaTimesCircle, FaChartLine } from 'react-icons/fa';
import { Container, Card, Grid, Alert } from '../../components/ui';
import api from '../../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/dashboard');
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="loading-state">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-stats"></div>
        </div>
      </Container>
    );
  }

  const statCards = [
    {
      icon: <FaUsers />,
      title: 'Total Users',
      value: stats?.summary?.totalUsers || 0,
      color: '#3b82f6',
    },
    {
      icon: <FaHotel />,
      title: 'Locations',
      value: stats?.summary?.totalLocations || 0,
      color: '#8b5cf6',
    },
    {
      icon: <FaDoorOpen />,
      title: 'Total Rooms',
      value: stats?.summary?.totalRooms || 0,
      color: '#ec4899',
    },
    {
      icon: <FaCalendarCheck />,
      title: 'Active Reservations',
      value: stats?.summary?.activeReservations || 0,
      color: '#10b981',
    },
    {
      icon: <FaTimesCircle />,
      title: 'Cancelled',
      value: stats?.summary?.cancelledReservations || 0,
      color: '#ef4444',
    },
    {
      icon: <FaChartLine />,
      title: 'Total Reservations',
      value: stats?.summary?.totalReservations || 0,
      color: '#f59e0b',
    },
  ];

  return (
    <Container>
      <motion.div
        className="admin-dashboard-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="page-title">Admin Dashboard</h1>

        {error && (
          <Alert type="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid cols={3} gap={3} className="stats-grid">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card variant="glass" hoverable className="stat-card">
                <Card.Body>
                  <div className="stat-icon" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{stat.value}</h3>
                    <p className="stat-title">{stat.title}</p>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </Grid>

        {stats?.reservationsByMonth && stats.reservationsByMonth.length > 0 && (
          <Card variant="glass" className="trend-card">
            <Card.Header>
              <h2>Reservation Trend</h2>
            </Card.Header>
            <Card.Body>
              <div className="trend-chart">
                {stats.reservationsByMonth.map((item, index) => (
                  <div key={index} className="trend-item">
                    <div className="trend-label">{item.month}</div>
                    <div className="trend-bar-container">
                      <div
                        className="trend-bar"
                        style={{
                          width: `${(item.count / Math.max(...stats.reservationsByMonth.map((trendItem) => trendItem.count), 1)) * 100}%`,
                        }}
                      >
                        <span className="trend-count">{item.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}
      </motion.div>
    </Container>
  );
}

export default AdminDashboard;
