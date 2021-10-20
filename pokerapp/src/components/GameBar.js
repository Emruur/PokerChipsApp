import React from "react";
import "../styles/gameBar.css";
import { backendFunctions } from "../lib/firebase";
import { httpsCallable } from "@firebase/functions";
import { useState} from "react";

import Modal from "./Modal";

export default function GameBar({ user, roomData , isFirstRound, currentBet}) {
    const [leaving, setleaving] = useState(false);
    
    const isHost = roomData.host === user.id;
    const totalBet= roomData.totalBet;

    const [alert, setAlert] = useState(false);

    const leaveRoom = httpsCallable(backendFunctions, "leaveRoom");
    const submit = async () => {
        if (!isHost) {
            setleaving(true);
            await leaveRoom({ roomId: roomData.roomId });
            console.log("Why not running");
            window.location.assign("/");
            
        } else {
            setAlert(true);
        }
    };

    const deleteRoom = httpsCallable(backendFunctions, "deleteRoom");
    const deleteRoomSubmit = async () => {
        setleaving(true);
        await deleteRoom({ roomId: roomData.roomId });
    };
    if (leaving) {
        return <div className="loading">Leaving room...</div>;
    }
    return (
        <div>
            <div className="gameBar">
                <button className="btn btn-alert" onClick={submit}>
                    Leave
                </button>

                <p className="total-bet">Total Bet: {totalBet}$</p>

                {isFirstRound ? <p>Blind: {currentBet}$</p> : <p>Cureent Bet: {currentBet}$</p>}
            </div>
            <Modal
                close={() => setAlert(false)}
                display={alert}
                content={
                    <div>
                        <p>
                            Leaving the room as host will also delete all the contents of the room!!
                        </p>
                        <button className="btn btn-alert" onClick={deleteRoomSubmit}>
                            Delete Room
                        </button>
                    </div>
                }
            />
        </div>
    );
}
