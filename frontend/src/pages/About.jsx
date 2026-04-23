import { Container, Card } from '../components/ui';
import { motion } from 'framer-motion';
import './About.css';

function About() {
  return (
    <Container maxWidth="md">
      <motion.div
        className="about-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="about-title">About Paradise Hotel</h1>

        <Card variant="glass" className="about-card">
          <Card.Body>
            <h2>Our Story</h2>
            <p>
              Paradise Hotel is a premier hospitality brand offering luxurious accommodations across
              multiple destinations worldwide. Founded with a vision to provide exceptional service
              and unforgettable experiences, we have grown to become a trusted name in the hotel
              industry.
            </p>

            <h2>Our Mission</h2>
            <p>
              To deliver world-class hospitality services that exceed guest expectations through
              attention to detail, personalized service, and a commitment to excellence in every
              aspect of the guest experience.
            </p>

            <h2>What We Offer</h2>
            <p>
              Our hotels feature elegantly designed rooms, state-of-the-art amenities, wellness
              centers, fine dining restaurants, and convenient parking facilities. Each location is
              carefully selected to provide easy access to local attractions while offering a
              peaceful retreat for our guests.
            </p>

            <h2>Project Information</h2>
            <p>
              This booking platform was developed as part of a web programming practical project,
              demonstrating modern web development practices using React, custom UI components, and RESTful
              API integration. The system provides a complete hotel management solution for both
              guests and administrators.
            </p>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
}

export default About;
