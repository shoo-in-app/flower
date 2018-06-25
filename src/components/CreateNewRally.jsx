import React, { Component } from "react";
import Map from "./Map";
import RallyInfo from "./RallyInfo";

export default class CreateNewRally extends Component {
  constructor(props) {
    super(props);
    this.state = { locations: [] };
  }

  addLocation(location) {
    const locations = this.state.locations.slice();
    locations.push(location);
    this.setState({ locations });
  }

  render() {
    return (
      <div>
        <Map
          addLocation={(location) => this.addLocation(location)}
          isFilledIn={(info) => info.length > 0}
        />
        <RallyInfo locations={this.state.locations} />
      </div>
    );
  }
}
