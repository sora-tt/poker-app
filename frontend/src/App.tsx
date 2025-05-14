import React from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Leagues from "./components/Leagues";
import CreateLeague from "./components/CreateLeague";
import LeagueDetail from "./components/LeagueDetail";
import EditLeague from "./components/EditLeague";
import CreatePlayer from "./components/CreatePlayer";
import CreateMatch from "./components/CreateMatch";
import EditPlayer from "./components/EditPlayer";
import MatchList from "./components/MatchList";
import EditMatch from "./components/EditMatch";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p>
            Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
        >
            Learn React
        </a> */}
        <Router>
          <div>
            <Header />
            <Routes>
              <Route path="/" element={<Leagues />} />
              <Route path="/create" element={<CreateLeague />} />
              <Route path="/league/:id" element={<LeagueDetail />} />
              <Route path="/league/:id/edit" element={<EditLeague />} />
              <Route path="/players/new" element={<CreatePlayer />} />
              <Route path="/players/:id/edit" element={<EditPlayer />} />
              <Route path="/league/:id/matches" element={<MatchList />} />
              <Route
                path="/league/:id/matches/create"
                element={<CreateMatch />}
              />
              <Route path="/matches/:matchId/edit" element={<EditMatch />} />
            </Routes>
          </div>
        </Router>
      </header>
    </div>
  );
}

export default App;
