import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const res = await API.get('/applications/my');
      setApplications(res.data);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert variant="info">
          Please login to view your applications.
        </Alert>
      </Container>
    );
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <h1 className="my-4">My Applications</h1>
      {applications.length === 0 ? (
        <Alert variant="info">You haven't submitted any applications yet.</Alert>
      ) : (
        <Row>
          {applications.map(app => (
            <Col md={6} key={app._id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{app.pet.name}</Card.Title>
                  <Card.Text>
                    <strong>Species:</strong> {app.pet.species}<br />
                    <strong>Breed:</strong> {app.pet.breed}<br />
                    <strong>Age:</strong> {app.pet.age} years old<br />
                    <strong>Status:</strong> {getStatusBadge(app.status)}<br />
                    <strong>Applied on:</strong> {new Date(app.createdAt).toLocaleDateString()}<br />
                    {app.message && <><strong>Message:</strong> {app.message}</>}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Applications;
