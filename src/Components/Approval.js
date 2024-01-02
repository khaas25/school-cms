import React from "react";
import Navbar from "./Navbar";

export default function Approval() {
  return (
    <div>
      <section className="header">
        <Navbar />

        <div className="text-box approval-box">
          <div>
            {" "}
            <h1>Your request has been received!</h1>
            <br />
            <br />
            <h2>Your account will be approved in the next 24 hours</h2>
          </div>
        </div>
      </section>
    </div>
  );
}
