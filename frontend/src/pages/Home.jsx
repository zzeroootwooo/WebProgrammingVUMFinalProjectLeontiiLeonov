import { Container, Typography, Box, Button, Grid, Card, CardContent, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import SpaIcon from '@mui/icons-material/Spa';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';

function Home() {
  const features = [
    {
      icon: <StarIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
      title: 'Top Rated Hotels',
      description: 'Stay in our 5-star rated properties across the world with premium amenities.',
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 48, color: 'info.main' }} />,
      title: 'Instant Booking',
      description: 'Book your perfect room in seconds with our streamlined reservation system.',
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 48, color: 'success.main' }} />,
      title: 'Best Price Guarantee',
      description: 'Get the best rates with no hidden fees. What you see is what you pay.',
    },
  ];

  const amenities = [
    { icon: <LocalParkingIcon />, label: 'Free Parking' },
    { icon: <SpaIcon />, label: 'Wellness Center' },
    { icon: <StarIcon />, label: 'Premium Service' },
  ];

  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.4,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <Typography
              variant="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                mb: 3,
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              Welcome to Paradise Hotel
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 5,
                opacity: 0.95,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Experience luxury and comfort in the world's finest destinations. Your perfect stay is just a click away.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                component={RouterLink}
                to="/search"
                variant="contained"
                size="large"
                startIcon={<SearchIcon />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Find Your Room
              </Button>
              <Button
                component={RouterLink}
                to="/about"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Learn More
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Why Choose Us
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Discover what makes Paradise Hotel the perfect choice for your next getaway
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 12px 24px -10px rgba(102, 126, 234, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 10,
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom fontWeight={700}>
                Premium Amenities
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
                All our properties feature world-class amenities designed to make your stay unforgettable. From complimentary parking to luxurious wellness centers, we've got everything you need.
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 3 }}>
                {amenities.map((amenity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      bgcolor: 'white',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {amenity.icon}
                    <Typography variant="body2" fontWeight={500}>
                      {amenity.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: { xs: 250, md: 350 },
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    animation: 'float 20s linear infinite',
                  },
                  '@keyframes float': {
                    '0%': { transform: 'translate(0, 0)' },
                    '100%': { transform: 'translate(-50%, -50%)' },
                  },
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: 'white',
                    fontSize: '4rem',
                    fontWeight: 800,
                    opacity: 0.2,
                  }}
                >
                  LUXURY
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
