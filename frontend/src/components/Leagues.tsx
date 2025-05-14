import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Container, Row, Col, ListGroup } from "react-bootstrap";

interface League {
  id: number;
  name: string;
}

const Leagues: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);

  // コンポーネントがマウントされたときにAPIを呼び出す
  useEffect(() => {
    axios
      .get<League[]>("http://localhost:8000/api/leagues/")
      .then((response) => {
        setLeagues(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the leagues!", error);
      });
  }, []); // 空の依存配列で、初回レンダリング時に一度だけ実行

  return (
    <Container className="mt-5">
      <Row className="mt-4">
        <Col>
          <h1 className="text-center">League Lists</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
          <ListGroup>
            <ListGroup.Item className="d-flex justify-content-between bg-light">
              <div
                className="text-start text-muted"
                style={{ maxWidth: "50vw" }}
              >
                League Name
              </div>
              <div style={{ width: "auto" }}></div>
            </ListGroup.Item>
            {leagues.map((league) => (
              <ListGroup.Item
                key={league.id}
                className="d-flex justify-content-between align-items-center"
                // style={{ whiteSpace: "nowrap" }}
                style={{ overflow: "hidden" }}
              >
                <div
                  className="text-truncate me-5"
                  style={{ maxWidth: "50vw" }}
                  title={league.name}
                >
                  {league.name}
                </div>
                <Link to={`/league/${league.id}`}>
                  <Button variant="primary">View</Button>
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Leagues;
