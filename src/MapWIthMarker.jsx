import React, { Component } from "react";
import axios from "axios";
const _ = require("lodash");
const {
  compose,
  withProps,
  lifecycle,
  withStateHandlers,
} = require("recompose");
// const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
const {
  SearchBox,
} = require("react-google-maps/lib/components/places/SearchBox");

const MapWithASearchBox = compose(
  withStateHandlers(
    () => ({
      isMarkerShown: false,
      isOpen: false,
    })
    // {
    //   onToggleOpen: ({ isOpen }) => () => ({
    //     isOpen: !isOpen,
    //   }),
    // }
  ),
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDe-SSvqZrjeDeD3clObxGng67gPOB76aQ&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: "100%" }} />,
    containerElement: <div style={{ height: "400px" }} />,
    mapElement: <div style={{ height: "100%" }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};
      this.setState({
        bounds: null,
        center: {
          lat: 35.6895,
          lng: 139.6917,
        },
        markers: [],
        selectedMarkers: [],
        marker: {
          lat: 0,
          lng: 0,
        },
        onMapMounted: (ref) => {
          refs.map = ref;
        },
        onBoundsChanged: _.debounce(
          () => {
            this.setState({
              bounds: refs.map.getBounds(),
              center: refs.map.getCenter(),
            });
            let { onBoundsChange } = this.props;
            if (onBoundsChange) {
              onBoundsChange(refs.map);
            }
          },
          100,
          { maxWait: 500 }
        ),
        onMapClick: (e) => {
          console.log(e.qa);
          this.setState({
            isMarkerShown: true,
            lat: e.qa.x,
            lng: e.qa.y,
            markerPosition: e.latLng,
          });
        },
        AddMarkers: (lat, lng) => {
          console.log(82, lat, lng);
          const selectedMarkers = this.state.selectedMarkers.slice();
          selectedMarkers.push({ lat, lng });
          this.setState({ isMarkerShown: true, selectedMarkers });
        },
        onSearchBoxMounted: (ref) => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach((place) => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map((place) => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(
            nextMarkers,
            "0.position",
            this.state.center
          );

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
        },
      });
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  const infoWindow = { position: "absolute", left: "0" };
  const infoWindowBackground = {
    backgroundColor: "#A61414",
    zIndex: "1",
    padding: "0 10px 10px",
  };
  const infoWindowInput = {
    boxSizing: "border-box",
    border: "1px solid transparent",
    width: "240px",
    height: "32px",
    marginTop: "10px",
    padding: "0 12px",
    borderRadius: "3px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
    fontSize: "14px",
    outline: "none",
    textOverflow: "ellipses",
  };
  const locationInfo = {
    backgroundColor: "#fff",
    boxSizing: "border-box",
    border: "1px solid transparent",
    width: "240px",
    height: "150px",
    marginTop: "10px",
    padding: "0 12px",
    borderRadius: "3px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
    fontSize: "14px",
    outline: "none",
    textOverflow: "ellipses",
  };
  return (
    <GoogleMap
      ref={props.onMapMounted}
      defaultZoom={8}
      center={props.center}
      onBoundsChanged={props.onBoundsChanged}
      onClick={props.onMapClick}
      defaultOptions={{ mapTypeControl: false }}
    >
      <div style={infoWindow}>
        <SearchBox
          ref={props.onSearchBoxMounted}
          bounds={props.bounds}
          controlPosition={google.maps.ControlPosition.TOP_LEFT}
          onPlacesChanged={props.onPlacesChanged}
        >
          <div style={infoWindowBackground}>
            <input
              type="text"
              placeholder="Customized your placeholder"
              style={infoWindowInput}
            />
            <div style={locationInfo}>
              <label htmlFor="name">Name: </label>
              <br />
              <input type="text" name="" id="name" />
              <br />
              <label htmlFor="description">Description: </label>
              <br />
              <textarea type="text" name="" id="description" />
              <br />
              <span>
                Lat: {props.lat} <br /> Lng: {props.lng}
              </span>
              <br />
              <button
                onClick={() => {
                  const locationData = {
                    name: document.getElementById("name").value,
                    description: document.getElementById("description").value,
                    lat: props.lat,
                    lng: props.lng,
                  };
                  if (
                    props.changeData(locationData.name) &&
                    props.changeData(locationData.description) &&
                    props.changeData(locationData.lat) &&
                    props.changeData(locationData.lng)
                  ) {
                    alert("Show error");
                  } else {
                    props.changeData(locationData);
                    props.AddMarkers(locationData.lat, locationData.lng);
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        </SearchBox>
      </div>
      {/* Searched result locations */}
      {/* {props.markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          onClick={props.onToggleOpen}
        />
      ))} */}
      {/* Clicked location on the map */}
      {/* {props.isMarkerShown && <Marker position={props.markerPosition} />} */}
      {/* Show selected locations */}
      <br />
      {JSON.stringify(props.selectedMarkers)}
      <br />
      <br />
      {props.selectedMarkers.map((marker, index) => {
        console.log(237, marker, props.selectedMarkers);
        return <Marker key={index} position={marker} />;
      })}
    </GoogleMap>
  );
});

export default class CreateNewRally extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      description: "",
    };
    this.AddMarkers = this.AddMarkers.bind(this);
    this.changeData = this.changeData.bind(this);
    this.submit = this.submit.bind(this);
    this.isDateValid = this.isDateValid.bind(this);
  }
  AddMarkers(data) {
    const locations = this.state.locations.slice();
    locations.push(data);
    this.setState({ locations });
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

  render() {
    const leftStyle = { float: "left" };
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
          AddMarkers={this.AddMarkers}
          changeData={this.changeData}
          isFilledIn={this.isFilledIn}
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
          <input type="text" name="title" id="title" />
          <br />
          <label htmlFor="description">Description: </label>
          <br />
          <input
            type="text"
            name="description"
            id="description"
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
              // if (
              //   this.isDateValid(start_datetime, end_datetime) ||
              //   this.isFilledIn(title) ||
              //   this.isFilledIn(description)
              // ) {
              //   alert("Something wrong with your form");
              // } else {
              return this.submit(period);
              // }
            }}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}
