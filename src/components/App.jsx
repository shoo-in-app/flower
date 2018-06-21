import React, { Component } from "react";
import List from "./List";
import Login from "./Login";
import CreateNewRally from "./CreateNewRally";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: null,
      value: 0,
    };
  }

  componentDidMount() {
    axios
      .get("/id")
      .then((res) => {
        if (res.data) {
          this.setState({ isAuthenticated: true });
        } else {
          this.setState({ isAuthenticated: false });
        }
      })
      .catch((err) => console.log(err));
  }

  handleChange(event, value) {
    this.setState({ value });
  }

  get main() {
    const { value } = this.state;
    return (
      <div>
        <AppBar position="static" style={{ backgroundColor: "#a61414" }}>
          <Tabs value={value} onChange={(e, v) => this.handleChange(e, v)}>
            <Tab label="List of Rallies" />
            <Tab label="Create New Rally" />
            <Tab
              label="Log out"
              href="/logout"
              style={{ marginLeft: "auto" }}
            />
          </Tabs>
        </AppBar>
        {value === 0 && <List />}
        {value === 1 && <CreateNewRally />}
      </div>
    );
  }

  render() {
    switch (this.state.isAuthenticated) {
      case null:
        return <div>LOADING</div>;
      case false:
        return <Login />;
      case true:
        return this.main;
    }
  }
}
