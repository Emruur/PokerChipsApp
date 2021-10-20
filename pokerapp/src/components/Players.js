import React from "react";
import "../styles/players.css";

export default function Players({ room, userIndex }) {
    return (
        <ul className="players">
            {room.players.map((player, i) => {
                if (userIndex === i) {
                    if (room.turn !== i) {
                        return (
                            <li className="player self">
                                <p>{player.userId}</p> <p>{player.bank}</p>
                            </li>
                        );
                    } else {
                        return (
                            <li className="player turn self">
                                <p>{player.userId}</p> <p>{player.bank}</p>
                            </li>
                        );
                    }
                } else {
                    if (room.turn !== i) {
                        return (
                            <li className="player">
                                <p>{player.userId}</p> <p>{player.bank}</p>
                            </li>
                        );
                    } else {
                        return (
                            <li className="player turn">
                                <p>{player.userId}</p> <p>{player.bank}</p>
                            </li>
                        );
                    }
                }
            })}
        </ul>
    );
}
