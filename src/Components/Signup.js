import React from "react";
import banner from "../images/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { signupSchema } from "../Validator/SignupValidator";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Link } from "react-router-dom";
export default function Signup() {
  var navigate = useNavigate();

  //// ======================= validator ========================================
  var initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };
  const { values, errors, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: signupSchema,
    onSubmit: (values) => {
      signUp();
      alert("sign up successful");
    },
  });

  //// ==========================End of Validator========================================

  //// ===================== Start of signUp function ===================================
  function signUp(e) {
    e.preventDefault(); //prevents form from reloading page

    //Variable below get form data entered by user
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var account = document.getElementById("accountType");
    var accountType = account[account.selectedIndex].value;
    //=============================================
    var payload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      accountType,
    };

    //If statement below makes sure password and confirm password match and styles
    if (password !== confirmPassword) {
      NotificationManager.error("Passwords do not match!");
      document.getElementById("password").style.borderBottom =
        "2px solid crimson";
      document.getElementById("confirmPassword").style.borderBottom =
        "2px solid crimson";
    } else {
      axios
        .post("http://localhost:8080/signup", payload)
        .then(() => {
          NotificationManager.success("Signup Successful");
          navigate("/signin");
        })
        .catch((e) => {
          NotificationManager.error(e.response.data); //e.response.data shows any error message you have writtine for e
          console.log(e);
        });
    }
  }
  //// ===================== End of signUp function ===================================

  ////========= Return to Home Page Function ==========================================
  function goToHome() {
    navigate("/");
  }
  ////========= End of Return to Home Page Function ===================================

  return (
    <div>
      <NotificationContainer />
      <body>
        <div className="wrapper">
          <div className="inner">
            <div className="image-holder">
              <img src={banner} alt="banner" />
            </div>
            <form action="" onSubmit={handleSubmit}>
              <h3>Registration Form</h3>
              {/* ====== Beginning of first/Last name DIV===== */}
              <div className="form-group">
                {/* ========== First Name Input================ */}
                <div>
                  <p>{errors.firstName}</p>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    className="form-control"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {/* ========== Last Name Input================ */}
                <div>
                  <p>{errors.lastName}</p>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    className="form-control"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              {/* ======== Beginning of Email DIV===== */}
              <div className="form-wrapper">
                <p>{errors.email}</p>
                <input
                  id="email"
                  type="text"
                  placeholder="Email Address"
                  className="form-control"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <i className="zmdi zmdi-email"></i>
              </div>
              {/* ====== Beginning of Password DIV===== */}
              <div className="form-wrapper">
                <p>{errors.password}</p>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <i className="zmdi zmdi-lock"></i>
              </div>
              {/* ====== Beginning of Confirm password DIV===== */}
              <div className="form-wrapper">
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="form-control"
                />
                <i className="zmdi zmdi-lock"></i>
              </div>
              {/* ===== Select Menu ============== */}

              <div className="form-wrapper">
                <label>Account Type: </label>
                <br />
                <select name="floors" id="accountType">
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <br />

              {/* ===== Signup and Cancel buttons ============== */}
              <div className="btn-container">
                <button onClick={signUp}>
                  Register
                  <i className="zmdi zmdi-arrow-right"></i>
                </button>
                <button onClick={goToHome} type="button">
                  Cancel <i className="zmdi zmdi-arrow-right"></i>
                </button>
              </div>
              <br />
              {/* ======= Have an account link ================= */}
              <center>
                <Link to="/signin" className="btm-link">
                  Already have an account?
                </Link>
              </center>
            </form>
          </div>
        </div>
      </body>
    </div>
  );
}
