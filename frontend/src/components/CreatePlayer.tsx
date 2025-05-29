import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Alert, Form, Button } from "react-bootstrap";

interface League {
  id: number;
  name: string;
}

const CreatePlayer: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeagueIds, setSelectedLeagueIds] = useState<number[]>([]);

  useEffect(() => {
    axios
      .get<League[]>("http://localhost:8000/api/leagues/")
      .then((response) => {
        setLeagues(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch leagues", error);
      });
  }, []);

  const handleLeagueToggle = (leagueId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedLeagueIds((prev) => [...prev, leagueId]);
    } else {
      setSelectedLeagueIds((prev) => prev.filter((id) => id !== leagueId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .post("http://localhost:8000/api/players/", {
        name: name,
        leagues: selectedLeagueIds, // リーグに所属しない場合も許可する
      })
      .then((response) => {
        navigate("/"); // 作成後、トップページへリダイレクトする
      })
      .catch((error) => {
        console.error("There was an error creating the player!", error);
      });
  };

  if (leagues.length === 0) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs="auto">
            <h2 className="text-center mb-4">Create New Player</h2>
            <Alert variant="danger" className="text-center">
              No leagues available. <br />
              Please create a league first.
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Create New Player</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="playerName">
              <Form.Label>Player Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter player name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="selectLeagues">
              <Form.Label>Select Leagues</Form.Label>
              {leagues.map((league) => (
                <Form.Check
                  key={league.id}
                  type="checkbox"
                  label={
                    <span
                      className="text-truncate"
                      style={{
                        display: "block",
                        maxWidth: "70vw",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={league.name} // ホバー時にフルテキストを表示
                    >
                      {league.name}
                    </span>
                  }
                  checked={selectedLeagueIds.includes(league.id)}
                  onChange={(evt) =>
                    handleLeagueToggle(league.id, evt.target.checked)
                  }
                  style={{ textAlign: "left" }}
                />
              ))}
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Create Player
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
    // <div>
    //   <h2>Create New Player</h2>
    //   <form onSubmit={handleSubmit}>
    //     <div>
    //       <label>Player name:</label>
    //       <input
    //         type="text"
    //         value={name}
    //         onChange={(e) => setName(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label>Select Leagues:</label>
    //       {leagues.map((league) => (
    //         <label key={league.id} style={{ display: "block" }}>
    //           <input
    //             type="checkbox"
    //             checked={selectedLeagueIds.includes(league.id)}
    //             onChange={(e) =>
    //               handleLeagueToggle(league.id, e.target.checked)
    //             }
    //           />
    //           {league.name}
    //         </label>
    //       ))}
    //     </div>
    //     <button type="submit">Create Player</button>
    //   </form>
    // </div>
  );
};

export default CreatePlayer;
