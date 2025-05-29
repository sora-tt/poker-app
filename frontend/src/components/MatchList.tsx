import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Button, ListGroup, Alert } from "react-bootstrap";

interface Match {
  id: number;
  date: string;
  player_stats: {
    player: number;
    score: number;
  }[];
}

const MatchList: React.FC = () => {
  const { id: leagueId } = useParams<{ id: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Match[]>(`http://localhost:8000/api/matches/?league=${leagueId}`)
      .then((response) => {
        const sortedMatches = response.data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setMatches(sortedMatches);
      })
      .catch((error) =>
        console.error("Failed to fetch matches for this league", error)
      );
  }, [leagueId]);

  const handleEdit = (matchId: number) => {
    navigate(`/matches/${matchId}/edit`);
  };

  const handleDelete = (matchId: number) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      axios
        .delete(`http://localhost:8000/api/matches/${matchId}/`)
        .then(() => {
          setMatches((prev) => prev.filter((m) => m.id !== matchId));
        })
        .catch((error) => {
          console.error("Failed to delete match", error);
        });
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mt-4">
        <Col>
          <h2 className="text-center">Match List</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
          {matches.length > 0 ? (
            <ListGroup>
              <ListGroup.Item className="d-flex justify-content-between bg-light">
                <div
                  className="text-start text-muted"
                  style={{ maxWidth: "50vw", fontSize: "0.9rem" }}
                >
                  <span>Match Date</span>
                </div>
                <div style={{ width: "auto" }}></div>
              </ListGroup.Item>
              {matches.map((match) => (
                <ListGroup.Item
                  key={match.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <small className="me-5">{match.date}</small>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(match.id)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(match.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="warning">No matches found for this league.</Alert>
          )}
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="d-flex justify-content-between">
          <Link to={`/league/${leagueId}/matches/create`}>
            <Button variant="success">Create Match</Button>
          </Link>
          <Link to={`/league/${leagueId}`}>
            <Button variant="secondary">Return</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default MatchList;
