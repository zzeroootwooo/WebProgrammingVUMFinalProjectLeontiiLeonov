import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { Container, Button, Input, Alert, Card } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/login');
    } catch (error) {
      setApiError(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="glass" className="register-card">
            <Card.Body>
              <div className="register-header">
                <h1 className="register-title">Create Account</h1>
                <p className="register-subtitle">Join Paradise Hotel today</p>
              </div>

              {apiError && (
                <Alert type="error" onClose={() => setApiError('')}>
                  {apiError}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="register-form">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={<FaUser />}
                  iconPosition="left"
                  placeholder="Enter your full name"
                  required
                  fullWidth
                  autoComplete="name"
                  autoFocus
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<FaEnvelope />}
                  iconPosition="left"
                  placeholder="Enter your email"
                  required
                  fullWidth
                  autoComplete="email"
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  helperText={!errors.password && "Must be at least 6 characters"}
                  icon={<FaLock />}
                  iconPosition="left"
                  placeholder="Create a password"
                  required
                  fullWidth
                  autoComplete="new-password"
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <p className="register-footer">
                  Already have an account?{' '}
                  <Link to="/login" className="register-link">
                    Sign in here
                  </Link>
                </p>
              </form>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}

export default Register;
