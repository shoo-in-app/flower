import React, { Component } from "react";
import Map from "./Map";
import { RallyInfoInput, LocationList } from "./RallyInfo";

export default class CreateNewRally extends Component {
  constructor(props) {
    super(props);
    this.state = { locations: [] };
  }

  changeData(data) {
    const locations = this.state.locations.slice();
    locations.push(data);
    this.setState({ locations });
  }

  render() {
    return (
      <div>
        <Map
          changeData={(data) => this.changeData(data)}
          isFilledIn={(info) => info.length > 0}
        />
        <LocationList locations={this.state.locations} />
        <RallyInfoInput locations={this.state.locations} />
      </div>
    );
  }
}
