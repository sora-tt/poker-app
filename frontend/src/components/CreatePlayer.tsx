import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePlayer = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [league, setLeague] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios
            .post("http://localhost:8000/api/players/", {
                name: name,
                league: league || null, // リーグに所属しない場合も許可する
            })
            .then((response) => {
                navigate("/players"); // 作成後、プレイヤー一覧ページへリダイレクトする予定
            })
            .catch((error) => {
                console.error("There was an error creating the player!", error);
            });
    };

    return (
        <div>
            <h2>Create New Player</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Player name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>League ID (optional):</label>
                    <input
                        type="text"
                        value={league}
                        onChange={(e) => setLeague(e.target.value)}
                    />
                </div>
                <button type="submit">Create Player</button>
            </form>
        </div>
    );
};

export default CreatePlayer;
