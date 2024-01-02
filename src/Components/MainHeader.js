import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import data from "../Config/Config";
import CryptoJS from "crypto-js";

export default function MainHeader() {
  var idCipher = localStorage.getItem("user-id");

  var adminStatusCipher = localStorage.getItem("cms-adminAccountStatus");

  var accountTypeCipher = localStorage.getItem("cms-accountType");

  if (idCipher) {
    var bytes3 = CryptoJS.AES.decrypt(idCipher, data.secretKey);
    var id = bytes3.toString(CryptoJS.enc.Utf8);
  }
  if (accountTypeCipher) {
    var bytes2 = CryptoJS.AES.decrypt(accountTypeCipher, data.secretKey);
    var accountType = bytes2.toString(CryptoJS.enc.Utf8);
  }
  if (adminStatusCipher) {
    var bytes = CryptoJS.AES.decrypt(adminStatusCipher, data.secretKey);
    var adminStatus = bytes.toString(CryptoJS.enc.Utf8);
  }

  var navigate = useNavigate();

  useEffect(() => {
    if (id) {
      if (accountType === "teacher") {
        navigate("/teacherdashboard");
      } else if (
        (accountType === "admin" && adminStatus !== "pending") ||
        accountType === "superadmin"
      ) {
        navigate("/adminpanel");
      }
    }
  }, [accountType, id, adminStatus, navigate]);

  return (
    <div>
      <section className="header">
        <Navbar />
        <div className="text-box">
          <h1>West Lake Middle School</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
            consectetur quisquam deserunt dolorum veniam,
            <br /> nihil maiores voluptatem sed magnam ullam ducimus, minus id
            placeat ratione iusto deleniti praesentium! Porro, maxime.
          </p>
          <a href="/" className="hero-btn">
            Visit Us To Know More
          </a>
        </div>
      </section>
    </div>
  );
}
