import React, { Component } from "react";
import axios from "axios";
import style from "../styles/List.css";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Paper from "@material-ui/core/Paper";

const RallyDetail = (props) => (
  <div className={style.locationList}>
    <h2>{props.rally.title}</h2>
    <p>Description: {props.rally.description}</p>
    <p>
      Start: {props.rally.start_datetime}
      <br />
      End: {props.rally.end_datetime}
    </p>
    <List subheader={<ListSubheader component="div">Locations</ListSubheader>}>
      {props.rally.locations.map((l) => (
        <ListItem style={{ display: "grid" }}>
          <h3 style={{ gridColumn: "1 / 2", gridRow: "1", margin: "0" }}>
            {l.name}
          </h3>
          <div style={{ gridColumn: "1 / 3", gridRow: "2" }}>
            {l.description}
          </div>
          <div style={{ gridColumn: "2", gridRow: "3" }}>lat:{l.lat} </div>
          <div style={{ gridColumn: "3", gridRow: "3" }}>lng:{l.lng} </div>
        </ListItem>
      ))}
    </List>
  </div>
);

export default class MyRallies extends Component {
  constructor(props) {
    super(props);
    this.state = { rallies: [], chosenRally: 0 };
  }

  componentDidMount() {
    axios
      .get("/web-api/rallies/")
      .then((res) => this.setState({ rallies: res.data }))
      .catch((err) => console.log("Something wrong: ", err));
  }

  choseRally(index) {
    this.setState({ chosenRally: index });
  }

  get rallies() {
    return (
      <Paper className={style.myRrallies} elevation={4}>
        <List className={style.rallyList}>
          {this.state.rallies.map((rally, index) => (
            <ListItem
              button
              className={style.rally}
              onClick={() => this.choseRally(index)}
              style={
                index === this.state.chosenRally
                  ? { backgroundColor: "#eee" }
                  : {}
              }
            >
              <h3 style={{ fontSize: "1.5em", margin: "0" }}>{rally.title}</h3>
              {/* <p style={{ margin: "0" }}>{rally.description}</p> */}
            </ListItem>
          ))}
        </List>
        <RallyDetail rally={this.state.rallies[this.state.chosenRally]} />
      </Paper>
    );
  }

  render() {
    let content;
    if (this.state.rallies.length > 0) {
      content = this.rallies;
    } else {
      content = <p>You have not created any rallies yet.</p>;
    }
    return <div style={{ backgroundColor: "#fafafa" }}>{content}</div>;
  }
}
