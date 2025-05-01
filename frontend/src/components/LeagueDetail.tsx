import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

interface Player {
    id: number;
    name: string;
}

interface League {
    id: number;
    name: string;
    players: Player[];
}

const LeagueDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [league, setLeague] = useState<League | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get<League>(`http://localhost:8000/api/leagues/${id}/`)
            .then((response) => {
                setLeague(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the league!", error);
            });
    }, [id]);

    const handleDelete = () => {
        if (window.confirm("Do you really want to remove this league?")) {
            axios
                .delete(`http://localhost:8000/api/leagues/${id}/`)
                .then(() => {
                    navigate("/"); // リーグ一覧に戻る
                })
                .catch((error) => {
                    console.error(
                        "There was an error deleting the league!",
                        error
                    );
                });
        }
    };

    if (!league) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{league.name}</h2>
            <h3>Players in this league</h3>
            <ul>
                {league.players && league.players.length > 0 ? (
                    league.players.map(player => (
                        <li key={player.id}>{player.name}</li>
                    ))
                ) : (
                    <li>No players in this league.</li>
                )}
            </ul>
            <Link to={`/league/${id}/edit`}>
                <button>Edit League</button>
            </Link>
            <br />
            <button onClick={handleDelete} style={{ color: "red" }}>
                Delete League
            </button>
        </div>
    );
};

export default LeagueDetail;
