import React from "react";
import banner from "../images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
// // ==============================================================
export default function Signin() {
  var navigate = useNavigate();
  //// ==================  Sign In Function =======================
  function signIn(e) {
    e.preventDefault(); //prevents form from reloading page

    // Getting user value entered in signin form and storing in variables
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    //Creating payload to send
    var payload = {
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:8080/signin", payload)
      .then((res) => {
        NotificationManager.success("Login Successful");
        //if signin is successful the below items are displayed in localstorage
        localStorage.setItem("cms-login", true);
        localStorage.setItem("cms-userName", res.data.firstName);
        localStorage.setItem("cms-status", res.data.status);
        localStorage.setItem("user-id", res.data._id);
        localStorage.setItem("cms-accountType", res.data.accountType);
        if (
          res.data.status === "incomplete" &&
          res.data.accountType === "teacher"
        ) {
          navigate("/teacherinfo");
        } else if (res.data.accountType === "admin") {
          navigate("/adminpanel");
        } else {
          navigate("/teacherdashboard");
        }
      })
      .catch((e) => {
        NotificationManager.error(e.response.data);
        //e.response.data shows any error message you have writtin for e
        console.log(e);
      });
  }
  //// ================== End of Sign In Function =======================

  //// ================== Go to home page Function =======================

  function goToHome() {
    navigate("/");
  }

  //// ================== End of home page Function =======================

  return (
    <div>
      <NotificationContainer />
      <div className="wrapper">
        <div className="inner">
          {/* =================================================== */}
          <div className="image-holder">
            <img src={banner} alt="banner" />
          </div>
          {/* =================================================== */}
          <form action="" onSubmit={signIn}>
            <h3 style={{ fontSize: "40px" }}>Sign In</h3>
            {/* =================================================== */}
            <div className="form-wrapper">
              <input
                id="email"
                type="text"
                placeholder="Email Address"
                className="form-control"
              />
              <i className="zmdi zmdi-email"></i>
            </div>
            {/* =================================================== */}
            <div className="form-wrapper">
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="form-control"
              />
              <i className="zmdi zmdi-lock"></i>
            </div>
            {/* =================================================== */}
            <div className="btn-container">
              <button>
                Sign in
                <i className="zmdi zmdi-arrow-right"></i>
              </button>
              <button type="button" onClick={goToHome}>
                Cancel
              </button>
            </div>
            {/* =================================================== */}
            <br />
            <center>
              <Link to="/signup" className="btm-link">
                Create an account?
              </Link>
            </center>
            {/* =================================================== */}
          </form>
        </div>
      </div>
    </div>
  );
}
