import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

const Welcome = () => {
  const navigate = useNavigate();
  const toReserve = () => {
    navigate("/reservation");
  };
  return (
    <div className="welcome">
      <main className="welcome-wrapper">
        <img className="welcome-logo" src={Logo} />
        <p className="welcome-text">
          {"국립"} <span style={{ color: "darkcyan" }}>한밭대</span>
          {"\n강의실\n예약시스템"}
        </p>
      </main>
      <footer
        className="welcome-next"
        // onClick={() => {
        //   toReserve();
        // }}
      >
        <span>로그인 및 회원가입을 해주세요.</span>
      </footer>
    </div>
  );
};

export default Welcome;
