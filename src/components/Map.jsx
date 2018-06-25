import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import style from "../styles/Map.css";
import logstampCollectedSmall from "../images/stamp-collected-small.png";
import logstampUncollectedSmall from "../images/stamp-uncollected-small.png";
import Button from "@material-ui/core/Button";
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

const myLyfecycle = lifecycle({
  componentWillMount() {
    const refs = {};
    this.setState({
      zoom: 14,
      bounds: null,
      center: { lat: 35.6895, lng: 139.6917 },
      user: { lat: null, lng: null },
      markers: [],
      selectedMarkers: [],
      marker: { lat: 0, lng: 0 },
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
          if (onBoundsChange) onBoundsChange(refs.map);
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

      setCenter: (lat, lng, zoom = 14) => {
        this.setState({ zoom, center: { lat, lng }, user: { lat, lng } });
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
        refs.map.fitBounds(bounds);
        const nextMarkers = places.map((place) => ({
          position: place.geometry.location,
        }));
        const nextCenter = _.get(nextMarkers, "0.position", this.state.center);
        this.setState({ center: nextCenter, markers: nextMarkers });
      },
    });
  },
});

class myMap extends Component {
  render() {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      this.props.setCenter(lat, lng);
    });
    return (
      <GoogleMap
        ref={this.props.onMapMounted}
        defaultZoom={14}
        zoom={this.props.zoom}
        center={this.props.center}
        onBoundsChanged={this.props.onBoundsChanged}
        onClick={(e) => this.props.onMapClick(e)}
        defaultOptions={{ mapTypeControl: false }}
      >
        <div className={style.infoWindow}>
          <SearchBox
            ref={this.props.onSearchBoxMounted}
            bounds={this.props.bounds}
            controlPosition={google.maps.ControlPosition.TOP_LEFT}
            onPlacesChanged={this.props.onPlacesChanged}
          >
            <div className={style.infoWindowBackground}>
              <input
                type="text"
                placeholder="Search locations"
                className={style.infoWindowInput}
              />
              <div className={style.locationInfo}>
                <TextField
                  required
                  label="name"
                  margin="normal"
                  name="name"
                  id="name"
                  size="32"
                  defaultValue=""
                  style={{ width: 200 }}
                />

                <TextField
                  required
                  label="description"
                  name="description"
                  id="location-description"
                  hintText=""
                  multiLine={true}
                  rows={4}
                  rowsMax={4}
                />
                <br />
                <span>
                  Lat: {this.props.lat} <br /> Lng: {this.props.lng}
                </span>
                <br />
                <Button
                  color="accent"
                  onClick={() => {
                    const locationData = {
                      name: document.getElementById("name").value,
                      description: document.getElementById(
                        "location-description"
                      ).value,
                      lat: this.props.lat,
                      lng: this.props.lng,
                    };
                    this.props.addLocation(locationData);
                    this.props.AddMarkers(locationData.lat, locationData.lng);
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </SearchBox>
        </div>

        {/* Searched result locations */}
        {this.props.markers.map((marker, index) => (
          <Marker
            icon={{ strokeColor: "red", scale: 5 }}
            key={index}
            position={marker.position}
            onClick={() => this.props.onSearchedMarkerClick(marker)}
          />
        ))}

        {/* Clicked location on the map */}
        {this.props.isMarkerShown && (
          <Marker
            icon={logstampUncollectedSmall}
            position={{ lat: this.props.lat, lng: this.props.lng }}
          />
        )}

        {/* Show selected locations */}
        {this.props.selectedMarkers.map((marker, index) => {
          return (
            <Marker
              icon={logstampCollectedSmall}
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
            />
          );
        })}

        {/* Current user location */}
        <Marker
          icon={{
            url:
              "http://mt.google.com/vt/icon?psize=27&font=fonts/Roboto-Bold.ttf&color=ff17135c&name=icons/spotlight/spotlight-waypoint-blue.png&ax=43&ay=50&text=%E2%80%A2&scale=1",
          }}
          position={{ lat: this.props.user.lat, lng: this.props.user.lng }}
        />
      </GoogleMap>
    );
  }
}

const Map = compose(
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
  myLyfecycle,
  withScriptjs,
  withGoogleMap
)(myMap);

export default Map;
