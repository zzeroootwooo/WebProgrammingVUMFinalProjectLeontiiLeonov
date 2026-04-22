import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HotelIcon from '@mui/icons-material/Hotel';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
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

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <HotelIcon /> Paradise Hotel
      </Typography>
      <List>
        {publicLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton component={RouterLink} to={link.path}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {user && userLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton component={RouterLink} to={link.path}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {user?.role === 'admin' && adminLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton component={RouterLink} to={link.path}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {!user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/login">
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/register">
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="default" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: 'inherit',
                mr: 'auto',
              }}
            >
              <HotelIcon sx={{ fontSize: { xs: 28, md: 32 }, color: 'primary.main' }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Paradise Hotel
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton
                color="inherit"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {publicLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    color="inherit"
                    sx={{
                      fontWeight: 500,
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'rgba(59, 130, 246, 0.08)',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}

                {user ? (
                  <>
                    {user.role !== 'admin' && userLinks.map((link) => (
                      <Button
                        key={link.path}
                        component={RouterLink}
                        to={link.path}
                        color="inherit"
                        sx={{
                          fontWeight: 500,
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'primary.main',
                            bgcolor: 'rgba(59, 130, 246, 0.08)',
                          },
                        }}
                      >
                        {link.label}
                      </Button>
                    ))}

                    {user.role === 'admin' && adminLinks.map((link) => (
                      <Button
                        key={link.path}
                        component={RouterLink}
                        to={link.path}
                        color="inherit"
                        sx={{
                          fontWeight: 500,
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'primary.main',
                            bgcolor: 'rgba(59, 130, 246, 0.08)',
                          },
                        }}
                      >
                        {link.label}
                      </Button>
                    ))}

                    <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '1rem' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem disabled sx={{ opacity: '1 !important' }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/login"
                      color="inherit"
                      sx={{
                        fontWeight: 500,
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          bgcolor: 'rgba(59, 130, 246, 0.08)',
                        },
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      startIcon={<PersonIcon />}
                      sx={{ ml: 1 }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;
