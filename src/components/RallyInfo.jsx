import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import moment from "moment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";

class RallyInfoInput extends Component {
  submit(period) {
    const rally = period;
    rally["locations"] = this.props.locations;
    return axios
      .post("/web-api/rally/", rally)
      .catch((err) => console.log("Something wrong: ", err));
  }

  render() {
    return (
      <div style={{ padding: "10px", width: "300px" }}>
        <Card>
          <CardContent style={{ paddingBottom: `16px` }}>
            <TextField
              required
              label="title"
              name="title"
              id="title"
              size="32"
              defaultValue=""
            />
            <TextField
              required
              multiline
              label="description"
              name="description"
              id="description"
              rows="3"
              rowsMax="3"
              style={{ width: "240px" }}
            />
            <TextField
              required
              label="start"
              name="start"
              id="start"
              type="datetime-local"
              size="32"
              defaultValue={moment()
                .add("hours", 9)
                .toISOString()
                .slice(0, -5)}
            />
            <TextField
              required
              label="end"
              name="end"
              id="end"
              type="datetime-local"
              size="32"
              defaultValue={moment()
                .add("days", 7)
                .add("hours", 9)
                .toISOString()
                .slice(0, -5)}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              style={{ marginTop: "12px" }}
              onClick={() => {
                const start_datetime = moment(
                  document.getElementById("start").value
                )
                  .add("hours", -9)
                  .toISOString();
                const end_datetime = moment(
                  document.getElementById("end").value
                )
                  .add("hours", -9)
                  .toISOString();
                const period = {
                  title: document.getElementById("title").value,
                  description: document.getElementById("description").value,
                  start_datetime,
                  end_datetime,
                };
                this.submit(period)
                  .then(() => this.props.updateMyRallies())
                  .then(() => this.props.chengeTab(0));
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
          <Divider style={{ padding: `0` }} />
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
    <RallyInfoInput
      locations={props.locations}
      chengeTab={(v) => props.chengeTab(v)}
      updateMyRallies={() => props.updateMyRallies()}
    />
    <LocationList locations={props.locations} />
  </div>
);
