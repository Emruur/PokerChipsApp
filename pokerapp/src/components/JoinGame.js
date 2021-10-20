import { useState } from "react";
import { useHistory } from "react-router";
import { backendFunctions } from "../lib/firebase";
import { httpsCallable } from "@firebase/functions";

export default function JoinGame({ display, minBet, roomId, close }) {
    const show = display ? "flex" : "none";
    const [enteranceBet, setEnteranceBet] = useState(minBet);
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        
        setLoading(true);
        const addUserToRoom = httpsCallable(backendFunctions, "addUserToRoom");
        await addUserToRoom({ enterance: enteranceBet, roomId: roomId });
        close();
    };

    return (
        <div>
            <div id="myModal" className="modal" style={{ display: show }}>
                <div className="modal-content">
                    <span className="close" onClick={() => history.push("/")}>
                        &times;
                    </span>
                    <h2>Join Game</h2>

                    <p className="muted">Select the amount you want to join the game</p>

                    <input
                        type="range"
                        min={minBet}
                        max={minBet * 10}
                        onInput={(e) => setEnteranceBet(e.target.value)}
                    ></input>
                    <p style={{ marginTop: "0" }}>{enteranceBet} $</p>

                    <button style={{ marginTop: "2rem" }} className="btn" onClick={()=>submit()}>
                        {loading ? "loading..." : "Join Game"}
                    </button>
                </div>
            </div>
        </div>
    );
}
