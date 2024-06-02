import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./office.css";

const NUM = ["N4", "N5"];
const URL = "http://125.138.73.56:8000";

const Office = () => {
  const [date, setDate] = useState(new Date());
  const [datePayload, setDatePayload] = useState([]);
  const [BuildingNumber, setBuildingNumber] = useState();
  const [floor, setFloor] = useState();
  const [room, setRoom] = useState();
  const [res, setRes] = useState();
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

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const handleClickBuildingNumber = (num) => {
    setBuildingNumber(num);
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

  useEffect(() => {
    setDatePayload([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
    console.log(datePayload);
  }, [date]);

  useEffect(() => {
    console.log(res);
  }, [res]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <h1>강의실 예약 시스템</h1>
      <header>
        <button
          className="a1"
          onClick={() => handleClickBuildingNumber(NUM[0])}
        >
          {NUM[0]}
        </button>
        <button
          className="a2"
          onClick={() => handleClickBuildingNumber(NUM[1])}
        >
          {NUM[1]}
        </button>
      </header>
      <nav>
        <button
          className="b1"
          onClick={() => {
            handleClickFloor(1);
          }}
        >
          1층
        </button>
        <button
          className="b2"
          onClick={() => {
            handleClickFloor(2);
          }}
        >
          2층
        </button>
        <button
          className="b3"
          onClick={() => {
            handleClickFloor(3);
          }}
        >
          3층
        </button>
        <button
          className="b4"
          onClick={() => {
            handleClickFloor(4);
          }}
        >
          4층
        </button>
      </nav>
      <div>
        <button
          onClick={() => {
            handleClickRoom(101);
          }}
        >
          101
        </button>
        <button
          onClick={() => {
            handleClickRoom(301);
          }}
        >
          301
        </button>
        <button
          onClick={() => {
            handleClickRoom(408);
          }}
        >
          408
        </button>
      </div>
      <main>
        <div className="calendar_container">
          <Calendar onChange={onChange} value={date} />
        </div>
        <div className="time_container">
          <table>
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
              {res && res.length > 0
                ? res.map((row, i) => (
                    <tr key={i}>
                      <td>{row.name}</td>
                      <td>{row.reason}</td>
                      <td>{`${row.year}-${row.month}-${row.day}`}</td>
                      <td>{row.building}</td>
                      <td>{row.floor}</td>
                      <td>{row.room}</td>
                      <td>{row.start_time + " ~ " + row.end_time}</td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </main>
      <footer>
        <button
          type="submit"
          onClick={() => {
            axios
              .get(
                `${URL}/reservation?building=${BuildingNumber}&floor=${floor}&year=${datePayload[0]}&month=${datePayload[1]}&day=${datePayload[2]}&room=${room}`
              )
              .then((res) => {
                console.log(res);
                setRes(res.data);
              })
              .catch((err) => {
                console.error("ERR", err);
              });
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
      </footer>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>
              &times;
            </span>
            <h2>예약 정보 입력</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
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
                  type="number"
                  value={reservationInfo.floor}
                  onChange={(e) =>
                    setReservationInfo({
                      ...reservationInfo,
                      floor: parseInt(e.target.value),
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
                      day: parseInt(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                월:
                <input
                  type="number"
                  value={reservationInfo.month}
                  onChange={(e) =>
                    setReservationInfo({
                      ...reservationInfo,
                      month: parseInt(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                년:
                <input
                  type="number"
                  value={reservationInfo.year}
                  onChange={(e) =>
                    setReservationInfo({
                      ...reservationInfo,
                      year: parseInt(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                강의실:
                <input
                  type="number"
                  value={reservationInfo.room}
                  onChange={(e) =>
                    setReservationInfo({
                      ...reservationInfo,
                      room: parseInt(e.target.value),
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
              <button type="button" onClick={handleReservation}>
                예약 완료
              </button>
            </form>
          </div>
        </div>
      )}
    </form>
  );
};

export default Office;
