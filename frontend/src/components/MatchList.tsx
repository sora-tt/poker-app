import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Match {
    id: number;
    date: string;
    player_stats: {
        player: number;
        score: number;
    }[];
}

const MatchList: React.FC = () => {
    const { id: leagueId } = useParams<{ id: string }>();
    const [matches, setMatches] = useState<Match[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get<Match[]>(
                `http://localhost:8000/api/matches/?league=${leagueId}`
            )
            .then((response) => {
                const sortedMatches = response.data.sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setMatches(sortedMatches);
            })
            .catch((error) =>
                console.error("Failed to fetch matches for this league", error)
            );
    }, [leagueId]);

    const handleEdit = (matchId: number) => {
        navigate(`/matches/${matchId}/edit`);
    };

    const handleDelete = (matchId: number) => {
        if (window.confirm("Are you sure you want to delete this match?")) {
            axios
                .delete(`http://localhost:8000/api/matches/${matchId}/`)
                .then(() => {
                    setMatches((prev) => prev.filter((m) => m.id !== matchId));
                })
                .catch((error) => {
                    console.error("Failed to delete match", error);
                });
        }
    };

    return (
        <div>
            <h2>MatchList</h2>
            <Link to={`/league/${leagueId}/matches/create`}>
                <button>Create Match</button>
            </Link>
            <br />
            <Link to={`/league/${leagueId}`}>
                <button>Return</button>
            </Link>
            <ul>
                {matches.length > 0 ? (
                    matches.map((match) => (
                        <li key={match.id}>
                            {match.date}{" "}
                            <button onClick={() => handleEdit(match.id)}>
                                Edit
                            </button>{" "}
                            <button
                                onClick={() => handleDelete(match.id)}
                                style={{ color: "red" }}
                            >
                                Delete
                            </button>
                        </li>
                    ))
                ) : (
                    <li>No matches found for this league.</li>
                )}
            </ul>
        </div>
    );
};

export default MatchList;
