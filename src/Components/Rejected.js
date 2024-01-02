import React from "react";
import Navbar from "./Navbar";

export default function Rejected() {
  return (
    <div>
      <section className="header">
        <Navbar />

        <div className="text-box approval-box">
          <div>
            {" "}
            <h1>Your account was not approved!</h1>
            <br />
            <br />
            <h2>Please contact the front office for more information</h2>
          </div>
        </div>
      </section>
    </div>
  );
}
