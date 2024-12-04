// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Bookmark from "./pages/Bookmark";
import Chatbot from "./pages/Chatbot";
import Posts from "./pages/Posts";
import Threads from "./pages/Threads";
import "./App.css";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/threads" element={<Threads />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
