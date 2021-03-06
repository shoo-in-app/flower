import React, { Component } from "react";
import moment from "moment";
import style from "../styles/MyRallies.css";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";

const RallyDetail = (props) => (
  <div className={style.locationList}>
    <h2>{props.rally.title}</h2>
    <p>Description: {props.rally.description}</p>
    <p>
      Start:{" "}
      {moment(props.rally.start_datetime)
        .add("hours", 9)
        .format("HH:mm MMMM Do YYYY.")}
      <br />
      End:{" "}
      {"  " +
        moment(props.rally.end_datetime)
          .add("hours", 9)
          .format("HH:mm MMMM Do YYYY.")}
    </p>
    <List subheader={<ListSubheader component="div">Locations</ListSubheader>}>
      {props.rally.locations.map((l) => (
        <div>
          <ListItem style={{ display: "grid", justifyContent: "normal" }}>
            <h3 style={{ gridColumn: "1 / 2", gridRow: "1", margin: "0" }}>
              {l.name}
            </h3>
            <div style={{ gridColumn: "1 / 3", gridRow: "2" }}>
              {l.description}
            </div>
            <div style={{ gridColumn: "2", gridRow: "3" }}>
              Lat: {l.lat.toFixed(4)}
            </div>
            <div style={{ gridColumn: "3", gridRow: "3" }}>
              Lng: {l.lng.toFixed(4)}
            </div>
          </ListItem>
          <Divider />
        </div>
      ))}
    </List>
  </div>
);

export default class MyRallies extends Component {
  constructor(props) {
    super(props);
    this.state = { chosenRally: 0 };
  }

  get rallies() {
    return (
      <Paper style={{ display: "flex", margin: "0 20px" }} elevation={4}>
        <List style={{ minWidth: "400px", width: "50%" }}>
          {this.props.myRallies.map((rally, index) => (
            <ListItem
              button
              style={{ display: "flex", flexDirection: "column" }}
              onClick={() => this.setState({ chosenRally: index })}
              style={
                index === this.state.chosenRally
                  ? { backgroundColor: "#eee" }
                  : {}
              }
            >
              <h3 style={{ fontSize: "1.5em", margin: "0" }}>{rally.title}</h3>
              <Divider />
            </ListItem>
          ))}
        </List>
        <RallyDetail rally={this.props.myRallies[this.state.chosenRally]} />
      </Paper>
    );
  }

  render() {
    if (this.props.myRallies.length > 0) {
      return this.rallies;
    } else {
      return (
        <p className={style.content}>You have not created any rallies yet.</p>
      );
    }
  }
}
