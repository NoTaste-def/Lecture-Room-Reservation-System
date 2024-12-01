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

const URL =
  "https://port-0-room-reservations-umnqdut2blqqevwyb.sel4.cloudtype.app";
const DATA = {
  N4: {
    floors: {
      "3층": ["301", "302", "303", "304", "305"],
      "4층": ["403", "404", "418", "419", "420"],
      "5층": ["501", "502", "503", "504", "505", "518", "519", "520"],
      "6층": ["601", "603", "615", "616"],
    },
  },
  N5: {
    floors: {
      "4층": ["407", "408"],
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
  const [detailInfo, setDetailInfo] = useState([]);
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

    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();

    const queryString = `building=${
      reservationInfo.building
    }&floor=${floor?.replace("층", "")}&day=${day}&month=${month}&year=${year}`;

    axios
      .get(`${URL}/reservation?${queryString}`)
      .then((response) => {
        console.log("Response data:", response.data);
        setDetailInfo(response.data.length > 0 ? response.data[0] : null); // 첫 번째 예약 정보 저장
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setDetailInfo(null); // 오류 시 detailInfo 초기화
      });
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
      building: transData[buildingNumber].building,
      floor: parseInt(floor.replace("층", "")),
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      room: parseInt(room),
      start_time: reservationInfo.start_time,
      end_time: reservationInfo.end_time,
      reason: reservationInfo.reason,
      name: reservationInfo.name,
      user: 1,
    };

    console.log(payload);

    axios
      .post(`${URL}/reservation`, payload)
      .then((res) => {
        console.log("예약이 완료되었습니다.", res);
        setModalOpen(false);
        // Reset states
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

  // useLocation 스테이트 넘겨주기
  const rightBtn = (row) => {
    navigate("/elect", {
      state: {
        name: row.user_name,
        reason: row.reason,
        date: `${row.year}-${row.month}-${row.day}`,
        building: row.building,
        floor: row.floor,
        room: row.room,
        time: `${row.start_time} ~ ${row.end_time}`,
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
              {detailInfo ? (
                <tr onClick={() => rightBtn(detailInfo)}>
                  <td>{detailInfo.user_name}</td>
                  <td>{detailInfo.reason}</td>
                  <td>
                    {detailInfo.year}-{detailInfo.month}-{detailInfo.day}
                  </td>
                  <td>{detailInfo.building}</td>
                  <td>{detailInfo.floor}층</td>
                  <td>{detailInfo.room}</td>
                  <td>
                    {detailInfo.start_time} ~ {detailInfo.end_time}
                  </td>
                </tr>
              ) : res && res.length > 0 ? (
                res.map((row) => (
                  <tr key={row.id} onClick={() => rightBtn(row)}>
                    <td>{row.user_name}</td>
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
                            name: row.user_name,
                            reason: row.reason,
                            date: `${row.year}-${row.month}-${row.day}`,
                            building: row.building,
                            floor: row.floor,
                            room: row.room,
                            time: `${row.start_time} ~ ${row.end_time}`,
                          },
                        }}
                        onClick={rightBtn}
                      >
                        자세히 보기
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    선택한 날짜에 예약 정보가 없습니다.
                  </td>
                </tr>
              )}
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

            // alert("Server is disconnected"); // 서버 연동 없을 때
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
                      // alert("Server is disconnected"); // 서버 연동 없을 때
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
