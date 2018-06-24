import React, { Component } from "react";
import axios from "axios";
export default class CreateNewRally extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      description: "",
      userLat: null,
      userLng: null,
    };
    this.changeData = this.changeData.bind(this);
    this.submit = this.submit.bind(this);
    this.isDateValid = this.isDateValid.bind(this);
    this.success = this.success.bind(this);
  }

  changeData(data) {
    const locations = this.state.locations.slice();
    locations.push(data);
    this.setState({ locations });
  }

  submit(period) {
    const rally = period;
    rally["locations"] = this.state.locations;
    axios.post("/web-api/rally/", rally).catch((err) => {
      console.log("Something wrong: ", err);
    });
  }

  changeDesc(description) {
    this.setState({ description });
  }

  isDateValid(startDate, endDate) {
    return startDate > endDate;
  }

  isFilledIn(information) {
    return information.length > 0;
  }

  success(pos) {
    const crd = pos.coords;
    this.setState({ userLat: crd.latitude, userLng: crd.longitude });
  }

  render() {
    navigator.geolocation.getCurrentPosition(this.success);
    const leftStyle = { padding: `10px` };
    const rightStyle = { float: "right", width: "70%" };
    const ulStyle = {
      backgroundClip: " padding-box",
      backgroundColor: " #fff",
      border: " 1px solid rgba(0,0,0,.12)",
      borderRadius: " 3px",
      display: " block",
      listStyle: " none",
      margin: " 0 0 16px",
      padding: " 0",
      height: "200px",
      overflow: "scroll",
    };
    const liStyle = {
      listStyle: "none",
      padding: " 16px 16px 0",
      borderTop: "1px solid rgba(0,0,0,.12)",
      fontSize: "16px",
    };
    return (
      <div>
        <MapWithASearchBox
          changeData={this.changeData}
          isFilledIn={this.isFilledIn}
          userLat={this.state.userLat}
          userLng={this.state.userLng}
        />
        <div style={rightStyle}>
          <ul style={ulStyle}>
            {this.state.locations.map((location, index) => {
              return (
                <li key={index} style={liStyle}>
                  <p>Name: {location.name}</p>
                  <p>Description: {location.description}</p>
                  <p>Lat: {location.lat}</p>
                  <p>Lng: {location.lng}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <div style={leftStyle}>
          <label htmlFor="title">Title: </label>
          <br />
          <input type="text" name="title" id="title" size="32" />
          <br />
          <label htmlFor="description">Description: </label>
          <br />
          <textarea
            type="text"
            name="description"
            id="description"
            rows="4"
            cols="30"
            onChange={(e) => this.changeDesc(e.target.value)}
          />
          <br />
          <label htmlFor="start">Start: </label>
          <br />
          <input
            type="datetime-local"
            name="start"
            id="start"
            defaultValue={new Date().toISOString().slice(0, -5)}
          />
          <br />
          <label htmlFor="end">End: </label>
          <br />
          <input
            type="datetime-local"
            name="end"
            id="end"
            value={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, -5)}
          />
          <br />
          <button
            onClick={() => {
              const start_datetime = new Date(
                document.getElementById("start").value
              ).toISOString();
              const end_datetime = new Date(
                document.getElementById("end").value
              ).toISOString();
              const period = {
                title: document.getElementById("title").value,
                description: this.state.description,
                start_datetime,
                end_datetime,
              };
              return this.submit(period);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}
