import React, { useState } from "react";
import axios from "axios";
import style from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log({ name, phone, studentId, password });

    const serverAddress =
      "https://port-0-room-reservations-umnqdut2blqqevwyb.sel4.cloudtype.app/register";

    try {
      const response = await axios.post(serverAddress, {
        name: name,
        phone: phone,
        studentNumber: studentId,
        password: password,
      });
      alert("회원가입 성공!");
      console.log("회원가입 성공:", response.data);
      navigate("/reservation");
    } catch (error) {
      alert("회원가입 실패");
      console.error("회원가입 오류:", error);
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <h2 className={style.title}>회원가입</h2>
        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.inputGroup}>
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={style.input}
              required
            />
          </div>
          <div className={style.inputGroup}>
            <label htmlFor="phone">전화번호</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={style.input}
              required
            />
          </div>
          <div className={style.inputGroup}>
            <label htmlFor="studentId">학번</label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className={style.input}
              required
            />
          </div>
          <div className={style.inputGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={style.input}
              required
            />
          </div>
          <button type="submit" className={style.submitBtn}>
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
