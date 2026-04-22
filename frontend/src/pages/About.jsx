import { Container, Typography, Box, Paper } from '@mui/material';

function About() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          About Paradise Hotel
        </Typography>

        <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Our Story
          </Typography>
          <Typography variant="body1" paragraph>
            Paradise Hotel is a premier hospitality brand offering luxurious accommodations across
            multiple destinations worldwide. Founded with a vision to provide exceptional service
            and unforgettable experiences, we have grown to become a trusted name in the hotel
            industry.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            To deliver world-class hospitality services that exceed guest expectations through
            attention to detail, personalized service, and a commitment to excellence in every
            aspect of the guest experience.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            What We Offer
          </Typography>
          <Typography variant="body1" paragraph>
            Our hotels feature elegantly designed rooms, state-of-the-art amenities, wellness
            centers, fine dining restaurants, and convenient parking facilities. Each location is
            carefully selected to provide easy access to local attractions while offering a
            peaceful retreat for our guests.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Project Information
          </Typography>
          <Typography variant="body1" paragraph>
            This booking platform was developed as part of a web programming practical project,
            demonstrating modern web development practices using React, Material-UI, and RESTful
            API integration. The system provides a complete hotel management solution for both
            guests and administrators.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default About;
