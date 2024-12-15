import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken) {
          // Jika accessToken ada, langsung autentikasi
          setIsAuthenticated(true);
        } else if (refreshToken) {
          // Jika accessToken tidak ada tetapi refreshToken ada
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/user/refresh-token`,
            { refreshToken }
          );

          const { accessToken: newAccessToken } = response.data;

          // Simpan accessToken baru
          localStorage.setItem("accessToken", newAccessToken);
          setIsAuthenticated(true);
        } else {
          // Tidak ada accessToken dan refreshToken
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  // Render hanya jika status autentikasi sudah dipastikan
  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
