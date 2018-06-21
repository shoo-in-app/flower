import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import List from "./List";
import Login from "./Login";
import CreateNewRally from "./CreateNewRally";
import axios from "axios";
import "react-tabs/style/react-tabs.css";
import { createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: null,
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

  get main() {
    return (
      <Tabs>
        <TabList>
          <Tab>List of Rallies</Tab>
          <Tab>Create New Rally</Tab>
          <a href="/logout">
            <button>Log out</button>
          </a>
        </TabList>
        <TabPanel>
          <List />
        </TabPanel>
        <TabPanel>
          <CreateNewRally />
        </TabPanel>
      </Tabs>
    );
  }

  render() {
    let content;
    switch (this.state.isAuthenticated) {
      case null:
        content = <div>LOADING</div>;
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
