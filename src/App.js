import React, { Component } from "react";
import logo from "./logo.svg";
import UserInfo from "./components/UserInfo";

class App extends Component {
  render() {
    return (
      <div
        style={{ display: "flex", justifyContent: "center" }}
        className="App"
      >
        <UserInfo />
      </div>
    );
  }
}

export default App;
