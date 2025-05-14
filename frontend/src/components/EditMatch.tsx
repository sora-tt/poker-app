import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

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

        // const playerIds = matchData.player_stats.map((ps) => ps.player);

        // const playerResponses = await Promise.all(
        //     playerIds.map((id) =>
        //         axios.get<Player>(
        //             `http://localhost:8000/api/players/${id}/`
        //         )
        //     )
        // );
        // const playerData = playerResponses.map(
        //     (response) => response.data
        // );
        // setPlayers(playerData);

        const res = await axios.get<Player[]>(
          // `http://localhost:8000/api/players/?league=${matchData.league}`
          `http://localhost:8000/api/leagues/${matchData.league}/players/`
        );
        console.log(res.data);
        setLeaguePlayers(res.data);
      })
      .catch((error) => {
        console.error("Failed to fetch match data", error);
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
      });
  };

  if (!match) return <div>Loading...</div>;

  return (
    <div>
      <h2>EditMatch</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <h3>Select Players:</h3>
          {leaguePlayers.map((player) => (
            <label key={player.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={selectedPlayerIds.includes(player.id)}
                onChange={(e) =>
                  handlePlayerToggle(player.id, e.target.checked)
                }
              />
              {player.name}
            </label>
          ))}
        </div>

        <div>
          <h3>Enter Scores:</h3>
          {selectedPlayerIds.map((id) => {
            const player = leaguePlayers.find((p) => p.id === id);
            return (
              <div key={id}>
                <label>
                  Score of {player?.name}:
                  <input
                    type="number"
                    value={scores[id] || ""}
                    onChange={(e) =>
                      handleScoreChange(String(id), e.target.value)
                    }
                    required
                  />
                </label>
              </div>
            );
          })}
        </div>

        <button type="submit">Edit Match</button>
      </form>
      <Link to={`/league/${match.league}/matches`}>
        <button>Cancel</button>
      </Link>
    </div>
  );
};

export default EditMatch;
