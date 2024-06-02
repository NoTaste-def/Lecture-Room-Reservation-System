import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Logo from "./assets/logo.png";
import Welcome from "./component/Welcome";
import Main from "./component/Main";
import Reserve from "./component/Reserve";
import Office from "./component/Office";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/reservation" element={<Office />}>
          <Route path="/reservation/:id" element={<Reserve />} />
        </Route>
        <Route path="*" element={<div>404 PAGE</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
