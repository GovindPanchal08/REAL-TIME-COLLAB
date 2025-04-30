import { useState, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RoomEntry from "./Components/Room.jsx";
import UserManage from "./Components/UserManage.jsx";
import { getCookie } from "./Const/contant.js";
const MainLayout = lazy(() => import("./Components/MainLayout.jsx"));
const Login = lazy(() => import("./Components/Auth/Login/Login.jsx"));
const Ragister = lazy(() => import("./Components/Auth/Ragister/Ragister.jsx"));
import Toast from "./Components/Toast/Toast.jsx";
export function App() {
  const [token, setToken] = useState(getCookie("token"));
  const handleLoginSuccess = (tok) => {
    setToken(tok);
  };
  return (
    <>
      <Router>
        <Suspense fallback={<div></div>}>
          <Routes>
            {/* If the token is not present, redirect to login */}
            <Route
              path="/room/:roomid"
              element={token ? <MainLayout /> : <Navigate to="/login" />}
            />
            {/* Unauthenticated routes */}
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
            <Route
              path="/user"
              element={token ? <UserManage /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<RoomEntry token={token} />} />
          </Routes>
        </Suspense>
      </Router>
      <Toast />
    </>
  );
}

export default App;
