import "./App.css";
import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import Main from "./components/Main";
import NavBar from "./components/Navigation/NavBar";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <NavBar />
        <Main />
      </BrowserRouter>
    );
  }
}

export default App;
