import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setTextRange } from "typescript";

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
    <div
      className="container"
      style={{ paddingTop: "70px", paddingBottom: "20px" }}
    >
      <h2>{league.name}</h2>

      <h3>Score Ranking</h3>
      {ranking.length > 0 ? (
        <ol>
          {ranking.map((entry) => (
            <li key={entry.player__id}>
              {entry.player__name}: {entry.total_score}
            </li>
          ))}
        </ol>
      ) : (
        <p>No match results yet.</p>
      )}

      <h3>Score Transition</h3>
      <p>Stay tune...</p>

      <h3>Players in this league</h3>
      <ul>
        {league.players && league.players.length > 0 ? (
          league.players.map((player) => (
            <li key={player.id}>
              {player.name}{" "}
              <button onClick={() => handleEditPlayer(player.id)}>
                <i className="fa-solid fa-pen"></i>
              </button>{" "}
              <button
                onClick={() => handleDeletePlayer(player.id)}
                style={{ color: "red" }}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </li>
          ))
        ) : (
          <li>No players in this league.</li>
        )}
      </ul>
      <Link to={`/league/${id}/matches/`}>
        <button>View Matches</button>
      </Link>
      <br />
      <Link to={`/league/${id}/edit`}>
        <button>Edit League Name</button>
      </Link>
      <br />
      <button onClick={handleDelete} style={{ color: "red" }}>
        Delete League
      </button>
    </div>
  );
};

export default LeagueDetail;
