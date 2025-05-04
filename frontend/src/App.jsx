import { useState, useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RoomEntry from "./Components/Room.jsx";
import UserManage from "./Components/UserManage.jsx";
const MainLayout = lazy(() => import("./Components/MainLayout.jsx"));
const Login = lazy(() => import("./Components/Auth/Login/Login.jsx"));
const Ragister = lazy(() => import("./Components/Auth/Ragister/Ragister.jsx"));
import Toast from "./Components/Toast/Toast.jsx";
import { getCookie } from "./Const/contant.js";
export function App() {
  const [token, setToken] = useState(getCookie("token") || null);

  useEffect(() => {
    const storedToken = getCookie("token");
    // console.log(storedToken)
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  const handleLoginSuccess = (tok) => {
    // localStorage.setItem("token", tok); // Store token
    setToken(tok);
  };
  // console.log(token);

  return (
    <>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Protected Routes */}
            <Route
              path="/room/:roomid"
              element={token ? <MainLayout /> : <Navigate to="/login" />}
            />
            <Route
              path="/user"
              element={token ? <UserManage /> : <Navigate to="/login" />}
            />

            {/* Public Routes */}
            <Route
              path="/ragister"
              element={!token ? <Ragister /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={
                !token ? (
                  <Login onSuccess={handleLoginSuccess} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* Default Route */}
            <Route path="/" element={<RoomEntry token={token} />} />
          </Routes>
        </Suspense>
      </Router>
      <Toast />
    </>
  );
}

export default App;
