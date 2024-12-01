import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import style from "./Login.module.css";
import logo from "../assets/logo.png";
import Non from "../assets/Non.svg";
import Yes from "../assets/Yes.svg";

const Login = ({ setIsLoggedIn }) => {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [loginWait, setLoginWait] = useState(false);
  const [userInfo, setUserInfo] = useState("");

  const serverAddress =
    "https://port-0-room-reservations-umnqdut2blqqevwyb.sel4.cloudtype.app/login";

  const navigate = useNavigate();

  const IdChangeHandler = (event) => {
    setUserId(event.target.value);
  };

  const PwChangeHandler = (event) => {
    setUserPw(event.target.value);
  };

  const WainLoginHandler = () => {
    setLoginWait(!loginWait);
  };

  const LoginSubmitHandler = async () => {
    if (loginWait) {
      localStorage.setItem("Id", userId);
      localStorage.setItem("Pw", userPw);
    }

    try {
      const response = await axios.post(serverAddress, {
        studentNumber: userId,
        password: userPw,
      });

      const user_data = {
        name: response.data.name,
        phone: response.data.phone,
        studentNumber: response.data.studentNumber,
      };
      const access_token = response.data.access;
      setUserInfo(user_data);

      // 액세스 토큰 저장
      localStorage.setItem("AccessToken", access_token);
      document.cookie = `AccessToken=${access_token}; path=/; max-age=30000; Secure; SameSite=Strict`;

      // 로그인 상태 업데이트
      setIsLoggedIn(true);

      console.log(response.data);
      alert("로그인 성공!");
      navigate("/reservation");
    } catch (error) {
      alert("로그인 실패!");
      console.error("로그인 오류: ", error);
    }
  };

  const SignUpSubmitBtn = () => {
    navigate("/SignUp");
  };

  return (
    <div>
      {/* 로고 섹션 (필요에 따라 주석 해제) */}
      {/* <div className={style.logo_con}>
        <img src={logo} className={style.logoImg} alt="Logo" />
      </div> */}
      <div className={style.login_container}>
        <div className={style.login_input_container}>
          <h2>로그인</h2>
          <div className={style.Id_container}>
            <label>학번</label>
            <input
              type="text"
              value={userId}
              onChange={IdChangeHandler}
              className={style.Input_id}
            />
          </div>
          <div className={style.Pw_container}>
            <label>비밀번호</label>
            <input
              type="password"
              value={userPw}
              onChange={PwChangeHandler}
              className={style.Input_pw}
            />
          </div>
          <div className={style.waitLogin} onClick={WainLoginHandler}>
            {!loginWait ? (
              <img src={Non} alt="Not checked" />
            ) : (
              <img src={Yes} alt="Checked" />
            )}
            <div>로그인 상태 유지</div>
          </div>
          <div className={style.btnCon}>
            <button className={style.loginBtn} onClick={LoginSubmitHandler}>
              로그인
            </button>
          </div>
        </div>
        <div className={style.info_container}>
          <div>Find Id</div>
          <div>Find Pw</div>
          <div className={style.SignUp} onClick={SignUpSubmitBtn}>
            Sign up
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
