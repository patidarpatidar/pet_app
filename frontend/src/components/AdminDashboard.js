import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Tabs, Tab, Badge, Modal, Form, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import API from '../services/api';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [pets, setPets] = useState([]);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [applicationsPage, setApplicationsPage] = useState(1);
  const [petsPage, setPetsPage] = useState(1);
  const itemsPerPage = 6;
  const [petData, setPetData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    description: '',
    photo: '',
    status: 'available'
  });

  useEffect(() => {
    fetchApplications();
    fetchPets();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get('/applications');
      setApplications(res.data);
    } catch (err) {
      setError('Failed to fetch applications');
    }
  };

  const fetchPets = async () => {
    try {
      const res = await API.get('/pets?status=all');
      setPets(res.data.pets || []);
    } catch (err) {
      setError('Failed to fetch pets');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/applications/${id}`, { status });
      fetchApplications();
      fetchPets(); // Refresh pets in case status changed
    } catch (err) {
      setError('Failed to update status');
    }
  };

  // Pagination helpers
  const getCurrentApplications = () => {
    const startIndex = (applicationsPage - 1) * itemsPerPage;
    return applications.slice(startIndex, startIndex + itemsPerPage);
  };

  const getCurrentPets = () => {
    const startIndex = (petsPage - 1) * itemsPerPage;
    return pets.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderPagination = (currentPage, totalPages, startPage, endPage, setPage) => {
    if (totalPages <= 1) return null;

    return (
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          {currentPage > 1 && (
            <Pagination.Prev onClick={() => setPage(currentPage - 1)} />
          )}
          {startPage > 1 && (
            <>
              <Pagination.Item onClick={() => setPage(1)}>1</Pagination.Item>
              {startPage > 2 && <Pagination.Ellipsis />}
            </>
          )}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => setPage(page)}
            >
              {page}
            </Pagination.Item>
          ))}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <Pagination.Ellipsis />}
              <Pagination.Item onClick={() => setPage(totalPages)}>{totalPages}</Pagination.Item>
            </>
          )}
          {currentPage < totalPages && (
            <Pagination.Next onClick={() => setPage(currentPage + 1)} />
          )}
        </Pagination>
      </div>
    );
  };

  const handleDeletePet = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await API.delete(`/pets/${id}`);
        fetchPets();
      } catch (err) {
        setError('Failed to delete pet');
      }
    }
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    setPetData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      description: pet.description,
      photo: pet.photo,
      status: pet.status
    });
    setShowEditModal(true);
  };

  const handleUpdatePet = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/pets/${editingPet._id}`, petData);
      setShowEditModal(false);
      fetchPets();
    } catch (err) {
      setError('Failed to update pet');
    }
  };

  const handleInputChange = (e) => {
    setPetData({ ...petData, [e.target.name]: e.target.value });
  };

  return (
    <Container>
      <h1 className="my-4">Admin Dashboard</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Tabs defaultActiveKey="applications" id="admin-tabs">
        <Tab eventKey="applications" title="Adoption Applications">
          <Row className="mt-4">
            {getCurrentApplications().map(app => (
              <Col md={4} key={app._id} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{app.pet.name} - {app.user.name}</Card.Title>
                    <Card.Text>Status: <Badge variant={
                      app.status === 'approved' ? 'success' :
                      app.status === 'rejected' ? 'danger' : 'warning'
                    }>{app.status}</Badge></Card.Text>
                    <Card.Text>Message: {app.message}</Card.Text>
                    {app.status === 'pending' && (
                      <>
                        <Button
                          variant="success"
                          onClick={() => handleStatusChange(app._id, 'approved')}
                          className="mr-2"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleStatusChange(app._id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {renderPagination(
            applicationsPage,
            Math.ceil(applications.length / itemsPerPage),
            Math.max(1, applicationsPage - 2),
            Math.min(Math.ceil(applications.length / itemsPerPage), applicationsPage + 2),
            setApplicationsPage
          )}
        </Tab>
        <Tab eventKey="pets" title="Pet Management">
          <Row className="mt-4">
            <Col className="mb-3">
              <Link to="/add-pet">
                <Button variant="primary">Add New Pet</Button>
              </Link>
            </Col>
          </Row>
          <Row>
            {getCurrentPets().map(pet => (
              <Col md={4} key={pet._id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                    <LazyLoadImage
                      src={pet.photo || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={pet.name}
                      effect="blur"
                      className="card-img-top"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '0.375rem 0.375rem 0 0'
                      }}
                      placeholderSrc="https://via.placeholder.com/300x200?text=Loading..."
                    />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-truncate">{pet.name}</Card.Title>
                    <Card.Text className="text-muted small">
                      {pet.species} - {pet.breed} - {pet.age} years old
                    </Card.Text>
                    <Card.Text>Status: <Badge variant={
                      pet.status === 'available' ? 'success' :
                      pet.status === 'adopted' ? 'info' : 'secondary'
                    }>{pet.status}</Badge></Card.Text>
                    <div className="mt-auto">
                      <Button
                        variant="warning"
                        onClick={() => handleEditPet(pet)}
                        className="mr-2"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeletePet(pet._id)}
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {renderPagination(
            petsPage,
            Math.ceil(pets.length / itemsPerPage),
            Math.max(1, petsPage - 2),
            Math.min(Math.ceil(pets.length / itemsPerPage), petsPage + 2),
            setPetsPage
          )}
        </Tab>
      </Tabs>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdatePet}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={petData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Species</Form.Label>
              <Form.Control
                as="select"
                name="species"
                value={petData.species}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Breed</Form.Label>
              <Form.Control
                type="text"
                name="breed"
                value={petData.breed}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={petData.age}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={petData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Photo URL</Form.Label>
              <Form.Control
                type="url"
                name="photo"
                value={petData.photo}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={petData.status}
                onChange={handleInputChange}
              >
                <option value="available">Available</option>
                <option value="adopted">Adopted</option>
                <option value="pending">Pending</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Update Pet
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
