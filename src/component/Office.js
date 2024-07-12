import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import styles from "./Office.module.css";

/*
 * TODO
 * 건물 번호 누르면 그에 따라 층 노출.
 * 층 버튼 누르면 각 층에 맞는 호실 버튼 노출.
 */

const URL = "주소";
const DATA = {
  N4: {
    floors: {
      "1층": [
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "107",
        "108",
        "109",
        "110",
      ],
      "2층": [
        "201",
        "202",
        "203",
        "204",
        "205",
        "206",
        "207",
        "208",
        "209",
        "210",
      ],
      "3층": [
        "301",
        "302",
        "303",
        "304",
        "305",
        "306",
        "307",
        "308",
        "309",
        "310",
      ],
      "4층": [
        "401",
        "402",
        "403",
        "404",
        "405",
        "406",
        "407",
        "408",
        "409",
        "410",
      ],
      "5층": [
        "501",
        "502",
        "503",
        "504",
        "505",
        "506",
        "507",
        "508",
        "509",
        "510",
      ],
      "6층": [
        "601",
        "602",
        "603",
        "604",
        "605",
        "606",
        "607",
        "608",
        "609",
        "610",
      ],
    },
  },
  N5: {
    floors: {
      "1층": [
        "111",
        "112",
        "113",
        "114",
        "115",
        "116",
        "117",
        "118",
        "119",
        "120",
      ],
      "2층": [
        "211",
        "212",
        "213",
        "214",
        "215",
        "216",
        "217",
        "218",
        "219",
        "220",
      ],
      "3층": [
        "311",
        "312",
        "313",
        "314",
        "315",
        "316",
        "317",
        "318",
        "319",
        "320",
      ],
      "4층": [
        "411",
        "412",
        "413",
        "414",
        "415",
        "416",
        "417",
        "418",
        "419",
        "420",
      ],
      "5층": [
        "511",
        "512",
        "513",
        "514",
        "515",
        "516",
        "517",
        "518",
        "519",
        "520",
      ],
      "6층": [
        "611",
        "612",
        "613",
        "614",
        "615",
        "616",
        "617",
        "618",
        "619",
        "620",
      ],
    },
  },
};

// 데이터를 변환하여 배열 형태로 만들기
const transData = Object.entries(DATA).map(([building, { floors }]) => ({
  building,
  floors: Object.entries(floors).map(([floor, rooms]) => ({
    floor,
    rooms,
  })),
}));

