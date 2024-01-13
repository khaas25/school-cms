import React from "react";
import { useState, useEffect } from "react";
import edit from "../images/edit.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useReducer } from "react";
import data from "../Config/Config";
import CryptoJS from "crypto-js";
import API from "../Config/Config";

// // ==============================================================
export default function TeachersDashboard() {
  const navigate = useNavigate();
  var [panelName, setPanelName] = useState("teachersPanel");

  useEffect(() => {
    var accountTypeCipher = localStorage.getItem("cms-accountType");
    var bytes = CryptoJS.AES.decrypt(accountTypeCipher, data.secretKey);
    var accountType = bytes.toString(CryptoJS.enc.Utf8);

    if (accountType.toLowerCase() !== "teacher") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      {" "}
      <>
        <div className="admin_tabs">
          <button
            className={panelName === "teachersPanel" ? "tabs selected" : "tabs"}
            onClick={() => setPanelName("teachersPanel")}
          >
            Teacher Panel
          </button>
          <button
            className={panelName === "studentsPanel" ? "tabs selected" : "tabs"}
            onClick={() => setPanelName("studentsPanel")}
          >
            Shuffle Students Panel
          </button>
        </div>
        {panelName === "teachersPanel" ? (
          <>
            {" "}
            <div className="periodData-Container">
              <PeriodData />
            </div>
          </>
        ) : (
          <>
            <div className="shuffleStudents-Container">
              <ShuffleStudents />
            </div>
          </>
        )}
      </>
    </>
  );
}

function ShuffleStudents() {
  var [shuffleArray, setShuffleArray] = useState([]);
  var idCipher = localStorage.getItem("user-id");
  var bytes3 = CryptoJS.AES.decrypt(idCipher, data.secretKey);
  var id = bytes3.toString(CryptoJS.enc.Utf8);
  var [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  var teacherNameCipher = localStorage.getItem("cms-userName");
  var bytes = CryptoJS.AES.decrypt(teacherNameCipher, data.secretKey);
  var teacherName = bytes.toString(CryptoJS.enc.Utf8);

  var [showEditBtn, setShowEditBtn] = useState(false);

  useEffect(() => {
    async function getData() {
      var response3 = await fetch(`${API.apiUri}/shuffleStudents/` + id);
      var data3 = await response3.json();
      setShuffleArray(data3);
    }
    getData();
  }, [ignored, id]);

  //// ====================function for attendance====================
  function attendance(studentId, status, periodNumber, studentName) {
    var date = new Date();
    var payload = { status };
    axios
      .put(`${API.apiUri}/attendance/${id}/${studentId}`, payload)
      .then(() => {
        setShowEditBtn(false);
        var payload2 = {
          studentName: studentName,
          teacherName: teacherName,
          attendanceStatus: status,
          periodNumber: periodNumber,
          date:
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate(),
          studentId,
        };
        console.log(payload2);
        axios
          .post(`${API.apiUri}/attendanceData`, payload2)
          .then(() => {
            NotificationManager.success("Attendance Marked Successfully");
          })
          .catch((e) => {
            NotificationManager.error("Could not save student's data");
            console.log(e);
          });
      })
      .catch((e) => {
        NotificationManager.error(
          "Something went wrong! Attendance was not marked."
        );
        console.log(e);
      });
    forceUpdate();
  }
  //// Variables
  var j = 0;
  return (
    <>
      <h1>Shuffle Students:</h1>
      <br /> <br />
      {shuffleArray.length > 0 ? (
        <>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>SN#</th>
                <th>Student Name</th>
                <th>Period</th>
                <th className="attendance-th">Attendance</th>
              </tr>
            </thead>
            {/* //!============================== */}
            <tbody>
              {shuffleArray.map((item) => {
                var pNum = item.periodNumber;
                return (
                  <>
                    {item?.names.map((data) => {
                      j++;
                      return (
                        <tr>
                          <td>{j}</td>
                          <td>{data.studentName}</td>
                          <td>{pNum}</td>
                          {data.attendance === "empty" ? (
                            <td className="attendance-td">
                              <button
                                className="attendance-btn"
                                onClick={() =>
                                  attendance(
                                    data._id,
                                    "present",
                                    item.periodNumber,
                                    data.studentName
                                  )
                                }
                              >
                                Present
                              </button>
                              <button
                                className="attendance-btn"
                                onClick={() =>
                                  attendance(
                                    data._id,
                                    "absent",
                                    item.periodNumber,
                                    data.studentName
                                  )
                                }
                                style={{
                                  backgroundColor: "crimson",
                                  border: "3px solid crimson",
                                }}
                              >
                                Absent
                              </button>
                            </td>
                          ) : (
                            <td
                              className="attendance-td-new"
                              style={{
                                color:
                                  data.attendance === "present"
                                    ? "#74BD43"
                                    : "crimson",
                              }}
                            >
                              <span className="attendance-wrapper">
                                {" "}
                                {data.attendance.toUpperCase()}
                                <img
                                  src={edit}
                                  alt="edit"
                                  width={20}
                                  onClick={() => setShowEditBtn(true)}
                                />
                              </span>
                              {showEditBtn === true ? (
                                <>
                                  <span className="attendance-btn-container">
                                    {" "}
                                    <button
                                      className="attendance-btn"
                                      onClick={() =>
                                        attendance(
                                          data._id,
                                          "present",
                                          item.periodNumber,
                                          data.studentName
                                        )
                                      }
                                    >
                                      Present
                                    </button>
                                    <button
                                      className="attendance-btn"
                                      onClick={() =>
                                        attendance(
                                          data._id,
                                          "absent",
                                          item.periodNumber,
                                          data.studentName
                                        )
                                      }
                                      style={{
                                        backgroundColor: "crimson",
                                        border: "3px solid crimson",
                                      }}
                                    >
                                      Absent
                                    </button>
                                  </span>
                                </>
                              ) : null}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <hr />
          <center>
            <h1 className="empty-heading">No Shuffle Students Found!</h1>
          </center>
        </>
      )}
    </>
  );
}

function PeriodData() {
  var [finalPeriods, setFinalPeriods] = useState([]);
  var [periodInfo, setPeriodInfo] = useState({});
  var idCipher = localStorage.getItem("user-id");
  var bytes2 = CryptoJS.AES.decrypt(idCipher, data.secretKey);
  var id = bytes2.toString(CryptoJS.enc.Utf8);
  var [periodNumber, setPeriodNumber] = useState(0);
  var [grade, setGrade] = useState(0);

  var i = 0;
  var navigate = useNavigate();
  // // ==============================================================
  useEffect(() => {
    async function getData() {
      var response = await fetch(`${API.apiUri}/confPeriods/` + id);
      var data = await response.json();
      console.log(data);
      var periodNumbers = [1, 2, 3, 4, 5, 6, 7];

      var finalPeriodNumbers = periodNumbers.filter(
        (number) => !data.includes(number)
      );
      console.log(finalPeriodNumbers);
      setFinalPeriods(finalPeriodNumbers);
      ////  ==============================================================
      var response2 = await fetch(
        `${API.apiUri}/periodInfo/${id}/${periodNumber}`
      );

      if (periodNumber === 0) {
        setPeriodNumber(finalPeriodNumbers[0]);
      }

      var data2 = await response2.json();
      console.log(data2);
      setGrade(data2.periodGrade);
      setPeriodInfo(data2);
    }
    getData();
  }, [id, periodNumber]);

  // // ==============================================================
  function periodData(e) {
    setPeriodNumber(e.target.value);
  }
  // // ==============================================================
  function editInfo(pNumber) {
    // objId is the same of the property and id is referring to the paramater.
    navigate("/editPeriodInfo", { state: { periodNumber: pNumber } });
  }
  // // ==============================================================
  return (
    <>
      {" "}
      <div>
        <NotificationContainer />
        <div className="table-container">
          <h1>Class Information:</h1>
          <div className="tabs">
            {finalPeriods.map((item) => {
              return (
                <button
                  className="tab"
                  id={periodNumber === item ? "active" : "notActive"}
                  value={item}
                  onClick={periodData}
                >
                  Period {item}
                </button>
              );
            })}
          </div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>SN#</th>
                <th>Student Name</th>
                <th>Grade</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {periodInfo.studentNames?.map((item) => {
                ++i;
                return (
                  <tr>
                    <td>{i}</td>
                    <td>{item}</td>
                    <td>{grade}</td>
                    <td>
                      <img
                        src={edit}
                        alt="edit"
                        width={30}
                        style={{ cursor: "pointer" }}
                        onClick={() => editInfo(periodInfo.periodNumber)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* ////======================== */}
          <br />
        </div>
      </div>
    </>
  );
}
