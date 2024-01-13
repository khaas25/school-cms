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
import data from "../Config/Config";
import CryptoJS from "crypto-js";
import API from "../Config/Config";

export default function EditPeriodInfo() {
  var navigate = useNavigate();
  var location = useLocation();

  var teacherIdCipher = localStorage.getItem("user-id");
  var bytes = CryptoJS.AES.decrypt(teacherIdCipher, data.secretKey);
  var teacherId = bytes.toString(CryptoJS.enc.Utf8);

  var [periodInfo, setPeriodInfo] = useState({});
  var periodNumber = location.state.periodNumber;
  // // ==============================================================
  useEffect(() => {
    async function getData() {
      var response = await fetch(
        `${API.apiUri}/periodInfo/${teacherId}/${periodNumber}`
      );
      var data = await response.json();
      console.log(data);
      setPeriodInfo(data);
      document.getElementById("grade").value = data.periodGrade;
      document.getElementById("add-std").innerHTML = "";
      for (var i = 0; i < data.studentNames.length; i++) {
        generateStudents(data.studentNames[i]);
      }
      sessionStorage.setItem("students", data.studentNames.length);
    }
    getData();
  }, [teacherId, periodNumber]);
  var count = sessionStorage.getItem("students");
  ////=======Delete Student=====================================

  function generateStudents(stdName) {
    var input = document.createElement("input");
    input.type = "text";
    input.classList.add("form-control");
    input.classList.add("students");
    input.value = stdName;

    var button = document.createElement("button");
    button.innerText = "DELETE";
    button.className = "del-btn";
    button.type = "button";

    var div = document.createElement("div");
    div.className = "add-std-child";
    div.appendChild(input);
    div.appendChild(button);

    button.addEventListener("click", function () {
      if (window.confirm("Are you sure you want to remove this student?")) {
        input.remove();
        div.remove();
        button.remove();
      } else {
      }
    });

    document.getElementById("add-std").appendChild(div);
  }

  // // =================add student ==============

  function addStudent() {
    count++;
    var input = document.createElement("input");
    input.type = "text";
    input.classList.add("form-control");
    input.classList.add("students");
    input.placeholder = "Student " + count;

    var button = document.createElement("button");
    button.innerText = "DELETE";
    button.className = "del-btn";
    button.type = "button";

    var div = document.createElement("div");
    div.className = "add-std-child";
    div.appendChild(input);
    div.appendChild(button);

    button.addEventListener("click", function () {
      if (window.confirm("Are you sure you want to remove this?")) {
        input.remove();
        div.remove();
        button.remove();
      } else {
      }
    });
    document.getElementById("add-std").appendChild(div);
  }

  ////=======Add Student==================================================

  ////==============editInfo Function ====================================
  function editInfo(e) {
    e.preventDefault();
    var periodNumber = parseInt(document.getElementById("periodNumber").value);
    var periodGrade = parseInt(document.getElementById("grade").value);
    var students = document.getElementsByClassName("students");
    var studentNames = [];

    for (var i = 0; i < students.length; i++) {
      if (students[i] !== "") {
        studentNames.push(students[i].value);
      }
    }
    var payload = {
      periodGrade,
      periodNumber,
      studentNames,
    };
    axios
      .put(`${API.apiUri}/periodInfo/${teacherId}/${periodInfo._id}`, payload)
      .then(() => {
        NotificationManager.success("Data Updated!");
        setTimeout(() => {
          navigate("/teacherdashboard");
        }, 1000);
      })
      .catch((e) => {
        NotificationManager.error("Something Went Wrong");
        console.log(e);
      });
  }
  // // ==============================================================
  return (
    <div>
      <NotificationContainer />
      <div className="wrapper">
        <div className="inner" style={{ width: "100%" }}>
          <form
            action=""
            style={{ width: "100%" }}
            id="period-form"
            onSubmit={editInfo}
          >
            <h3>Edit Period Information</h3>
            <div className="form-group">
              <div>
                <label>Period Number:</label>{" "}
                <input
                  type="text"
                  placeholder="Period Number"
                  className="form-control"
                  id="periodNumber"
                  value={periodInfo.periodNumber}
                  disabled
                />
              </div>
              <div>
                <label>Grade:</label>
                <input
                  type="Number"
                  placeholder="Grade"
                  className="form-control"
                  id="grade"
                />
              </div>
            </div>
            <br />
            <div className="form-wrapper">
              <label>Student Names:</label>
              <br />
              <br />
              {/* <input
                type="text"
                placeholder="Student 1"
                className="form-control students"
              />
              <i className="fas fa-user"></i> */}
            </div>

            <div className="form-wrapper" id="add-std"></div>
            <div className="addMore-container">
              <button type="button" onClick={addStudent}>
                Add Student +
              </button>
            </div>

            <div className="btn-container">
              <button type="submit">Save</button>
            </div>

            <br />
          </form>
        </div>
      </div>
    </div>
  );
}
