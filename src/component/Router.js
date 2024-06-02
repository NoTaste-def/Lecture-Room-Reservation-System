import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./Main";
import Reserve from "./Reserve";

const Router = () => {
  return (
    <>
      <header>강의실 예약 시스템</header>
      <nav>강의실 선택 내비</nav>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<div>404 PAGE</div>} />
          <Route path="/reservation" element={<Reserve />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
