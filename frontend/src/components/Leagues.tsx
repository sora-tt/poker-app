import React, { useEffect, useState } from "react";
import axios from "axios";

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
        console.error("There was an error fetching the leagues!", error);
      });
  }, []); // 空の依存配列で、初回レンダリング時に一度だけ実行

  return (
    <div>
      <ul>
        {leagues.map((league) => (
          <li key={league.id}>{league.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Leagues;
