import React, { Component } from "react";
import Map from "./Map";
import { RallyInfoInput, LocationList } from "./RallyInfo";

export default class CreateNewRally extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      userLat: null,
      userLng: null,
    };
  }

  changeData(data) {
    const locations = this.state.locations.slice();
    locations.push(data);
    this.setState({ locations });
  }

  success(pos) {
    const crd = pos.coords;
    this.setState({ userLat: crd.latitude, userLng: crd.longitude });
  }

  render() {
    navigator.geolocation.getCurrentPosition((pos) => this.success(pos));
    return (
      <div>
        <Map
          changeData={(data) => this.changeData(data)}
          isFilledIn={(info) => info.length > 0}
          userLat={this.state.userLat}
          userLng={this.state.userLng}
        />
        <LocationList locations={this.state.locations} />
        <RallyInfoInput />
      </div>
    );
  }
}
