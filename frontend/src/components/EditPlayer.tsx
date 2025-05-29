import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";

interface Player {
  id: number;
  name: string;
}

const EditPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Player ID is missing!");
      return;
    }
    axios
      .get<Player>(`http://localhost:8000/api/players/${id}/`)
      .then((response) => {
        setPlayer(response.data);
        setName(response.data.name);
      })
      .catch((error) => {
        console.error("Error fetching player:", error);
        setError("Failed to acquire the player's info");
      });
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0) {
      setError("Name is required");
      return;
    }

    setError("");

    const playerData = {
      name: name,
    };

    axios
      .patch(`http://localhost:8000/api/players/${id}/`, playerData)
      .then(() => {
        // 編集後に元のページやリーグ詳細に戻す
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error updating player:", error);
        setError(
          error.response?.data?.detail || "Failed to update player's name"
        );
      });
  };

  if (!player) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs="auto">
            <Spinner animation="border" role="status" size="sm" className="me-2" />
            Loading...
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Edit Player</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="playerName">
              <Form.Label>Player Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Player Name"
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

export default EditPlayer;
