import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface League {
    id: number;
    name: string;
}

const Leagues: React.FC = () => {
    const [leagues, setLeagues] = useState<League[]>([]);

    // コンポーネントがマウントされたときにAPIを呼び出す
    useEffect(() => {
        axios
            .get<League[]>("http://localhost:8000/api/leagues/")
            .then((response) => {
                setLeagues(response.data);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the leagues!",
                    error
                );
            });
    }, []); // 空の依存配列で、初回レンダリング時に一度だけ実行

    return (
        <div>
            <h1>League Lists</h1>
            <ul>
                {leagues.map((league) => (
                    <li key={league.id}>
                        <Link to={`/league/${league.id}`}>{league.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leagues;
