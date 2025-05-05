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

    useEffect(() => {
        if (id) {
            axios
                .get<Player>(`http://localhost:8000/api/players/${id}/`)
                .then((response) => {
                    setPlayer(response.data);
                    setName(response.data.name);
                })
                .catch((error) => {
                    console.error("Error fetching player:", error);
                });
        }
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        axios
            .put(`http://localhost:8000/api/players/${id}/`, {
                name: name,
            })
            .then(() => {
                // 編集後に元のページやリーグ詳細に戻す
                navigate(-1);
            })
            .catch((error) => {
                console.error("Error updating player:", error);
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
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditPlayer;
