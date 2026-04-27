import { Link } from 'react-router-dom';
import { FaEnvelope, FaHotel, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { Container } from '../ui';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Container maxWidth="xl">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <div className="site-footer-logo">
              <FaHotel className="site-footer-logo-icon" />
              <span>Paradise Hotel</span>
            </div>
            <p className="site-footer-text">
              Modern hotel booking experience for guests, returning users, and administrators.
            </p>
          </div>

          <div className="site-footer-column">
            <h3 className="site-footer-title">Navigate</h3>
            <div className="site-footer-links">
              <Link to="/" className="site-footer-link">Home</Link>
              <Link to="/about" className="site-footer-link">About</Link>
              <Link to="/search" className="site-footer-link">Search Rooms</Link>
            </div>
          </div>

          <div className="site-footer-column">
            <h3 className="site-footer-title">Contact</h3>
            <div className="site-footer-contact-list">
              <p className="site-footer-contact">
                <FaMapMarkerAlt />
                <span>Paradise City Center</span>
              </p>
              <p className="site-footer-contact">
                <FaPhoneAlt />
                <span>+359 700 12 345</span>
              </p>
              <p className="site-footer-contact">
                <FaEnvelope />
                <span>hello@paradisehotel.local</span>
              </p>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© {year} Paradise Hotel. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
