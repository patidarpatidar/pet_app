import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Pagination, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import API from '../services/api';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const petsPerPage = 3;

  // Calculate pagination display
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  useEffect(() => {
    fetchPets();
  }, [currentPage, search, species, breed, maxAge]);

  const fetchPets = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: petsPerPage,
        search,
        species,
        breed,
        maxAge
      });
      const res = await API.get(`/pets?${params}`);
      console.log(res,'res')
      setPets(res.data.pets || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
  };

  const currentPets = pets;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <h1 className="text-center my-4">Available Pets</h1>

      <div className="bg-light p-4 rounded mb-4">
        <Form>
          <Row>
            <Col md={3} className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={3} className="mb-3">
              <Form.Select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              >
                <option value="">All Species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
              </Form.Select>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Control
                type="text"
                placeholder="Breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
              />
            </Col>
            <Col md={3} className="mb-3">
              <Form.Control
                type="number"
                placeholder="Max Age"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
              />
            </Col>
          </Row>
        </Form>
      </div>

      <Row className="g-4">
        {currentPets.map(pet => (
          <Col xs={12} sm={6} lg={4} key={pet._id}>
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
                    objectFit: 'cover'
                  }}
                  placeholderSrc="https://via.placeholder.com/300x200?text=Loading..."
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-truncate">{pet.name}</Card.Title>
                <Card.Text className="text-muted small flex-grow-1">
                  {pet.species} - {pet.breed} - {pet.age} years old
                </Card.Text>
                <Badge bg="success" className="align-self-start mb-2">Available</Badge>
                <Link to={`/pet/${pet._id}`} className="mt-auto">
                  <Button variant="primary" className="w-100">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {currentPage > 1 && (
              <Pagination.Prev onClick={() => paginate(currentPage - 1)} />
            )}
            {startPage > 1 && (
              <>
                <Pagination.Item onClick={() => paginate(1)}>1</Pagination.Item>
                {startPage > 2 && <Pagination.Ellipsis />}
              </>
            )}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => paginate(page)}
              >
                {page}
              </Pagination.Item>
            ))}
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <Pagination.Ellipsis />}
                <Pagination.Item onClick={() => paginate(totalPages)}>{totalPages}</Pagination.Item>
              </>
            )}
            {currentPage < totalPages && (
              <Pagination.Next onClick={() => paginate(currentPage + 1)} />
            )}
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default PetList;
