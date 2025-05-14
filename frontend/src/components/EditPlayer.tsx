import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>EditPlayer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Player Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditPlayer;
