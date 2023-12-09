import React from "react";
import Navbar from "./Navbar";

export default function subheader(props) {
  return (
    <div>
      <section class="sub-header">
        <Navbar />
        <h1>{props.title}</h1>
      </section>
    </div>
  );
}
