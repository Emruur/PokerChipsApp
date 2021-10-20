import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";

export default function Login({display,message,close}) {
    let show= display?"flex":"none";
    
    const login=()=>{
        signInWithPopup(auth,provider)
        .then(()=>close())
        .catch((err)=>console.log(err))
    }
    
    return (
        <div>
            <div id="myModal" className="modal" style={{display:show}}>
                <div className="modal-content">
                    <span className="close" onClick={()=>close()} >&times;</span>
                    
                    <h2>{message}</h2>
                    <p className="muted" >Login with a google account</p>
                    
                    <button className="btn" onClick={()=>login()}>Login with google</button>
                </div>
            </div>
        </div>
    );
}
