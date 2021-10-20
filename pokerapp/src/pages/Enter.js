import "../styles/main.css";
import "../styles/modal.css"

import CreateRoom from "../components/CreateRoom";
import JoinRoomForm from "../components/JoinRoomForm";
import { useState } from "react";

import Login from "../components/Login";

function Enter({ user }) {
    const [logNewUser, setLogNewUser] = useState(false);
    const [loginMessage, setLoginMessage] = useState("Login needed to enter a room...");

    const logUser = (prompt) => {
        setLoginMessage(prompt);
        setLogNewUser(true);
    };

    return (
        <div className="main">
            <div className="mainSection createSection">
                <div className="section-container">
                    <CreateRoom user={user} logUser={logUser} />
                </div>
            </div>
            <div className="mainSection joinSection">
                <div className="section-container">
                    <JoinRoomForm user={user} logUser={logUser} />
                </div>
            </div>
            <Login display={logNewUser} message={loginMessage} close={() => setLogNewUser(false)} />
        </div>
    );
}

export default Enter;
