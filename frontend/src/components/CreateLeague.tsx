import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const CreateLeague = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post("http://localhost:8000/api/leagues/", { name })
      .then((response) => {
        console.log("League created:", response.data);
        setName("");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error creating league:", error);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs="auto">
          <h2 className="text-center mb-4">Create New League</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="leagueName">
              <Form.Control
                type="text"
                placeholder="Enter league name"
                value={name}
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                  setName(evt.target.value)
                }
                required
              />
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Create League
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateLeague;
