import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface League {
    id: number;
    name: string;
}

const LeagueDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [league, setLeague] = useState<League | null>(null);

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

    if (!league) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{league.name}</h1>
            <p>League ID: {league.id}</p>
        </div>
    );
};

export default LeagueDetail;
