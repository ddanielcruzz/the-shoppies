import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Nominations, Submitted, Welcome } from "./sections";

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
        <Route exact path="/submitted">
          <Submitted />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