const Office = () => {
  const [btnConFlag, setBtnConFlag] = useState("nav");
  const [colorFlag, setColorFlag] = useState([false, false]);
  const [date, setDate] = useState(new Date());
  const [datePayload, setDatePayload] = useState([]);
  const [buildingNumber, setBuildingNumber] = useState(null);
  const [floor, setFloor] = useState(null);
  const [room, setRoom] = useState(null);
  const [res, setRes] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reservationInfo, setReservationInfo] = useState({
    name: "",
    reason: "",
    building: "",
    floor: "",
    day: "",
    month: "",
    year: "",
    room: "",
    start_time: "",
    end_time: "",
  });

  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const handleClickBuildingNumber = (num) => {
    setBuildingNumber(num);
    setFloor(null); // 건물 번호를 변경할 때 층과 호실 초기화
    setRoom(null);
  };

  const handleClickFloor = (floor) => {
    setFloor(floor);
  };

  const handleClickRoom = (room) => {
    setRoom(room);
  };

  const handleReservation = () => {
    const payload = {
      name: reservationInfo.name,
      reason: reservationInfo.reason,
      building: reservationInfo.building,
      floor: parseInt(reservationInfo.floor),
      day: parseInt(reservationInfo.day),
      month: parseInt(reservationInfo.month),
      year: parseInt(reservationInfo.year),
      room: parseInt(reservationInfo.room),
      start_time: reservationInfo.start_time,
      end_time: reservationInfo.end_time,
    };

    console.log(payload);

    axios
      .post(`${URL}/reservation`, payload)
      .then((res) => {
        console.log("예약이 완료되었습니다.", res);
        setModalOpen(false);
        setReservationInfo({
          name: "",
          reason: "",
          building: "",
          floor: "",
          day: "",
          month: "",
          year: "",
          room: "",
          start_time: "",
          end_time: "",
        });
      })
      .catch((err) => {
        console.error("예약 요청 실패:", err);
      });
  };

  //테스트용
  const rightBtn = (row) => {
    navigate("/elect", {
      state: {
        name: "옥주용",
        reason: "멋쟁이사자 강의실 대여",
        date: `2024-06-25`,
        building: "N11",
        floor: "3층",
        room: "306호",
        time: `19:00 - 21:00`,
      },
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // submit 동작 수행시 새로고침 방지
      }}
      className={styles.wrapper}
    >
      <h1 className={styles.reserveTitle}>강의실 예약 시스템</h1>
      <header className={styles.header}>
        {transData.map((data, i) => {
          return (
            <button
              key={data.building}
              className={`${styles[`building`]}`}
              onClick={() => {
                let copy = new Array(transData.length).fill(false);
                copy[i] = !copy[i];
                setColorFlag(copy);
                handleClickBuildingNumber(i);
                setReservationInfo({
                  ...reservationInfo,
                  building: data.building,
                });
                if (btnConFlag === "nav") {
                  setBtnConFlag("change");
                }
                // else {
                //   setBtnConFlag("nav");
                // }
              }}
              style={
                colorFlag[i] === true
                  ? {
                      background: "rgb(240, 240, 240)",
                      borderBottom: "1px solid rgb(240, 240, 240)",
                    }
                  : null
              }
            >
              {data.building}
            </button>
          );
        })}
      </header>
      {btnConFlag !== null && (
        <nav className={`${styles[btnConFlag]}`}>
          {buildingNumber !== null && (
            <div className={styles.btnCon}>
              {/* 층수 */}
              {transData[buildingNumber].floors.map((floors, i) => (
                <button
                  key={floors.floor}
                  onClick={() => {
                    handleClickFloor(floors.floor);
                  }}
                >
                  {floors.floor}
                </button>
              ))}
            </div>
          )}

          {floor && (
            <div className={styles.btnCon}>
              {/* 호실 */}
              {transData[buildingNumber].floors
                .find((f) => f.floor === floor)
                .rooms.map((room, i) => (
                  <button key={i} onClick={() => handleClickRoom(room)}>
                    {room}
                  </button>
                ))}
            </div>
          )}
        </nav>
      )}

      <main className={styles.main}>
        <div className={styles.calendar_container}>
          <Calendar
            className={styles.react_calendar}
            onChange={onChange}
            value={date}
          />
        </div>
        <div className={styles.time_container}>
          {/* 시간 겹치는, 이미 예약된 시간대의 컨테이너는 따로 표시 해야 함. */}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>이름</th>
                <th>사유</th>
                <th>날짜</th>
                <th>동</th>
                <th>층</th>
                <th>강의실</th>
                <th>시간</th>
              </tr>
            </thead>
            <tbody>
              <tr onClick={rightBtn}>
                {/* 테스트용 */}
                <td>옥주용</td>
                <td>멋쟁이사자 강의실 대여</td>
                <td>2024-06-25</td>
                <td>N4</td>
                <td>1층</td>
                <td>101호</td>
                <td>19:00 - 21:00</td>
              </tr>
              {res
                ? res.map((row) => (
                    <tr key={row.id} onClick={() => rightBtn(row)}>
                      <td>{row.name}</td>
                      <td>{row.reason}</td>
                      <td>
                        {row.year}-{row.month}-{row.day}
                      </td>
                      <td>{row.building}</td>
                      <td>{row.floor}</td>
                      <td>{row.room}</td>
                      <td>
                        {row.start_time} ~ {row.end_time}
                      </td>
                      <td>
                        <Link
                          to={{
                            pathname: "/elect",
                            state: {
                              name: row.name,
                              reason: row.reason,
                              date: `${row.year}-${row.month}-${row.day}`,
                              building: row.building,
                              floor: row.floor,
                              room: row.room,
                              time: `${row.start_time} ~ ${row.end_time}`,
                            },
                          }}
                        >
                          자세히 보기
                        </Link>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </main>
      <footer className={styles.reserveFooter}>
        <button
          type="submit"
          onClick={() => {
            // 조회하기 버튼 누를시 state에 저장되어있는 / 날짜, 건물 번호, 층, 강의실 번호가 get 요청으로 날아감.
            axios
              .get(
                `${URL}/reservation?building=${buildingNumber}&floor=${floor}&year=${datePayload[0]}&month=${datePayload[1]}&day=${datePayload[2]}&room=${room}`
              )
              .then((response) => {
                console.log(response.data);
                setRes(response.data);
              })
              .catch((err) => {
                console.error("ERR", err);
              });

            alert("Server is disconnected"); // 서버 연동 없을 때
          }}
        >
          조회하기
        </button>
        <button
          type="button"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          예약하기
        </button>
        {modalOpen && (
          <div className={styles.modal}>
            <div className={styles.modal_content}>
              <h2 className={styles.subTitle}>예약 정보 입력</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className={styles.subHeader}>
                  <label>
                    이름:
                    <input
                      type="text"
                      value={reservationInfo.name}
                      onChange={(e) =>
                        setReservationInfo({
                          ...reservationInfo,
                          name: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    사유:
                    <input
                      type="text"
                      value={reservationInfo.reason}
                      onChange={(e) =>
                        setReservationInfo({
                          ...reservationInfo,
                          reason: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <div className={styles.subMain}>
                  <label>
                    건물:
                    <input
                      type="text"
                      value={reservationInfo.building}
                      onChange={(e) =>
                        setReservationInfo({
                          ...reservationInfo,
                          building: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    층:
                    <input
                      type="text"
                      value={floor}
                      onChange={(e) =>
                        setReservationInfo({
                          ...reservationInfo,
                          floor: floor,
                        })
                      }
                    />
                  </label>
                  <label>
                    강의실:
                    <input
                      type="text"
                      value={room}
                      onChange={(e) =>
                        setReservationInfo({
                          ...reservationInfo,
                          room: room,
                        })
                      }
                    />
                  </label>
                </div>
                <div className={styles.subFooter}>
                  <label>
                    년:
                    <input
                      type="number"
                      value={date.getFullYear()}
                      onChange={(e) =>
                        setReservationInfo({
                          ...reservationInfo,
                          year: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    월:
                    <input
                      type="number"
                      value={date.getMonth() + 1}
                      onChange={(e) =>
                        setReservationInfo({
                          ...reservationInfo,
                          month: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    일:
                    <input
                      type="number"
                      value={reservationInfo.day}
                      onChange={(e) =>
                        setReservationInfo({
                          ...reservationInfo,
                          day: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    시작 시간:
                    <input
                      type="text"
                      value={reservationInfo.start_time}
                      onChange={(e) =>
                        setReservationInfo({
                          ...reservationInfo,
                          start_time: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    종료 시간:
                    <input
                      type="text"
                      value={reservationInfo.end_time}
                      onChange={(e) =>
                        setReservationInfo({
                          ...reservationInfo,
                          end_time: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <footer className={styles.modalFooter}>
                  <button
                    type="button"
                    onClick={() => {
                      alert("Server is disconnected"); // 서버 연동 없을 때
                      handleReservation();
                    }}
                  >
                    예약 완료
                  </button>
                  <button
                    onClick={() => {
                      setModalOpen(false);
                    }}
                    className={styles.closeBtn}
                  >
                    취소
                  </button>
                </footer>
              </form>
            </div>
          </div>
        )}
      </footer>
    </form>
  );
};

export default Office;
