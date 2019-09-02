import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";

import AppRouter from "./AppRouter";
import AppProviders from "./AppProviders";
import NavBar from "./NavBar";

function App() {
  return (
    <AppProviders>
    	<Router>
    		<NavBar />
  	    <AppRouter />
    	</Router>
    </AppProviders>
  );
}

export default App;
