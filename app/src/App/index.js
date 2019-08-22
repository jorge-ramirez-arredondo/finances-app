import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";

import AppRouter from "./AppRouter";
import NavBar from "./NavBar";

function App() {
  return (
  	<Router>
  		<NavBar />
	    <AppRouter />
  	</Router>
  );
}

export default App;
