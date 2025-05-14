import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface League {
  id: number;
  name: string;
}

const EditLeague = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    axios
      .get<League>(`http://localhost:8000/api/leagues/${id}/`)
      .then((response) => {
        setName(response.data.name);
      })
      .catch((error) => {
        console.error("There was an error fetching the league!", error);
      });
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .put(`http://localhost:8000/api/leagues/${id}/`, { name })
      .then(() => {
        navigate(`/league/${id}`);
      })
      .catch((error) => {
        console.error("There was an error updating the league!", error);
      });
  };

  return (
    <div>
      <h2>Edit League</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="League Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditLeague;
