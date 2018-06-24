import React, { Component } from "react";
import axios from "axios";
import style from "../styles/RallyInfo.css";

export class RallyInfoInput extends Component {
  submit(period) {
    const rally = period;
    rally["locations"] = this.state.locations;
    axios
      .post("/web-api/rally/", rally)
      .catch((err) => console.log("Something wrong: ", err));
  }

  render() {
    return (
      <div style={{ padding: "10px" }}>
        <label htmlFor="title">Title: </label>
        <br />
        <input type="text" name="title" id="title" size="32" />
        <br />
        <label htmlFor="description">Description: </label>
        <br />
        <textarea
          type="text"
          name="description"
          id="description"
          rows="4"
          cols="30"
        />
        <br />
        <label htmlFor="start">Start: </label>
        <br />
        <input
          type="datetime-local"
          name="start"
          id="start"
          defaultValue={new Date().toISOString().slice(0, -5)}
        />
        <br />
        <label htmlFor="end">End: </label>
        <br />
        <input
          type="datetime-local"
          name="end"
          id="end"
          value={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, -5)}
        />
        <br />
        <button
          onClick={() => {
            const start_datetime = new Date(
              document.getElementById("start").value
            ).toISOString();
            const end_datetime = new Date(
              document.getElementById("end").value
            ).toISOString();
            const period = {
              title: document.getElementById("title").value,
              description: document.getElementById("description").value,
              start_datetime,
              end_datetime,
            };
            return this.submit(period);
          }}
        >
          Submit
        </button>
      </div>
    );
  }
}

export const LocationList = (props) => (
  <div style={{ float: "right", width: "70%" }}>
    <ul className={style.ul}>
      {props.locations.map((location, index) => {
        return (
          <li key={index} className={style.li}>
            <p>Name: {location.name}</p>
            <p>Description: {location.description}</p>
            <p>Lat: {location.lat}</p>
            <p>Lng: {location.lng}</p>
          </li>
        );
      })}
    </ul>
  </div>
);
