import { auth, db } from '../lib/firebase';
import { doc, onSnapshot } from "firebase/firestore";

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useUser(){
    const[userState,loading]= useAuthState(auth);
    const[user, setUser]= useState(null);
    const[isLoading, setLoading]= useState(true);

    useEffect(() => {
        let unsubscribe;
        if(userState){
            const docRef= doc(db, "users", userState.uid);

            unsubscribe= onSnapshot(docRef,(doc)=>{
                let data= doc.data();
                if(data){
                    console.log("User: "+data.name+" read from the database! and room:"+ data.currentRoom);
                    
                    setUser(data);
                    setLoading(false);
                }
                else{
                    setLoading(false);
                    console.log("No user document for the user id: "+ userState.uid);
                }
            });
        }
        else if(!loading){
            console.log("User not logged in!");
            
            setUser(null);
            setLoading(false);
        }
        else{
            console.log("loading!");
        }

        return unsubscribe;
        
    }, [userState,loading]);

    return  {user,isLoading};
}