import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import api from "@/api/api";
import { useEffect, useState, createContext } from "react";

export const AuthContext = createContext();

const PrivateRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null);

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
        setAuthStatus({ authStatus: true, user: response.data.data });
      } catch (error) {
        console.error("Token verification failed:", error);
        setAuthStatus({ authStatus: false });
      }
    };

    validateLogin();
  }, []);

  // Render hanya jika status autentikasi sudah dipastikan
  if (authStatus === null) return <div>Loading...</div>;

  return authStatus.authStatus ? (
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  ) : (
    <Navigate to="/login" replace />
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
