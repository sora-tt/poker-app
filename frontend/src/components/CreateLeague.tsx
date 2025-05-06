import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateLeague = () => {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        axios
            .post("http://localhost:8000/api/leagues/", { name })
            .then((response) => {
                console.log("League created:", response.data);
                setName("");
                navigate("/"); // 作成成功したらリーグ一覧に移動！
            })
            .catch((error) => {
                console.error("Error creating league:", error);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(evt) => setName(evt.target.value)}
                    placeholder="Input League Name"
                />
                <button type="submit">Create League</button>
            </form>
        </div>
    );
};

export default CreateLeague;
