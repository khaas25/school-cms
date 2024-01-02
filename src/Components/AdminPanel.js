import React from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useEffect, useState } from "react";
import absent2 from "../images/absent2.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useReducer } from "react";
import approve from "../images/approve.png";
import remove from "../images/remove.png";
import CryptoJS from "crypto-js";
import data from "../Config/Config";

export default function AdminPanel() {
  const navigate = useNavigate();
  var [panelName, setPanelName] = useState("teachersPanel");
  var accountTypeCipher = localStorage.getItem("cms-accountType");

  var bytes = CryptoJS.AES.decrypt(accountTypeCipher, data.secretKey);
  var accountType = bytes.toString(CryptoJS.enc.Utf8);

  useEffect(() => {
    var accountTypeCipher = localStorage.getItem("cms-accountType");
    var bytes = CryptoJS.AES.decrypt(accountTypeCipher, data.secretKey);
    var accountType = bytes.toString(CryptoJS.enc.Utf8);

    if (
      accountType.toLowerCase() !== "admin" &&
      accountType.toLowerCase() !== "superadmin"
    ) {
      navigate("/");
    }
  }, [navigate, accountType]);

  return (
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
          Student Panel
        </button>
        <button
          className={
            panelName === "shuffleStudentsData" ? "tabs selected" : "tabs"
          }
          onClick={() => setPanelName("shuffleStudentsData")}
        >
          Shuffle Students
        </button>
        {accountType === "superadmin" ? (
          <>
            <button
              className={
                panelName === "adminRequests" ? "tabs selected" : "tabs"
              }
              onClick={() => setPanelName("adminRequests")}
            >
              Admin Requests
            </button>
          </>
        ) : null}
      </div>
      {panelName === "teachersPanel" ? (
        <>
          {" "}
          <TeachersPanel />
        </>
      ) : panelName === "studentsPanel" ? (
        <>
          <StudentsPanel />
        </>
      ) : panelName === "shuffleStudentsData" ? (
        <>
          <ShuffleStudentsData />
        </>
      ) : panelName === "adminRequests" ? (
        <>
          <AdminRequests />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

function AdminRequests() {
  const [adminRequests, setAdminRequests] = useState([]);
  const [update, forceUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    async function getData() {
      var response = await fetch("http://localhost:8080/adminRequests");
      var data = await response.json();
      console.log(data);
      setAdminRequests(data);
    }
    getData();
  }, [update]);

  function updateStatus(val, id) {
    var payload = {
      adminStatus: val,
    };
    axios
      .put("http://localhost:8080/adminRequests/" + id, payload)
      .then((res) => {
        NotificationManager.success("Admin Status Updated");
        console.log(res);
        forceUpdate();
      })
      .catch((e) => {
        NotificationManager.success("Something went wrong!");
        console.log(e);
      });

    forceUpdate();
  }

  var i = 0;
  return (
    <>
      <div>
        <NotificationContainer />
        <div className="table-container admin-table">
          <div className="student-admin">
            {" "}
            <h1>Admin Approval</h1>
          </div>

          <table class="table table-striped">
            <thead>
              <tr>
                <th>SN#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {adminRequests.map((item) => {
                i++;
                return (
                  <>
                    <tr>
                      <td>{i}</td>
                      <td>
                        {item.firstName} {item.lastName}
                      </td>
                      <td>{item.email}</td>
                      <td>{item.status}</td>
                      <td style={{ textAlign: "center" }}>
                        <img
                          src={approve}
                          width={40}
                          alt="approve"
                          style={{ cursor: "pointer" }}
                          onClick={() => updateStatus("approved", item._id)}
                        />
                        <img
                          src={remove}
                          width={40}
                          alt="remove"
                          style={{ cursor: "pointer" }}
                          onClick={() => updateStatus("rejected", item._id)}
                        />
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// //     ============ STUDENTS PANEL COMPONENT ===================

function StudentsPanel() {
  var [students, setStudents] = useState([]);
  var date = new Date();
  var formattedDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  useEffect(() => {
    async function getData() {
      var response = await fetch(
        `http://localhost:8080/shuffleAttendance/` + formattedDate
      );
      var data = await response.json();
      console.log(data);
      setStudents(data);
    }
    getData();
  }, [formattedDate]);
  var i = 0;
  async function getDate(val) {
    var response = await fetch(
      `http://localhost:8080/shuffleAttendance/` + val
    );
    var data = await response.json();
    console.log(data);
    setStudents(data);
  }
  return (
    <>
      <div>
        <div className="table-container admin-table">
          <div className="student-admin">
            {" "}
            <h1>Student Information:</h1>
            <input
              type="date"
              id="date"
              onChange={(e) => getDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <table class="table table-striped">
            <thead>
              <tr>
                <th>SN#</th>
                <th>Student Name</th>
                <th>Teacher Name</th>
                <th>Period Assigned</th>
                <th>Date</th>
                <th style={{ textAlign: "center" }}>Attendance</th>
              </tr>
            </thead>

            {students.length > 0 ? (
              <>
                {" "}
                <tbody>
                  {" "}
                  {students?.map((item) => {
                    ++i;
                    return (
                      <tr>
                        <td>{i}</td>
                        <td>{item.studentName}</td>
                        <td>{item.teacherName}</td>
                        <td>{item.periodNumber}</td>

                        <td>{item.date}</td>
                        <td style={{ textAlign: "center" }}>
                          {item.attendanceStatus}
                        </td>
                      </tr>
                    );
                  })}{" "}
                </tbody>
              </>
            ) : (
              <>
                <div className="emptyHeadingContainer">
                  {" "}
                  <h1 className="empty-heading">No Data Found!</h1>
                </div>
              </>
            )}
          </table>
        </div>
      </div>
    </>
  );
}
// //     ============ TEACHERS PANEL COMPONENT ===================

function TeachersPanel() {
  var navigate = useNavigate();
  var [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  var [teachers, setTeachers] = useState([]);
  useEffect(() => {
    async function getData() {
      var response = await fetch("http://localhost:8080/teachers");
      var data = await response.json();
      console.log(data);
      setTeachers(data);
    }
    getData();
  }, [ignored]);

  var i = 0;

  function shuffleStudents(id) {
    navigate("/shuffle", { state: { teacherId: id } });
  }
  function resetAll() {
    axios
      .delete("http://localhost:8080/resetallattendance")
      .then(() => {
        NotificationManager.success("Attendance Reset Successful");
        closePopup();
        forceUpdate();
      })
      .catch((e) => {
        NotificationManager.error("Something went wrong");
        console.log(e);
      });
    forceUpdate();
  }

  function showPopup() {
    document.getElementById("pop-up").style.visibility = "visible";
  }
  function closePopup() {
    document.getElementById("pop-up").style.visibility = "hidden";
  }
  return (
    <>
      <NotificationContainer />
      <div>
        {" "}
        <div className="table-container admin-table">
          <div className="teacher-admin">
            {" "}
            <h1>Teacher Information:</h1>
            <button onClick={showPopup}>Reset All Attendance Data</button>
          </div>
          <br />
          <table class="table table-striped">
            <thead>
              <tr>
                <th>SN#</th>
                <th>Teacher Name</th>
                <th>Building Location</th>
                <th>Room Number</th>
                <th>Email</th>
                <th>Mark Absent</th>
              </tr>
            </thead>
            <tbody>
              {teachers?.map((item) => {
                if (item.absentStatus !== true) {
                  ++i;
                  return (
                    <tr>
                      <td>{i}</td>
                      <td>
                        {item.firstName} {item.lastName}
                      </td>
                      <td>{item.floorName.toUpperCase()}</td>
                      <td>{item.roomNumber}</td>

                      <td>{item.email}</td>
                      <td style={{ textAlign: "center", cursor: "pointer" }}>
                        <img
                          src={absent2}
                          alt="absent"
                          width={40}
                          onClick={() => shuffleStudents(item._id)}
                        />
                      </td>
                    </tr>
                  );
                } else {
                  return null;
                }
              })}
            </tbody>
          </table>
        </div>
        <div className="overlay">
          <div className="pop-up" id="pop-up">
            <h1>Are you sure you want to reset all data</h1>{" "}
            <p>
              This action will delete all the shuffle data. Please click confirm
              to proceed.
            </p>
            <div className="popUp-btn-container">
              <button className="confirm-popup" onClick={resetAll}>
                Confirm
              </button>
              <button className="cancel-popup" onClick={closePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// //     ============ SHUFFLE STUDENTS COMPONENT ===================
function ShuffleStudentsData() {
  var [shuffleData, setShuffleData] = useState([]);
  var [teachersData, setTeachersData] = useState([]);
  var [panelName, setPanelName] = useState("");
  var [floorNames, setFloorNames] = useState([]);

  useEffect(() => {
    async function getData() {
      var res2 = await fetch(
        "http://localhost:8080/allShuffleStudentsTeachers"
      );
      var data2 = await res2.json();
      console.log(data2);
      setTeachersData(data2.filteredStudents);
      setFloorNames(data2.floorsDetected);
      setPanelName(
        `${data2.filteredStudents[0].firstName};${data2.filteredStudents[0].lastName}`
      );
    }
    getData();
  }, []);
  useEffect(() => {
    async function getPanelName() {
      var response = await fetch(
        "http://localhost:8080/allShuffleStudents/" + panelName
      );
      var data = await response.json();
      console.log(data);
      setShuffleData(data);
    }
    getPanelName();
  }, [panelName]);

  var i = 0;
  return (
    <div>
      {" "}
      <>
        <NotificationContainer />

        {floorNames.length > 0 ? (
          <>
            {" "}
            <div>
              {" "}
              <br />
              {floorNames.map((fName) => {
                return (
                  <>
                    <div className="floorname-container">
                      {" "}
                      <h2>Students on floor {fName.toUpperCase()}</h2>
                    </div>
                    <div className="admin_tabs shufflestudents-admintabs">
                      {/*Teacher Name Tabs*/}
                      {teachersData.map((tName) => {
                        if (
                          fName.toLowerCase() === tName.floorName.toLowerCase()
                        ) {
                          return (
                            <button
                              className={
                                panelName ===
                                `${tName.firstName};${tName.lastName}`
                                  ? "tabs selected"
                                  : "tabs"
                              }
                              onClick={() =>
                                setPanelName(
                                  `${tName.firstName};${tName.lastName}`
                                )
                              }
                            >
                              {tName.firstName} {tName.lastName}
                            </button>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                    <div className="table-container admin-table shufflestudents-admin-table">
                      <div className="teacher-admin">
                        {" "}
                        <h1>Shuffle Student's Information:</h1>
                      </div>
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>SN#</th>
                            <th>Teacher Name</th>
                            <th>Room Number</th>
                            <th>Building Location</th>
                            <th>Student Name</th>
                            <th>Period Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shuffleData.map((item) => {
                            const firstName = item.firstName;
                            const lastName = item.lastName;
                            const floorName = item.floorName;
                            const roomNumber = item.roomNumber;
                            if (
                              fName.toLowerCase() ===
                              item.floorName.toLowerCase()
                            ) {
                              return (
                                <>
                                  {item.shuffleStudents.map((students) => {
                                    const pNum = students.periodNumber;
                                    return (
                                      <>
                                        {students.names.map((name) => {
                                          i++;
                                          return (
                                            <>
                                              <tr>
                                                {" "}
                                                <td>{i}</td>
                                                <td>
                                                  {firstName + " " + lastName}
                                                </td>
                                                <td>{roomNumber}</td>
                                                <td>{floorName}</td>
                                                <td>{name.studentName}</td>
                                                <td>{pNum}</td>
                                              </tr>
                                            </>
                                          );
                                        })}
                                      </>
                                    );
                                  })}
                                </>
                              );
                            } else {
                              return (
                                <div className="no-teacher-selected">
                                  <h1>Please choose a Teacher</h1>;
                                </div>
                              );
                            }
                          })}
                        </tbody>
                      </table>
                    </div>{" "}
                  </>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="emptyHeadingContainer emptyAdminShuffle">
              {" "}
              <h1>No Data Found!</h1>
            </div>
          </>
        )}
      </>
    </div>
  );
}
