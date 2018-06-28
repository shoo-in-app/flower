import React, { Component } from "react";
import axios from "axios";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import LinearProgress from "@material-ui/core/LinearProgress";
import MyRallies from "./MyRallies";
import Login from "./Login";
import CreateNewRally from "./CreateNewRally";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#a61414" },
    secondary: { main: "#ffffff" },
  },
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isAuthenticated: null, value: 0, myRallies: [] };
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
    this.updateMyRallies();
  }

  updateMyRallies() {
    console.log(this.state.myRallies);
    return axios
      .get("/web-api/rallies/")
      .then((res) => this.setState({ myRallies: res.data }))
      .catch((err) => console.log("Something wrong: ", err));
  }

  chengeTab(value) {
    this.setState({ value });
  }

  get main() {
    const { value } = this.state;
    return (
      <div>
        <AppBar position="static">
          <Tabs value={value} onChange={(e, value) => this.chengeTab(value)}>
            <Tab label="My Rallies" style={{ fontFamily: "EDO" }} />
            <Tab label="Create New Rally" style={{ fontFamily: "EDO" }} />
            <Tab
              label="Log out"
              href="/logout"
              style={{ marginLeft: "auto", fontFamily: "EDO" }}
            />
          </Tabs>
        </AppBar>
        {value === 0 && <MyRallies myRallies={this.state.myRallies} />}
        {value === 1 && (
          <CreateNewRally
            chengeTab={(v) => this.chengeTab(v)}
            updateMyRallies={() => this.updateMyRallies()}
          />
        )}
      </div>
    );
  }

  render() {
    let content = null;
    switch (this.state.isAuthenticated) {
      case null:
        content = <LinearProgress />;
        break;
      case false:
        content = <Login />;
        break;
      case true:
        content = this.main;
        break;
    }
    return <MuiThemeProvider theme={theme}>{content}</MuiThemeProvider>;
  }
}
