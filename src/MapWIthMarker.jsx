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
      markerPosition: null,
    }),
    {
      onToggleOpen: ({ isOpen }) => () => ({
        isOpen: !isOpen,
      }),
    }
  ),
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDe-SSvqZrjeDeD3clObxGng67gPOB76aQ&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
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
        onClick: (e) => {
          console.log(e);
          console.log(this.state);
          // marker = JSON.stringify(<Marker position={{ lat, lng }} />);
          this.setState({
            lat: e.qa.x,
            lng: e.qa.y,
          });
        },
        onMapClick: (e) => {
          console.log(e.latLng);
          return {
            markerPosition: e.latLng,
            isMarkerShown: true,
          };
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
  const infoWindow = { position: `absolute`, left: `0` };
  const infoWindowBackground = {
    backgroundColor: `#A61414`,
    zIndex: `1`,
    padding: `0 10px 10px`,
  };
  const infoWindowInput = {
    boxSizing: `border-box`,
    border: `1px solid transparent`,
    width: `240px`,
    height: `32px`,
    marginTop: `10px`,
    padding: `0 12px`,
    borderRadius: `3px`,
    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
    fontSize: `14px`,
    outline: `none`,
    textOverflow: `ellipses`,
  };
  const locationInfo = {
    backgroundColor: "#fff",
    boxSizing: `border-box`,
    border: `1px solid transparent`,
    width: `240px`,
    height: `150px`,
    marginTop: `10px`,
    padding: `0 12px`,
    borderRadius: `3px`,
    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
    fontSize: `14px`,
    outline: `none`,
    textOverflow: `ellipses`,
  };
  return (
    <GoogleMap
      ref={props.onMapMounted}
      defaultZoom={8}
      center={props.center}
      onBoundsChanged={props.onBoundsChanged}
      onClick={props.onClick}
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
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        </SearchBox>
      </div>
      {props.markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          onClick={props.onToggleOpen}
        />
      ))}
      {props.isMarkerShown && <Marker position={props.markerPosition} />}
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
    this.changeData = this.changeData.bind(this);
    this.submit = this.submit.bind(this);
    this.isDateValid = this.isDateValid.bind(this);
  }

  changeData(data) {
    const locations = this.state.locations.slice();
    locations.push(data);
    this.setState({ locations });
  }

  submit(period) {
    const rally = period;
    rally["locations"] = this.state.locations;
    console.log("rally: ", rally);
    axios
      .post(`${process.env.URL}/web-api/rally/`, rally)
      .then((response) => {
        console.log("response: ", response);
      })
      .catch(function(error) {
        console.log("Something wrong: ", error);
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
    const leftStyle = { float: `left` };
    const rightStyle = { float: `right`, width: `70%` };
    const ulStyle = {
      backgroundClip: ` padding-box`,
      backgroundColor: ` #fff`,
      border: ` 1px solid rgba(0,0,0,.12)`,
      borderRadius: ` 3px`,
      display: ` block`,
      listStyle: ` none`,
      margin: ` 0 0 16px`,
      padding: ` 0`,
      height: `200px`,
      overflow: `scroll`,
    };
    const liStyle = {
      listStyle: `none`,
      padding: ` 16px 16px 0`,
      borderTop: `1px solid rgba(0,0,0,.12)`,
      fontSize: `16px`,
    };
    return (
      <div>
        <MapWithASearchBox
          changeData={this.changeData}
          isFilledIn={this.isFilledIn}
        />
        <div style={rightStyle}>
          {/* {JSON.stringify(this.state.locations)} */}
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
          <input type="datetime-local" name="start" id="start" />
          <br />
          <label htmlFor="end">End: </label>
          <br />
          <input type="datetime-local" name="end" id="end" />
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
