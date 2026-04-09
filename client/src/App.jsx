import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import authService from "./services/Auth.js";
import Loader from "./components/Loader.jsx";
import { login, logout } from "./app/authslice";
import { Outlet, useLocation } from "react-router-dom";
import API from "./api/axios.js";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      authService
        .getCurrentUser()
        .then((userData) => {
          if (userData) dispatch(login(userData));
          else {
            dispatch(logout());
            localStorage.removeItem("accessToken");
          }
        })
        .catch(() => {
          dispatch(logout());
          localStorage.removeItem("accessToken");
        })
        .finally(() => setLoading(false));
    } else {
      dispatch(logout());
      setLoading(false);
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <main>
        {loading ? <Loader /> : <Outlet />}
      </main>
    </div>
  );
}
export default App;