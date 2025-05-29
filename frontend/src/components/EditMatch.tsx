import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";

interface Player {
  id: number;
  name: string;
}

interface Match {
  id: number;
  league: number;
  date: string;
  player_stats: {
    player: number;
    score: number;
  }[];
}

const EditMatch: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [leaguePlayers, setLeaguePlayers] = useState<Player[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const [date, setDate] = useState("");
  const [scores, setScores] = useState<{ [playerId: string]: string }>({});
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!matchId) return;

    axios
      .get<Match>(`http://localhost:8000/api/matches/${matchId}/`)
      .then(async (response) => {
        const matchData = response.data;
        setMatch(matchData);
        setDate(matchData.date);

        const scoresObj: { [id: string]: string } = {};
        const selectedIds: number[] = [];
        matchData.player_stats.forEach((ps) => {
          scoresObj[String(ps.player)] = String(ps.score);
          selectedIds.push(ps.player);
        });
        setScores(scoresObj);
        setSelectedPlayerIds(selectedIds);

        const res = await axios.get<Player[]>(
          `http://localhost:8000/api/leagues/${matchData.league}/players/`
        );
        console.log(res.data);
        setLeaguePlayers(res.data);
      })
      .catch((error) => {
        console.error("Failed to fetch match data", error);
        setError("Failed to fetch match data");
      });
  }, [matchId]);

  const handleScoreChange = (playerId: string, value: string) => {
    setScores((prev) => ({
      ...prev,
      [playerId]: value,
    }));
  };

  const handlePlayerToggle = (playerId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedPlayerIds((prev) => [...prev, playerId]);
    } else {
      setSelectedPlayerIds((prev) => prev.filter((id) => id !== playerId));
      setScores((prev) => {
        const updated = { ...prev };
        delete updated[String(playerId)];
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!match) return;

    const updatedData = {
      league: match.league,
      date: date,
      players: selectedPlayerIds,
      player_stats: selectedPlayerIds.map((id) => ({
        player: id,
        score: parseFloat(scores[id] || "0"),
      })),
    };

    axios
      .put(`http://localhost:8000/api/matches/${matchId}/`, updatedData)
      .then(() => {
        navigate(`/league/${match.league}/matches`);
      })
      .catch((error) => {
        console.error("Failed to update match", error);
        setError("Failed to update match");
      });
  };

  if (!match) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs="auto">
            <Spinner
              animation="border"
              role="status"
              size="sm"
              className="me-2"
            />
            Loading...
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h2 className="text-center mb-4">Edit Match</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="matchDate">
              <Form.Label style={{ fontWeight: "bold" }}>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="selectPlayers">
              <Form.Label style={{ fontWeight: "bold" }}>Select Players</Form.Label>
              <div>
                {leaguePlayers.map((player) => (
                  <Form.Check
                    key={player.id}
                    type="checkbox"
                    id={`player-${player.id}`}
                    label={player.name}
                    checked={selectedPlayerIds.includes(player.id)}
                    onChange={(e) =>
                      handlePlayerToggle(player.id, e.target.checked)
                    }
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="playerScores">
              <Form.Label style={{ fontWeight: "bold" }}>
                Enter Scores
              </Form.Label>
              {selectedPlayerIds.map((id) => {
                const player = leaguePlayers.find((p) => p.id === id);
                return (
                  <Form.Group key={id} className="mb-2">
                    <Form.Label>Score of {player?.name}</Form.Label>
                    <Form.Control
                      type="number"
                      value={scores[id] || ""}
                      onChange={(e) =>
                        handleScoreChange(String(id), e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                );
              })}
            </Form.Group>

            {error && (
              <Alert variant="danger" className="text-center py-2">
                {error}
              </Alert>
            )}

            <div className="d-flex gap-2 justify-content-between mt-4">
              <Button variant="primary" type="submit">
                Edit Match
              </Button>
              <Link to={`/league/${match.league}/matches`}>
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
    // <div>
    //   <h2>EditMatch</h2>
    //   <form onSubmit={handleSubmit}>
    //     <div>
    //       <label>Date:</label>
    //       <input
    //         type="date"
    //         value={date}
    //         onChange={(e) => setDate(e.target.value)}
    //         required
    //       />
    //     </div>

    //     <div>
    //       <h3>Select Players:</h3>
    //       {leaguePlayers.map((player) => (
    //         <label key={player.id} style={{ display: "block" }}>
    //           <input
    //             type="checkbox"
    //             checked={selectedPlayerIds.includes(player.id)}
    //             onChange={(e) =>
    //               handlePlayerToggle(player.id, e.target.checked)
    //             }
    //           />
    //           {player.name}
    //         </label>
    //       ))}
    //     </div>

    //     <div>
    //       <h3>Enter Scores:</h3>
    //       {selectedPlayerIds.map((id) => {
    //         const player = leaguePlayers.find((p) => p.id === id);
    //         return (
    //           <div key={id}>
    //             <label>
    //               Score of {player?.name}:
    //               <input
    //                 type="number"
    //                 value={scores[id] || ""}
    //                 onChange={(e) =>
    //                   handleScoreChange(String(id), e.target.value)
    //                 }
    //                 required
    //               />
    //             </label>
    //           </div>
    //         );
    //       })}
    //     </div>

    //     <button type="submit">Edit Match</button>
    //   </form>
    //   <Link to={`/league/${match.league}/matches`}>
    //     <button>Cancel</button>
    //   </Link>
    // </div>
  );
};

export default EditMatch;
