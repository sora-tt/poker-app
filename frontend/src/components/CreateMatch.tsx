import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { match } from "assert";

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
    const [scores, setScores] = useState<{ [playerId: string]: string }>({});
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
        setScores({});
    };

    const handleCheckboxChange = (playerId: string) => {
        setSelectedPlayers((prevSelected) => {
            if (prevSelected.includes(playerId)) {
                const updated = prevSelected.filter((id) => id !== playerId);
                const newScores = { ...scores };
                delete newScores[playerId];
                setScores(newScores);
                return updated;
            } else {
                setScores((prev) => ({ ...prev, [playerId]: "" }));
                return [...prevSelected, playerId];
            }
        });
    };

    // const handlePlayerSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const options = Array.from(
    //         e.target.selectedOptions,
    //         (opt) => opt.value
    //     );
    //     setSelectedPlayers(options);

    //     setScores((prevScores) => {
    //         const newScores: { [playerId: string]: string } = {};
    //         options.forEach((id) => {
    //             newScores[id] = prevScores[id] || "";
    //         });
    //         return newScores;
    //     });
    // };

    const handleScoreChange = (playerId: string, value: string) => {
        setScores((prevScores) => ({
            ...prevScores,
            [playerId]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const leagueId = parseInt(selectedLeague);
        if (isNaN(leagueId)) return;

        const matchData = {
            league: leagueId,
            date: date,
            players: selectedPlayers.map((id) => parseInt(id)),
            player_stats: selectedPlayers.map((id) => ({
                player: parseInt(id),
                score: parseFloat(scores[id]) || 0,
            })),
        };

        console.log(matchData);

        axios
            .post("http://localhost:8000/api/matches/", matchData)
            .then(() => {
                navigate(`/league/${matchData.league}/matches`); // 作成後にトップへ戻る（必要ならルートを変更してください）
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
                    <h3>Select Players:</h3>
                    {players.map((player) => (
                        <div key={player.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={player.id}
                                    checked={selectedPlayers.includes(
                                        player.id.toString()
                                    )}
                                    onChange={() =>
                                        handleCheckboxChange(
                                            player.id.toString()
                                        )
                                    }
                                />
                            </label>
                            {player.name}
                        </div>
                    ))}
                </div>

                <div>
                    <h3>Enter Scores:</h3>
                    {selectedPlayers.length !== 0 ? (selectedPlayers.map((playerId) => {
                        const player = players.find(
                            (p) => p.id === parseInt(playerId)
                        );
                        return (
                            <div key={playerId}>
                                <label>
                                    Score of {player?.name}:
                                    <input
                                        type="number"
                                        value={scores[playerId] || ""}
                                        onChange={(e) =>
                                            handleScoreChange(
                                                playerId,
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </label>
                            </div>
                        );
                    })) : (
                        <p>No Players here.</p>
                    )}
                </div>

                <button type="submit">Create Match</button>
            </form>
            <Link to={`/league/${leagueIdFromParams}/matches`}>
                <button>Cancel</button>
            </Link>
        </div>
    );
};

export default CreateMatch;
