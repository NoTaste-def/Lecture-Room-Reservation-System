import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import styles from "./Elect.module.css";

const Elect = () => {
  const location = useLocation();
  const { state } = location;

  const flag = { moter_flag: "1" };
  const URL = "http://192.168.72.5:8000/moter-action";

  const closeBtn = () => {
    axios
      .post(URL, flag)
      .then((response) => {
        console.log("Response from temporary server:", response.data);
        console.log(flag);
      })
      .catch((error) => {
        console.error("Error from temporary server:", error);
        console.log(flag);
      });
  };

  return (
    <div>
      {/* 여기에서 데이터를 사용하여 페이지를 구성할 수 있습니다. */}
      <header className={styles.headerWrapper}>
        <h1 className={styles.title}>예약 정보</h1>
      </header>

      <main className={styles.mainCon}>
        {state && (
          <section className={styles.mainWrapper}>
            <article className={styles.name}>
              <figure className={styles.contentSubTitle}>예약자</figure>
              <div />
              <br />
              <span>{state.name}</span>
            </article>
            <article className={styles.reason}>
              <figure className={styles.contentSubTitle}>예약사유</figure>
              <div />
              <br />
              <span>{state.reason}</span>
            </article>
            <article className={styles.date}>
              <figure className={styles.contentSubTitle}>예약날짜</figure>
              <div />
              <br />
              <span>{state.date}</span>
            </article>
            <article className={styles.bNum}>
              <figure className={styles.contentSubTitle}>건물번호</figure>
              <div />
              <br />
              <span>{state.building}</span>
            </article>
            <article className={styles.fNum}>
              <figure className={styles.contentSubTitle}>층수</figure>
              <div />
              <br />
              <span>{state.floor}</span>
            </article>
            <article className={styles.rNum}>
              <figure className={styles.contentSubTitle}>강의실 번호</figure>
              <div />
              <br />
              <span>{state.room}</span>
            </article>
            <article className={styles.time}>
              <figure className={styles.contentSubTitle}>예약시간</figure>
              <div />
              <br />
              <span>{state.time}</span>
            </article>
          </section>
        )}
      </main>
      <footer className={styles.footer}>
        <button
          className={styles.postBtn}
          onClick={() => {
            closeBtn();
            alert(
              "Server is disconnected.\nIf not, Servo motor will be activated"
            );
          }}
        >
          사용 종료
        </button>
      </footer>
    </div>
  );
};

export default Elect;
