import { useEffect, useState } from "react";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [ok, setOk] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/auth/me", { 
          withCredentials: true 
        });
        console.log('Auth check successful:', response.data);
        setOk(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        setOk(false);
      }
    };

    checkAuth();
  }, []);

  if (ok === null) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return ok ? children : window.location.replace("/");
}
