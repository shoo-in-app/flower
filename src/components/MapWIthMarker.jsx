import React, { Component } from "react";
import axios from "axios";
import logstampCollectedSmall from "../images/stamp-collected-small.png";
import logstampUncollectedSmall from "../images/stamp-uncollected-small.png";

const _ = require("lodash");
const {
  compose,
  withProps,
  lifecycle,
  withStateHandlers,
} = require("recompose");
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
  withStateHandlers(() => ({
    isMarkerShown: false,
    isOpen: false,
  })),
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
        zoom: 8,
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
          const myLatLng = e.latLng;
          this.setState({
            isMarkerShown: true,
            lat: myLatLng.lat(),
            lng: myLatLng.lng(),
          });
        },
        setCenter: (e) => {
          const myLatLng = e.latLng;
          this.setState({
            zoom: 11,
            center: {
              lat: myLatLng.lat(),
              lng: myLatLng.lng(),
            },
          });
        },
        onSearchedMarkerClick: (location) => {
          this.setState({
            lat: location.position.lat(),
            lng: location.position.lng(),
          });
        },
        AddMarkers: (lat, lng) => {
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
      zoom={props.zoom}
      center={props.center}
      onBoundsChanged={props.onBoundsChanged}
      onClick={function(e) {
        props.setCenter(e);
        props.onMapClick(e);
      }}
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
              <input type="text" name="" id="name" size="32" />
              <br />
              <label htmlFor="description">Description: </label>
              <br />
              <textarea
                type="text"
                name=""
                id="description"
                rows="2"
                cols="30"
              />
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
      {props.markers.map((marker, index) => (
        <Marker
          icon={{
            strokeColor: "red",
            scale: 5,
          }}
          key={index}
          position={marker.position}
          onClick={function(e) {
            props.setCenter(e);
            props.onSearchedMarkerClick(marker);
          }}
        />
      ))}
      {/* Clicked location on the map */}
      {props.isMarkerShown && (
        <Marker
          icon="../images/stamp-uncollected-small.png"
          position={{ lat: props.lat, lng: props.lng }}
        />
      )}
      {/* Show selected locations */}
      {props.selectedMarkers.map((marker, index) => {
        return (
          <Marker
            icon="../images/stamp-collected-small.png"
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
          />
        );
      })}

      {/* Current user location */}
      <Marker
        icon={{
          strokeColor: "blue",
          scale: 5,
        }}
        position={{ lat: props.userLat, lng: props.userLng }}
      />
    </GoogleMap>
  );
});

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
