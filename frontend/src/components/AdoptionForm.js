import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdoptionForm = () => {
  const { petId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchPet();
  }, [petId, user, navigate]);

  const fetchPet = async () => {
    try {
      const res = await API.get(`/pets/${petId}`);
      setPet(res.data);
    } catch (err) {
      setError('Pet not found');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/applications', { petId, message });
      setSuccess('Application submitted successfully!');
      setTimeout(() => navigate('/applications'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    }
  };

  if (!pet) return <div>Loading...</div>;

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card>
            <Card.Header>Adopt {pet.name}</Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <img src={pet.photo || 'https://via.placeholder.com/300'} alt={pet.name} className="img-fluid" />
                </Col>
                <Col md={6}>
                  <h5>{pet.name}</h5>
                  <p>{pet.species} - {pet.breed}</p>
                  <p>Age: {pet.age} years</p>
                  <p>Description: {pet.description}</p>
                </Col>
              </Row>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Why do you want to adopt this pet? (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about yourself and why you'd be a great owner..."
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Submit Application
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdoptionForm;
