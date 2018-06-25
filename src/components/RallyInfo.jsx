import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
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
        <TextField
          required
          label="title"
          margin="normal"
          name="title"
          id="title"
          size="32"
          defaultValue=""
          style={{
            width: 200,
          }}
        />
        <br />
        <TextField
          required
          label="description"
          name="description"
          id="description"
          hintText=""
          multiLine={true}
          rows={4}
          rowsMax={4}
          onChange={(e) => this.changeDesc(e.target.value)}
        />
        <br />
        <TextField
          required
          label="start"
          name="start"
          id="start"
          type="datetime-local"
          hintText=""
          multiLine={true}
          size="32"
          defaultValue={new Date().toISOString().slice(0, -5)}
        />

        <br />
        <TextField
          required
          label="end"
          name="end"
          id="end"
          type="datetime-local"
          hintText=""
          multiLine={true}
          size="32"
          defaultValue={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, -5)}
        />
        <br />
        <Button
          color="primary"
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
        </Button>
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
