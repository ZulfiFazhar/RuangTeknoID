import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Bookmark from "./pages/Bookmark";
import Chatbot from "./pages/Chatbot";
import Posts from "./pages/Posts/Posts";
import Post from "./pages/Posts/Post";
import NewPosts from "./pages/Posts/NewPost";
import Threads from "./pages/Threads";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import { AuthContext } from "./components/auth/auth-context";
import api from "./api/api";
import "./App.css";

// export const AuthContext = createContext();

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
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // console.error("Token verification failed:", error);
        setAuthStatus({ authStatus: false });
      }
    };

    validateLogin();
  }, []);

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
                  </Route>
                  <Route path="/new-post" element={<NewPosts />} />
                  <Route path="/threads" element={<Threads />} />
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
