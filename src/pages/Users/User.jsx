import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/api";

function User() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get(`user/users/${userId}`);
        setUser(res.data.data);
      } catch (error) {
        console.log(error);
        alert("User not found");
      }
    };
    getUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold">User Detail</h1>
      <p>Id : {user.id}</p>
      <p>Name : {user.name}</p>
      <p>Email : {user.email}</p>
    </div>
  );
}

export default User;
