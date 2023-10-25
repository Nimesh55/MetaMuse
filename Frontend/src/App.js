import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import SearchApp from "./components/SearchApp";
import PoemSearch from "./components/PoemSearch";
import PoetSearch from "./components/PoetSearch";
import MetaphorSearch from "./components/MetaphorSearch";

function App() {
  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<SearchApp />} />
            <Route path="/poem" element={<PoemSearch />} />
            <Route path="/poet" element={<PoetSearch />} />
            <Route path="/metaphor" element={<MetaphorSearch />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
