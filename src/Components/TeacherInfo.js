import axios from "axios";
import React from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useNavigate } from "react-router-dom";
import data from "../Config/Config";
import CryptoJS from "crypto-js";
import API from "../Config/Config";
// // ==============================================================
export default function TeacherInfo() {
  var navigate = useNavigate();
  var idCipher = localStorage.getItem("user-id");
  var bytes3 = CryptoJS.AES.decrypt(idCipher, data.secretKey);
  var id = bytes3.toString(CryptoJS.enc.Utf8);
  //// ======= Start of Conference Number Function====================
  function conferenceNumber() {
    var num = document.getElementById("conferenceNumber").value;

    document.getElementById("conf-period").innerHTML = "";

    //Take the value of num and creates that many new inputs
    for (var i = 0; i < num; i++) {
      var label = document.createElement("label");
      label.innerText = "Conference Period Number";
      var input = document.createElement("input");
      input.type = "text";
      //   input.placeholder = "Conference Period Number:";
      input.min = 1;
      input.max = 7;
      input.classList.add("form-control");
      input.classList.add("periodNumber");
      //below line places the inputs created in the div named conf-period
      document.getElementById("conf-period").appendChild(label);
      document.getElementById("conf-period").appendChild(input);
    }
  }
  //// ======= End of Conference Number Function====================

  //// ======= Start of addInfo Function============================
  function addInfo(e) {
    e.preventDefault();
    var floors = document.getElementById("floors");
    var floorName = floors[floors.selectedIndex].value; //this is from a dropdown.
    var roomNumber = document.getElementById("roomNumber").value;
    var conferenceNumber = document.getElementById("conferenceNumber").value;
    var periodNumber = document.getElementsByClassName("periodNumber"); //periodNumber is a classname.

    var conferencePeriods = [];
    for (var i = 0; i < periodNumber.length; i++) {
      if (periodNumber[i].value !== "") {
        conferencePeriods.push(periodNumber[i].value);
      } else {
        NotificationManager.error("Period Information Filled Incorrectly");
        return;
      }
    }

    var payload = {
      floorName,
      roomNumber,
      conferenceNumber,
      conferencePeriods,
    };

    axios
      .put(`${API.apiUri}/teacherinfo/` + id, payload)
      .then((res) => {
        NotificationManager.success("Data Added!");
        console.log(res);
        navigate("/periodInfo", {
          state: { periods: res.data.conferencePeriods },
        });
      })
      .catch((e) => {
        NotificationManager.error("User not found!");
        console.log(e);
      });
  }
  //// ======= End of addInfo Function

  return (
    <div className="addinfo-container">
      <NotificationContainer />
      <center>
        <div className="wrapper">
          <div className="inner">
            {" "}
            <form action="" style={{ width: "100%" }} onSubmit={addInfo}>
              <h3>Teacher Information</h3>

              {/* ========================================================== */}
              <div className="form-wrapper">
                <label>Choose your floor location: </label>
                <br />
                <br />
                <select name="floors" id="floors">
                  <option value="b">A</option>
                  <option value="b">B</option>
                  <option value="c">C</option>
                  <option value="d">D</option>
                  <option value="g">G</option>
                  <option value="h">H</option>
                </select>
              </div>
              <br />
              {/* ========================================================== */}
              <div className="form-wrapper">
                <label>Room Number</label>

                <input
                  type="number"
                  // placeholder="Room Number ex. 123"
                  className="form-control"
                  id="roomNumber"
                />
                <i className="zmdi zmdi-email"></i>
              </div>
              {/* ========================================================== */}
              <div className="form-wrapper">
                <label>Number of Conferences</label>
                <input
                  type="number"
                  // placeholder="Number of Conferences"
                  className="form-control"
                  id="conferenceNumber"
                  onChange={conferenceNumber}
                />
                <i className="zmdi zmdi-lock"></i>
              </div>
              {/* ========================================================== */}
              <div className="form-wrapper" id="conf-period"></div>
              {/* ========================================================== */}
              <div className="btn-container">
                <button type="submit">
                  Next<i className="fas fa-arrow-right"></i>
                </button>
              </div>
              {/* ========================================================== */}
              <br />

              {/* ========================================================== */}
            </form>
          </div>
        </div>
      </center>
    </div>
  );
}
