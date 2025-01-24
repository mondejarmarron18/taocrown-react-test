import React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LaunchersView from "./views/LaunchersView";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" component={LaunchersView} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
