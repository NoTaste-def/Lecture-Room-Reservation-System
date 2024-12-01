import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Logo from "./assets/logo.png";
import Welcome from "./component/Welcome";
import Main from "./component/Main";
import Reserve from "./component/Reserve";
import Office from "./component/Office";
import Elect from "./component/Elect";
import Login from "./component/Login";
import SignUp from "./component/SignUp";

import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // 수정된 부분

axios.defaults.withCredentials = true; // 쿠키를 요청에 포함

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("AccessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // 수정된 부분
        const currentTime = Date.now() / 1000; // 밀리초를 초로 변환
        if (decodedToken.exp > currentTime) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          Cookies.remove("AccessToken");
        }
      } catch (error) {
        console.error("토큰 디코딩 오류:", error);
        setIsLoggedIn(false);
        Cookies.remove("AccessToken");
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toReservation = () => {
    navigate("/reservation");
  };

  const toLogin = () => {
    navigate("/login");
  };
  const toSignup = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    Cookies.remove("AccessToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div>
      <nav className="upside_nav">
        <h2 onClick={toReservation}>강의실 예약 시스템</h2>
        <div className="upside_nav_btn_con">
          {isLoggedIn ? (
            <button onClick={handleLogout}>로그아웃</button>
          ) : (
            <>
              <button onClick={toLogin}>로그인</button>
              <button onClick={toSignup}>회원가입</button>
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/reservation" element={<Office />}>
          <Route path="/reservation/:id" element={<Reserve />} />
        </Route>
        <Route path="/elect" element={<Elect />} />
        <Route path="*" element={<div>404 PAGE</div>} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
