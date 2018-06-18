import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import List from "./List";
import Login from "./Login";
import CreateNewRally from "./CreateNewRally";
import "react-tabs/style/react-tabs.css";

export default class App extends Component {
  render() {
    return (
      <Tabs>
        <TabList>
          <Tab>List of Rallies</Tab>
          <Tab>Create New Rally</Tab>
        </TabList>

        <TabPanel>
          <List />
          <Login />
        </TabPanel>
        <TabPanel>
          <CreateNewRally />
        </TabPanel>
      </Tabs>
    );
  }
}
