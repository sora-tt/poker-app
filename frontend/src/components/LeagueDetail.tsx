import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";
import "../styles/custom.css";

interface Player {
  id: number;
  name: string;
}

interface League {
  id: number;
  name: string;
  players: Player[];
}

interface RankingEntry {
  player__id: number;
  player__name: string;
  total_score: number;
}

const LeagueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [league, setLeague] = useState<League | null>(null);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // リーグ情報取得
    axios
      .get<League>(`http://localhost:8000/api/leagues/${id}/`)
      .then((response) => {
        setLeague(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the league!", error);
      });

    // ランキング取得
    axios
      .get<RankingEntry[]>(`http://localhost:8000/api/leagues/${id}/ranking/`)
      .then((response) => setRanking(response.data))
      .catch((error) =>
        console.error("There was an error fetching the ranking!", error)
      );
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Do you really want to remove this league?")) {
      axios
        .delete(`http://localhost:8000/api/leagues/${id}/`)
        .then(() => {
          navigate("/"); // リーグ一覧に戻る
        })
        .catch((error) => {
          console.error("There was an error deleting the league!", error);
        });
    }
  };

  const handleEditPlayer = (playerId: number) => {
    navigate(`/players/${playerId}/edit`);
  };

  const handleDeletePlayer = (playerId: number) => {
    if (window.confirm("Do you really want to delete this player?")) {
      axios
        .delete(`http://localhost:8000/api/players/${playerId}/`)
        .then(() => {
          axios
            .get<League>(`http://localhost:8000/api/leagues/${id}/`)
            .then((response) => setLeague(response.data));
        })
        .catch((error) => {
          console.error("Error deleting player:", error);
        });
    }
  };

  if (!league) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      className="mt-5"
      style={{ paddingTop: "30px", paddingBottom: "30px" }}
    >
      <Row className="mt-4">
        <Col>
          <h1
            className="text-center text-truncate"
            style={{
              maxWidth: "70vw",
              // overflow: "hidden",
              // textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              margin: "0 auto",
            }}
            title={league.name}
          >
            {league.name}
          </h1>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h3 className="mb-3">Score Ranking</h3>
          {ranking.length > 0 ? (
            <div className="table-responsive" style={{ paddingBottom: "40px" }}>
              <Table
                striped
                bordered
                hover
                className="text-center align-middle table-no-inner-vertical-borders"
              >
                <thead className="table-white">
                  <tr>
                    <th></th>
                    <th>Player</th>
                    <th>Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((entry, index) => (
                    <tr key={entry.player__id}>
                      <td>{index + 1}</td>
                      <td>{entry.player__name}</td>
                      <td
                        style={{
                          color: entry.total_score >= 0 ? "#0d6efd" : "#dc3545",
                        }}
                      >
                        {entry.total_score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <Alert variant="warning">No match results yet.</Alert>
          )}

          <h3>Players in this league</h3>
          {league.players && league.players.length > 0 ? (
            <div style={{ paddingBottom: "40px" }}>
              <ul className="list-group">
                {league.players.map((player) => (
                  <li
                    key={player.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div style={{ paddingRight: "50px" }}>{player.name}</div>
                    <div>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleEditPlayer(player.id)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDeletePlayer(player.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Alert variant="warning">No players in this league.</Alert>
          )}

          <div className="d-grid gap-2" style={{ maxWidth: 500 }}>
            <Link to={`/league/${id}/matches/`} style={{ display: "contents" }}>
              <Button variant="primary" className="w-100 mb-2">
                View Matches
              </Button>
            </Link>

            <Link to={`/league/${id}/edit`} style={{ display: "contents" }}>
              <Button variant="secondary" className="w-100 mb-2">
                Edit League Name
              </Button>
            </Link>

            <Button variant="danger" onClick={handleDelete} className="w-100">
              Delete League
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LeagueDetail;
