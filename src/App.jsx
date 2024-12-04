// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Inbox from "./pages/Inbox";
import Calendar from "./pages/Calendar";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import "./App.css";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Inbox" element={<Inbox />} />
          <Route path="/Calendar" element={<Calendar />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
