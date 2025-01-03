import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Bookmark from "./pages/Bookmark";
import Chatbot from "./pages/Chatbot";
import Posts from "./pages/Posts";
import NewPosts from "./pages/Posts/NewPost";
import Threads from "./pages/Threads";
import PrivateRoute from "./components/auth/PrivateRoute";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/reset-password/*" element={<ResetPassword />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/bookmark" element={<Bookmark />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="/posts" element={<Posts />} />
                  <Route path="/new-post" element={<NewPosts />} />
                  <Route path="/threads" element={<Threads />} />
                </Routes>
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
