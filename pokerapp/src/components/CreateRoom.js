import React, { useState } from "react";
import { backendFunctions } from "../lib/firebase";
import { httpsCallable } from "@firebase/functions";
import { useHistory } from "react-router";

export default function CreateRoom({ user, logUser }) {
    const [blind, setBlind] = useState(1);
    const [opening, setOpening] = useState(100);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!loading) {
            if (!user) {
                logUser("Login needed to create a room...");
            } else {
                //TODO add input controls for int
                setLoading(true);
                const createRoom = httpsCallable(backendFunctions, "createRoom");
                const result = await createRoom({ blind: parseInt(blind), min: parseInt(opening) });
                console.log(result.data);

                history.push("/room/" + result.data.roomId);
                setLoading(false);
            }
        }
    };
    return (
        <div className="mainSectionForm">
            <form>
                <h1 className="h2">Create A New Room</h1>
                <label for="blind">Blind:</label>
                <input
                    type="number"
                    id="blind"
                    name="blind"
                    onChange={(e) => setBlind(e.target.value)}
                ></input>
                <label for="blind">Opening:</label>
                <input
                    type="number"
                    id="opening"
                    name="opening"
                    onChange={(e) => setOpening(e.target.value)}
                ></input>
                <div className="btn-container">
                    <button onClick={onSubmit} className="create-btn">
                        {loading ? "loading..." : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
}
