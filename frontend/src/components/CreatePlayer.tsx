import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const ids = selectedOptions.map((option) => parseInt(option.value));
        setSelectedLeagueIds(ids);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        axios
            .post("http://localhost:8000/api/players/", {
                name: name,
                leagues: selectedLeagueIds, // リーグに所属しない場合も許可する
            })
            .then((response) => {
                navigate("/players"); // 作成後、プレイヤー一覧ページへリダイレクトする
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
                    <label>Select Leagues:</label>
                    <select
                        multiple
                        value={selectedLeagueIds.map(String)}
                        onChange={handleLeagueChange}
                    >
                        {leagues.map((league) => (
                            <option key={league.id} value={league.id}>
                                {league.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Create Player</button>
            </form>
        </div>
    );
};

export default CreatePlayer;
