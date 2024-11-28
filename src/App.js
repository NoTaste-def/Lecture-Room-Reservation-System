import React, { useState } from "react";
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

function App() {
  const navigate = useNavigate();

  const toReservation = () => {
    navigate("/reservation");
  };

  const toLogin = () => {
    navigate("/login");
  };
  const toSignup = () => {
    navigate("/signup");
  };

  return (
    <div>
      <nav className="upside_nav">
        <h2 onClick={toReservation}>강의실 예약 시스템</h2>
        <div className="upside_nav_btn_con">
          <button onClick={toLogin}>로그인</button>
          <button onClick={toSignup}>회원가입</button>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/reservation" element={<Office />}>
          <Route path="/reservation/:id" element={<Reserve />} />
        </Route>
        <Route path="/elect" element={<Elect />} />
        <Route path="*" element={<div>404 PAGE</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
