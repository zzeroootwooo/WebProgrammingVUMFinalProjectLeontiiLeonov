import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaStar, FaParking, FaSpa, FaClock, FaCheckCircle } from 'react-icons/fa';
import { Container, Button, Card, Grid } from '../components/ui';
import './Home.css';

function Home() {
  const features = [
    {
      icon: <FaStar />,
      title: 'Top Rated Hotels',
      description: 'Stay in our 5-star rated properties across the world with premium amenities.',
    },
    {
      icon: <FaClock />,
      title: 'Instant Booking',
      description: 'Book your perfect room in seconds with our streamlined reservation system.',
    },
    {
      icon: <FaCheckCircle />,
      title: 'Best Price Guarantee',
      description: 'Get the best rates with no hidden fees. What you see is what you pay.',
    },
  ];

  const amenities = [
    { icon: <FaParking />, label: 'Free Parking' },
    { icon: <FaSpa />, label: 'Wellness Center' },
    { icon: <FaStar />, label: 'Premium Service' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.div
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Container maxWidth="lg">
          <div className="hero-content">
            <motion.h1
              className="hero-title"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Welcome to Paradise Hotel
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Experience luxury and comfort in the world's finest destinations. Your perfect stay is just a click away.
            </motion.p>
            <motion.div
              className="hero-buttons"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link to="/search">
                <Button variant="primary" size="lg" icon={<FaSearch />}>
                  Find Your Room
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </Container>
      </motion.div>

      {/* Features Section */}
      <Container maxWidth="lg">
        <div className="features-section">
          <motion.div
            className="section-header"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">
              Discover what makes Paradise Hotel the perfect choice for your next getaway
            </p>
          </motion.div>

          <Grid cols={3} gap={4}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card variant="glass" hoverable className="feature-card">
                  <Card.Body>
                    <div className="feature-icon">{feature.icon}</div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </div>

        {/* Amenities Section */}
        <motion.div
          className="amenities-section"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card variant="glass" className="amenities-card">
            <Card.Body>
              <div className="amenities-content">
                <div className="amenities-text">
                  <h2>Premium Amenities</h2>
                  <p>
                    All our properties feature world-class amenities designed to make your stay unforgettable.
                    From complimentary parking to luxurious wellness centers, we've got everything you need.
                  </p>
                  <div className="amenities-list">
                    {amenities.map((amenity, index) => (
                      <div key={index} className="amenity-item">
                        <span className="amenity-icon">{amenity.icon}</span>
                        <span className="amenity-label">{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="amenities-visual">
                  <div className="luxury-badge">LUXURY</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}

export default Home;
