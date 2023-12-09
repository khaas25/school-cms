import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useNavigate } from "react-router-dom";

export default function Shuffling() {
  var navigate = useNavigate();
  var location = useLocation();
  // absent teacher id below
  var teacherId = location.state.teacherId;
  var [teachers, setTeachers] = useState([]);
  useEffect(() => {
    async function getData() {
      var response = await fetch("http://localhost:8080/teachers");
      var data = await response.json();
      setTeachers(data);
      console.log(data);
    }
    getData();
  }, []);

  function handleClick(name, status) {
    var inputs = document.getElementsByClassName(name);

    if (status === true) {
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].disabled === false) {
          inputs[i].checked = true;
        }
      }
    } else {
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
      }
    }
  }

  function shuffleStudents() {
    var teachers = document.getElementsByClassName("chkTeacher");
    var availableTeacherIds = [];
    for (var i = 0; i < teachers.length; i++) {
      if (teachers[i].checked === true && teachers[i].value !== "all") {
        // using .value below because the teacher id is stored in it in return code
        availableTeacherIds.push(teachers[i].value);
      }
    }
    console.log(availableTeacherIds);
    var payload = {
      availableTeachers: availableTeacherIds,
      absentTeacherId: teacherId,
    };
    axios
      .post("http://localhost:8080/shuffle", payload)
      .then(() => {
        NotificationManager.success("Students Shuffled Successfully");
        axios
          .put("http://localhost:8080/teacherinfo/" + teacherId, {
            absentStatus: true,
          })
          .then((res) => {
            setTimeout(() => {
              navigate("/adminPanel");
            }, 2000);
          });
      })
      .catch((e) => {
        NotificationManager.error("Error Shuffling Students");
        console.log(e);
      });
  }
  return (
    <div className="shuffle_container">
      <NotificationContainer />
      <div className="teacher_container">
        <div className="floor_a">
          <h2>Floor A</h2>
          <span className="inp_container">
            <input
              type="checkbox"
              value="all"
              name="a"
              onChange={(e) => handleClick(e.target.name, e.target.checked)}
              className="chkTeacher"
            />
            Select All
          </span>
          <hr />
          <br />

          {teachers.map((item) => {
            if (item.floorName === "a") {
              return (
                <div className="teachers">
                  <span className="inp_container">
                    <input
                      // if item is equal to absent teacher id then mark true for disabled or false if not
                      disabled={item._id === teacherId ? true : false}
                      type="checkbox"
                      className="chkTeacher a"
                      value={item._id}
                    />
                    {item.firstName} {item.lastName}
                  </span>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className="floor_b">
          {" "}
          <h2>Floor B</h2>
          <div className="teachers"></div>
          <span className="inp_container">
            <input
              value="all"
              className="chkTeacher"
              type="checkbox"
              name="b"
              onChange={(e) => handleClick(e.target.name, e.target.checked)}
            />
            Select All{" "}
          </span>
          <hr />
          <br />
          {teachers.map((item) => {
            if (item.floorName === "b") {
              return (
                <div className="teachers">
                  <span className="inp_container">
                    <input
                      disabled={item._id === teacherId ? true : false}
                      type="checkbox"
                      className="chkTeacher b"
                      value={item._id}
                    />
                    {item.firstName} {item.lastName}
                  </span>{" "}
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className="floor_c">
          {" "}
          <h2>Floor C</h2>
          <span className="inp_container">
            {" "}
            <input
              value="all"
              className="chkTeacher"
              type="checkbox"
              name="c"
              onChange={(e) => handleClick(e.target.name, e.target.checked)}
            />
            Select All
          </span>
          <hr />
          <br />
          {teachers.map((item) => {
            if (item.floorName === "c") {
              return (
                <div className="teachers">
                  <span className="inp_container">
                    <input
                      disabled={item._id === teacherId ? true : false}
                      type="checkbox"
                      className="chkTeacher c"
                      value={item._id}
                    />
                    {item.firstName} {item.lastName}
                  </span>{" "}
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className="floor_d">
          {" "}
          <h2>Floor D</h2>
          <span className="inp_container">
            {" "}
            <input
              value="all"
              className="chkTeacher"
              type="checkbox"
              name="d"
              onChange={(e) => handleClick(e.target.name, e.target.checked)}
            />
            Select All
          </span>
          <hr />
          <br />
          {teachers.map((item) => {
            if (item.floorName === "d") {
              return (
                <div className="teachers">
                  <span className="inp_container">
                    <input
                      disabled={item._id === teacherId ? true : false}
                      type="checkbox"
                      className="chkTeacher d"
                      value={item._id}
                    />
                    {item.firstName} {item.lastName}
                  </span>{" "}
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
      <button onClick={shuffleStudents}>Shuffle Students</button>
    </div>
  );
}
