import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Enter from "./pages/Enter";
import Room from "./pages/Room";
import { useUser } from "./lib/hooks";


export default function App() {
    const { user, isLoading } = useUser();
    

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/">
                        {user?.currentRoom ? <Redirect to={"/room/"+user.currentRoom} />: <Enter user={user} />}
                    </Route>
                    <Route path="/room/:id">
                        {user? (
                            <Room user={user} />
                        ) : (
                            <Redirect to="/" />
                        )}
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
