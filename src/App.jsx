import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import List from "./List";
import Login from "./Login";
import CreateNewRally from "./CreateNewRally";
import axios from "axios";
import "react-tabs/style/react-tabs.css";

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
