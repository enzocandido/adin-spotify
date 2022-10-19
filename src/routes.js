import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Spotify from "./App";
import Home from "./Home";

const Routes = () => {
    return(
        <BrowserRouter>
            <Route component = { Home }  path="/" exact />
            <Route component = { Spotify }  path="/spotify" />
        </BrowserRouter>
    )
 }
 
 export default Routes;