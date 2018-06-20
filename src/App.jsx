import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import List from "./List";
import Login from "./Login";
import CreateNewRally from "./CreateNewRally";

export default class App extends Component {
  render() {
    return (
      <Tabs>
        <TabList>
          <Tab>List of Rallies</Tab>
          <Tab>Create New Rally</Tab>
        </TabList>

        <TabPanel>
          <Login />
          <List />
        </TabPanel>
        <TabPanel>
          <CreateNewRally />
        </TabPanel>
      </Tabs>
    );
  }
}
