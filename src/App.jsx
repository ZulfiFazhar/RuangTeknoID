import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Bookmark from "./pages/Bookmark";
import Chatbot from "./pages/Chatbot";
import Threads from "./pages/Threads";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import SearchResult from "./pages/SearchResult";
import Users from "./pages/Users/Users";
import User from "./pages/Users/User";

// Posts Pages
import Posts from "./pages/Posts/Posts";
import Post from "./pages/Posts/Post";
import NewPosts from "./pages/Posts/NewPost";
import EditPost from "./pages/Posts/EditPost";

// Discussions Pages
import Discussions from "./pages/Discussions/Discussions";
import NewDiscussion from "./pages/Discussions/NewDiscussion";
import Discussion from "./pages/Discussions/Discussion";
import EditDiscussion from "./pages/Discussions/EditDiscussion";

import { AuthContext } from "./components/auth/auth-context";
import api from "@/api/api";
import "./App.css";

function App() {
  const [authStatus, setAuthStatus] = useState({
    authStatus: null,
  });

  useEffect(() => {
    const validateLogin = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken || !refreshToken) {
        setAuthStatus({ authStatus: false });
        return;
      }

      try {
        const response = await api.get("/user/validateLogin", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          },
        });

        // Jika token aktif sudah kadaluwarsa, server akan mengirimkan token akses baru
        if (response.data.newAccessToken) {
          localStorage.setItem("accessToken", response.data.newAccessToken);
        }

        setAuthStatus({ authStatus: true, user: response.data.data });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setAuthStatus({ authStatus: false });
      }
    };

    validateLogin();
  }, []); // Hanya dijalankan sekali saat komponen dimuat

  if (authStatus.authStatus === null) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/reset-password/*" element={<ResetPassword />} />
          <Route
            path="/*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/bookmark" element={<Bookmark />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="/posts">
                    <Route index element={<Posts />} />
                    <Route path=":postId" element={<Post />} />
                    <Route path="new" element={<NewPosts />} />
                    <Route path="edit/:postId" element={<EditPost />} />
                  </Route>
                  <Route path="/discussions">
                    <Route index element={<Discussions />} />
                    <Route path="new" element={<NewDiscussion />} />
                    <Route path=":discussionId" element={<Discussion />} />
                    <Route path="edit/:discussionId" element={<EditDiscussion />} />
                  </Route>
                  <Route path="/users">
                    <Route index element={<Users />} />
                    <Route path=":userId" element={<User />} />
                  </Route>
                  <Route path="/threads" element={<Threads />} />
                  <Route path="/search/*" element={<SearchResult />} />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
