import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Nominations } from "./sections";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/nominations">
          <Nominations />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
