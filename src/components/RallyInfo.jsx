import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import style from "../styles/RallyInfo.css";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";

class RallyInfoInput extends Component {
  submit(period) {
    const rally = period;
    rally["locations"] = this.props.locations;
    axios
      .post("/web-api/rally/", rally)
      .catch((err) => console.log("Something wrong: ", err));
  }

  render() {
    return (
      <div style={{ padding: "10px" }}>
        <Card>
          <CardContent>
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
              multiLine={true}
              size="32"
              defaultValue={new Date(
                new Date().getTime() + 7 * 24 * 60 * 60 * 1000
              )
                .toISOString()
                .slice(0, -5)}
            />
            <br />
            <Button
              variant="contained"
              size="small"
              color="primary"
              style={{ margin: `3px 0` }}
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
          </CardContent>
        </Card>
      </div>
    );
  }
}

const LocationList = (props) => (
  <Card style={{ flexGrow: "2", margin: "10px" }}>
    <List subheader={<ListSubheader component="div">Locations</ListSubheader>}>
      {props.locations.map((l) => (
        <div>
          <Divider />
          <ListItem style={{ display: "grid", justifyContent: "normal" }}>
            <h3 style={{ gridColumn: "1 / 4", gridRow: "1", margin: "0" }}>
              Name: {l.name}
            </h3>
            <div style={{ gridColumn: "1 / 4", gridRow: "2" }}>
              Description: {l.description}
            </div>
            <div style={{ gridColumn: "3", gridRow: "3" }}>
              lat:{l.lat.toFixed(6)}{" "}
            </div>
            <div style={{ gridColumn: "4", gridRow: "3" }}>
              lng:{l.lng.toFixed(6)}{" "}
            </div>
          </ListItem>
        </div>
      ))}
    </List>
  </Card>
);

export default (props) => (
  <div style={{ display: "flex" }}>
    <RallyInfoInput locations={props.locations} />
    <LocationList locations={props.locations} />
  </div>
);
