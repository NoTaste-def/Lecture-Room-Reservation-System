import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import style from "./Login.module.css";
import logo from "../assets/logo.png";
import Non from "../assets/Non.svg";
import Yes from "../assets/Yes.svg";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [loginWait, setLoginWait] = useState(false);
  const [userInfo, setUserInfo] = useState("");

  const serverAddress =
    "https://port-0-haranglogin-9zxht12blqj9n2fu.sel4.cloudtype.app/login";

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

    // 로그인 요청을 버튼을 눌렀을 때만 수행
    try {
      const response = await axios.post(serverAddress, {
        studentNumber: userId,
        password: userPw,
      });
      setUserInfo(response.data);
      console.log(response.data);

      // 로그인 성공 시 다른 페이지로 이동
      navigate("/dashboard"); // 예시로 '/dashboard'로 이동
    } catch (error) {
      console.error("error fetching users: ", error);
    }
  };

  const SignUpSubmitBtn = () => {
    navigate("/SignUp");
  };

  return (
    <div>
      {/* <div className={style.logo_con}>
        <img src={logo} className={style.logoImg} alt="Logo" />
      </div> */}
      <div className={style.login_container}>
        <div className={style.login_input_container}>
          <h2>로그인</h2>
          <div className={style.Id_container}>
            <label>ID</label>
            <input
              type="text"
              value={userId}
              onChange={IdChangeHandler}
              className={style.Input_id}
            />
          </div>
          <div className={style.Pw_container}>
            <label>PW</label>
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
