import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const PetDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPet();
  }, [id]);

  const fetchPet = async () => {
    try {
      const res = await API.get(`/pets/${id}`);
      setPet(res.data);
    } catch (err) {
      setError('Failed to load pet details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!pet) return <Alert variant="warning">Pet not found</Alert>;

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h2>{pet.name}</h2>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <img src={pet.photo || 'https://via.placeholder.com/400'} alt={pet.name} className="img-fluid" />
                </Col>
                <Col md={6}>
                  <h5>Details</h5>
                  <p><strong>Species:</strong> {pet.species}</p>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age} years old</p>
                  <p><strong>Status:</strong> {pet.status}</p>
                  <p><strong>Description:</strong> {pet.description}</p>
                  {user && (
                    <Link to={`/adopt/${pet._id}`}>
                      <Button variant="primary" size="lg">
                        Adopt {pet.name}
                      </Button>
                    </Link>
                  )}
                  {!user && (
                    <Alert variant="info">
                      Please <Link to="/auth">login</Link> to adopt this pet.
                    </Alert>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PetDetails;
