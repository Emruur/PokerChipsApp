import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "@firebase/firestore";
import { db } from "../lib/firebase";
import { useHistory } from "react-router";
import JoinGame from "../components/JoinGame";
import GameBar from "../components/GameBar";
import Players from "../components/Players";
import ControlBar from "../components/ControlBar";

export default function Room({ user }) {
    //TODO implement a way to store the total amount betted by a player in a round so that 
    //the player can add the needed amount of bet when the origin changes
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [roomData, setRData] = useState({});
    const [noRoomErr, setNoRoomErr] = useState(false);
    const [firstEnter, setFirstEnter] = useState(false);
    const [userIndex, setUserIndex] = useState(0);
    const [isTurn, setIsTurn] = useState(false);

    const blind = roomData?.blindTemp;

    const [isFirstRound, setIsFirstRound] = useState(true);
    const [currentBet, setCurrentBet] = useState(blind);

    const history = useHistory();

    useEffect(() => {
        console.log(isFirstRound);
        if (!isFirstRound) {
            setCurrentBet(roomData.roundBets.at(-1).bet);
        } else {
            setCurrentBet(roomData.blindTemp);
        }
        if (!Object.keys(roomData).length === 0) {
            console.log(roomData.firstEnter);
            setIsFirstRound(roomData.firstEnter);
        }
    }, [
        roomData.roundBets,
        roomData.turn,
        roomData.round,
        isFirstRound,
        roomData.firstRound,
        roomData,
    ]);

    function checkFirstEnter(players) {
        const filtered = players.filter((player) => player.userId === user.id);
        
        const exists = filtered.length === 0 ? false : true;

        return !exists;
    }

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "rooms", id), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setRData(data);
                setFirstEnter(checkFirstEnter(data.players));
                setLoading(false);
            } else {
                setNoRoomErr(true);
                setLoading(false);
            }

            return unsub;
        });
    }, []);

    useEffect(() => {
        let players = roomData?.players;
        for (let i = 0; i < players?.length; i++) {
            const player = players[i];

            if (player.userId === user.id) {
                setUserIndex(i);
                break;
            }
        }
    }, [roomData?.players]);

    useEffect(() => {
        if (roomData.turn === userIndex) {
            setIsTurn(true);
        } else {
            setIsTurn(false);
        }
    }, [roomData.turn, userIndex]);

    if (loading) {
        return <div className="loading">Room {id} Loading...</div>;
    } else if (noRoomErr) {
        setTimeout(() => {
            history.push("/");
        }, 3000);
        return <div className="loading">No Room Found :( Returning to main screen...</div>;
    } else {
        console.log(roomData);
        return (
            <div className="">
                <div className="room">
                    <GameBar
                        user={user}
                        roomData={roomData}
                        isFirstRound={isFirstRound}
                        currentBet={currentBet}
                    />
                    <Players room={roomData} userIndex={userIndex} />
                    <ControlBar isTurn={isTurn} roomData={roomData} currentBet={currentBet} index={userIndex} />
                </div>
                <JoinGame
                    display={firstEnter}
                    minBet={roomData?.minEnterance}
                    roomId={roomData?.roomId}
                    close={() => setFirstEnter(false)}
                />
            </div>
        );
    }
}
