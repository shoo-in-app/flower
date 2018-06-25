import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

class RallyInfoInput extends Component {
  submit(period) {
    const rally = period;
    rally["locations"] = this.state.locations;
    axios
      .post("/web-api/rally/", rally)
      .catch((err) => console.log("Something wrong: ", err));
  }

  render() {
    return (
      <div style={{ padding: "10px", flexGrow: "1" }}>
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

const LocationList = (props) => (
  <div style={{ flexGrow: "2" }}>
    <List>
      {props.locations.map((l) => (
        <ListItem style={{ display: "grid", justifyContent: "normal" }}>
          <h3 style={{ gridColumn: "1 / 2", gridRow: "1", margin: "0" }}>
            Name: {l.name}
          </h3>
          <div style={{ gridColumn: "1 / 3", gridRow: "2" }}>
            Description: {l.description}
          </div>
          <div style={{ gridColumn: "2", gridRow: "3" }}>
            lat:{l.lat.toFixed(6)}{" "}
          </div>
          <div style={{ gridColumn: "3", gridRow: "3" }}>
            lng:{l.lng.toFixed(6)}{" "}
          </div>
        </ListItem>
      ))}
    </List>
  </div>
);

export default (props) => (
  <div style={{ display: "flex" }}>
    <RallyInfoInput />
    <LocationList locations={props.locations} />
  </div>
);
