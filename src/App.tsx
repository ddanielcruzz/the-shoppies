import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Nominations, Welcome } from "./sections";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Welcome />
        </Route>
        <Route exact path="/nominations">
          <Nominations />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
