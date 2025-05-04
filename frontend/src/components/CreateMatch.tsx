import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface Player {
    id: number;
    name: string;
    leagues: {
        id: number;
        name: string;
    }[];
}

interface League {
    id: number;
    name: string;
    players: Player[];
}

const CreateMatch: React.FC = () => {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedLeague, setSelectedLeague] = useState<string>("");
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [date, setDate] = useState("");
    const navigate = useNavigate();
    const { id: leagueIdFromParams } = useParams<{ id: string }>();

    useEffect(() => {
        axios
            .get<League[]>("http://localhost:8000/api/leagues/")
            .then((response) => setLeagues(response.data))
            .catch((error) => console.error("Error fetching leagues:", error));

        axios
            .get<Player[]>("http://localhost:8000/api/players/")
            .then((response) => {
                setAllPlayers(response.data);
                if (leagueIdFromParams) {
                    setSelectedLeague(leagueIdFromParams);
                    const leagueId = parseInt(leagueIdFromParams);
                    const filtered = response.data.filter((player) =>
                        player.leagues.some((league) => league.id === leagueId)
                    );
                    setPlayers(filtered);
                }
            })
            .catch((error) => console.error("Error fetching players:", error));
    }, [leagueIdFromParams]);

    const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedLeague(value);

        const leagueId = parseInt(value);
        // 選択されたリーグに所属するプレイヤーだけを抽出
        if (!isNaN(leagueId)) {
            const filtered = allPlayers.filter((player) =>
                player.leagues.some((league) => league.id === leagueId)
            );
            setPlayers(filtered);
        } else {
            setPlayers([]);
        }
        setSelectedPlayers([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const leagueId = parseInt(selectedLeague);
        if (isNaN(leagueId)) return;

        axios
            .post("http://localhost:8000/api/matches/", {
                league: selectedLeague,
                players: selectedPlayers.map((id) => parseInt(id)),
                date: date,
            })
            .then(() => {
                navigate("/"); // 作成後にトップへ戻る（必要ならルートを変更してください）
            })
            .catch((error) => {
                console.error("There was an error creating the match!", error);
            });
    };

    return (
        <div>
            <h2>Create New Match</h2>
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
                {/* League選択はルートにIDがあるときは非表示 */}
                {!leagueIdFromParams && (
                    <div>
                        <label>League:</label>
                        <select
                            value={selectedLeague}
                            onChange={handleLeagueChange}
                            required
                        >
                            <option value="">Select a league</option>
                            {leagues.map((league: any) => (
                                <option key={league.id} value={league.id}>
                                    {league.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <label>Players:</label>
                    <select
                        multiple
                        value={selectedPlayers}
                        onChange={(e) => {
                            const options = Array.from(
                                e.target.selectedOptions,
                                (opt) => opt.value
                            );
                            setSelectedPlayers(options);
                        }}
                    >
                        {players.map((player: any) => (
                            <option key={player.id} value={player.id}>
                                {player.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Create Match</button>
            </form>
        </div>
    );
};

export default CreateMatch;
