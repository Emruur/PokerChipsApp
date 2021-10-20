import React, { useState } from "react";
import { backendFunctions } from "../lib/firebase";
import { httpsCallable } from "@firebase/functions";
import { useHistory } from "react-router";

export default function JoinRoomForm({ user, logUser }) {
    const [alert, setAlert] = useState(false);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const history= useHistory();
    

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!loading) {
            if (!user) {
                logUser("Login needed to join a room...");
            } else {
                setLoading(true);
                const checkRoom = httpsCallable(backendFunctions, "checkRoom");
                const result = await checkRoom({ roomId: code });
                if (result.data.room !== null) {
                    history.push(/room/+code);

                    setLoading(false);
                } else {
                    setLoading(false);
                    setAlert(true);
                }
            }
        }
    };
    return (
        <div className="mainSectionForm">
            <form>
                <h1>Join A Room</h1>
                <label for="rno">Enter Room Code:</label>
                <input
                    type="text"
                    id="rno"
                    name="rno"
                    onChange={(e) => setCode(e.target.value)}
                ></input>

                {alert ? (
                    <div className="alert">
                        <span className="closebtn" onClick={() => setAlert(false)}>
                            &times;
                        </span>
                        No Room Found!
                    </div>
                ) : null}

                <div className="btn-container ">
                    <button onClick={onSubmit} className="join-btn">
                        {loading ? "loading..." : "Join"}
                    </button>
                </div>
            </form>
        </div>
    );
}
