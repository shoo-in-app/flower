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
    this.state = { isAuthenticated: null, value: 0 };
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

  get main() {
    const { value } = this.state;
    return (
      <div>
        <AppBar position="static">
          <Tabs value={value} onChange={(e, value) => this.setState({ value })}>
            <Tab label="My Rallies" style={{ fontFamily: "myFont" }} />
            <Tab label="Create New Rally" style={{ fontFamily: "myFont" }} />
            <Tab
              label="Log out"
              href="/logout"
              style={{ marginLeft: "auto", fontFamily: "myFont" }}
            />
          </Tabs>
        </AppBar>
        {value === 0 && <MyRallies />}
        {value === 1 && <CreateNewRally />}
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
