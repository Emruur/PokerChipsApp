import React from "react";
import "../styles/controlBar.css";
import { backendFunctions } from "../lib/firebase";
import { httpsCallable } from "@firebase/functions";

export default function ControlBar({ isTurn, roomData, currentBet, index }) {
    const activeLogic=isTurn?" active":null;
    const bet = httpsCallable(backendFunctions, "bet");


    //TODO implement raise button
    //TODO implement fold button
    

    const check= async ()=>{
        if(isTurn){console.log(roomData.roomId)
            
            await bet({roomId: roomData.roomId, bet: currentBet, index:index});}
        
    };

    return (
        <div className="controlBar">
            <container className="btn-cont">
                <i class={"bi bi-x-circle x "+activeLogic}></i>

                <i onClick={check} class={"bi bi-check-circle c "+ activeLogic}></i>
                <i className={"bi bi-arrow-up-circle r "+activeLogic}></i>
            </container>
        </div>
    );
}
