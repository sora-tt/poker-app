import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

interface League {
  id: number;
  name: string;
}

const EditLeague = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get<League>(`http://localhost:8000/api/leagues/${id}/`)
      .then((response) => {
        setName(response.data.name);
      })
      .catch((error) => {
        console.error("There was an error fetching the league!", error);
        setError("Failed to fetch league details");
      });
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .put(`http://localhost:8000/api/leagues/${id}/`, { name })
      .then(() => {
        navigate(`/league/${id}`);
      })
      .catch((error) => {
        console.error("There was an error updating the league!", error);
        setError(
          error.response?.data?.detail || "Failed to update league name"
        );
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Edit League</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="leagueName">
              <Form.Label>League Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="League Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            {error && (
              <Alert variant="danger" className="text-center py-2">
                {error}
              </Alert>
            )}
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditLeague;
