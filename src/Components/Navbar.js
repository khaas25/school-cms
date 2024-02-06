import React from "react";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

export default function Navbar() {
  var navigate = useNavigate();
  var loginStatus = JSON.parse(localStorage.getItem("cms-login")); //use json.parse for boolean true or false values, otherwise dont.

  function logout() {
    localStorage.removeItem("cms-login");
    localStorage.removeItem("cms-userName");
    localStorage.removeItem("cms-status");
    localStorage.removeItem("user-id");
    localStorage.removeItem("cms-accountType");
    localStorage.removeItem("cms-adminAccountStatus");
    navigate("/");
  }

  var navLinks = "";
  useEffect(() => {
    navLinks = document.getElementById("navLinks");
  }, []);

  function showMenu() {
    navLinks.style.right = "0";
  }

  function hideMenu() {
    navLinks.style.right = "-200px";
  }

  return (
    <div>
      <nav>
        <Link to="/">
          <img src={logo} alt="logo" className="nav-logo" />
        </Link>
        <div className="nav-links" id="navLinks">
          {/* <i className="fa-solid fa-xmark" onclick={hideMenu}></i> */}
          <FontAwesomeIcon
            icon={faXmark}
            className="fa-solid fa-xmark"
            onClick={hideMenu}
          />

          <ul>
            {/* =============================================== */}

            <li className="links">
              {" "}
              <Link to="/">HOME</Link>{" "}
            </li>

            {/* =============================================== */}

            {loginStatus !== true ? (
              <>
                <li className="links">
                  {" "}
                  <Link to="/signup">SIGNUP / LOGIN</Link>{" "}
                </li>
              </>
            ) : (
              <>
                {" "}
                <li>
                  <button className="logout" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* =============================================== */}
          </ul>
        </div>
        <FontAwesomeIcon
          className="fa-solid fa-bars"
          icon={faBars}
          onClick={showMenu}
        />
        {/* // <i className="fa-solid fa-bars" onClick={showMenu}></i> */}
      </nav>
    </div>
  );
}
