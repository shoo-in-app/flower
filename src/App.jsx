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
      isAuthenticated: false,
    };
  }
  componentDidMount() {
    axios
      .get(process.env.URL + "/web-api/rallies/")
      .then((response) => response.data)
      .then((data) => this.setState({ isAuthenticated: true }))
      .catch((err) => this.setState({ isAuthenticated: false }));
  }
  render() {
    return (
      <Tabs>
        <TabList>
          <Tab>List of Rallies</Tab>
          <Tab>Create New Rally</Tab>
        </TabList>

        <TabPanel>
          <Login isAuthenticated={this.state.isAuthenticated} />
          <List />
        </TabPanel>
        <TabPanel>
          <CreateNewRally />
        </TabPanel>
      </Tabs>
    );
  }
}
