import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHotel, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { Button, Container } from '../ui';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleMobileNavigate = () => {
    setMobileOpen(false);
  };

  const publicLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Search Rooms', path: '/search' },
  ];

  const userLinks = [
    { label: 'My Reservations', path: '/my-reservations' },
  ];

  const adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Locations', path: '/admin/locations' },
    { label: 'All Reservations', path: '/admin/reservations' },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Container maxWidth="xl">
          <div className="navbar-content">
            {/* Logo */}
            <Link to="/" className="navbar-logo">
              <FaHotel className="navbar-logo-icon" />
              <span className="navbar-logo-text">Paradise Hotel</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="navbar-links desktop">
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-link ${isActivePath(link.path) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}

              {user && user.role !== 'admin' && userLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-link ${isActivePath(link.path) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}

              {user?.role === 'admin' && adminLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-link ${isActivePath(link.path) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons / User Menu */}
            <div className="navbar-actions desktop">
              {user ? (
                <div className="navbar-user-menu">
                  <motion.button
                    className="navbar-user-button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="navbar-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="navbar-user-name">{user.name}</span>
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div
                          className="navbar-menu-overlay"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <motion.div
                          className="navbar-dropdown"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="navbar-dropdown-header">
                            <p className="navbar-dropdown-name">{user.name}</p>
                            <p className="navbar-dropdown-email">{user.email}</p>
                          </div>
                          <button
                            className="navbar-dropdown-item logout"
                            onClick={handleLogout}
                          >
                            <FaSignOutAlt />
                            <span>Logout</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="navbar-auth-buttons">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<FaUser />}
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="navbar-mobile-toggle mobile"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </Container>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="navbar-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="navbar-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="navbar-drawer-header">
                <FaHotel className="navbar-drawer-icon" />
                <span>Paradise Hotel</span>
              </div>

              <div className="navbar-drawer-links">
                {publicLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`navbar-drawer-link ${isActivePath(link.path) ? 'active' : ''}`}
                    onClick={handleMobileNavigate}
                  >
                    {link.label}
                  </Link>
                ))}

                {user && user.role !== 'admin' && userLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`navbar-drawer-link ${isActivePath(link.path) ? 'active' : ''}`}
                    onClick={handleMobileNavigate}
                  >
                    {link.label}
                  </Link>
                ))}

                {user?.role === 'admin' && adminLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`navbar-drawer-link ${isActivePath(link.path) ? 'active' : ''}`}
                    onClick={handleMobileNavigate}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="navbar-drawer-footer">
                {user ? (
                  <>
                    <div className="navbar-drawer-user">
                      <div className="navbar-avatar small">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="navbar-drawer-user-name">{user.name}</p>
                        <p className="navbar-drawer-user-email">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      fullWidth
                      icon={<FaSignOutAlt />}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="navbar-drawer-auth">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        setMobileOpen(false);
                        navigate('/login');
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="primary"
                      fullWidth
                      icon={<FaUser />}
                      onClick={() => {
                        setMobileOpen(false);
                        navigate('/register');
                      }}
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
