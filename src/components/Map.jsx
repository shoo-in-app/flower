import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import style from "../styles/Map.css";
import logstampCollectedSmall from "../images/stamp-collected-small.png";
import logstampUncollectedSmall from "../images/stamp-uncollected-small.png";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

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
      zoom: 13,
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
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        this.setState({ zoom: 16 });
        this.setState({
          isMarkerShown: true,
          lat: lat,
          lng: lng,
          zoom: 15,
          center: { lat, lng },
        });
      },

      setCenter: (lat, lng, zoom = 13) => {
        this.setState({ zoom, center: { lat, lng }, user: { lat, lng } });
      },

      onSearchedMarkerClick: (marker) => {
        this.setState({
          isMarkerShown: true,
          lat: marker.position.lat(),
          lng: marker.position.lng(),
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
        defaultZoom={13}
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
            <Card className={style.infoWindowBackground} elevation={4}>
              <input
                type="text"
                placeholder="Search locations"
                className={style.infoWindowInput}
              />
              <div className={style.locationInfo}>
                <TextField
                  required
                  label="name"
                  name="name"
                  id="name"
                  size="32"
                  defaultValue=""
                />
                <TextField
                  required
                  label="description"
                  name="locationDescription"
                  id="location-description"
                  style={{ width: "210px" }}
                />
                <Typography
                  variant="subheading"
                  color="textSecondary"
                  style={{ margin: "14px" }}
                >
                  Lat: {this.props.lat ? this.props.lat.toFixed(4) : ""} <br />
                  Lng: {this.props.lng ? this.props.lng.toFixed(4) : ""}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  style={{ margin: "2px 0" }}
                  onClick={() => {
                    if (!this.props.lat) return;
                    const name = document.getElementById("name");
                    const desc = document.getElementById(
                      "location-description"
                    );
                    const locationData = {
                      name: name.value,
                      description: desc.value,
                      lat: this.props.lat,
                      lng: this.props.lng,
                    };
                    this.props.addLocation(locationData);
                    this.props.AddMarkers(locationData.lat, locationData.lng);
                    name.value = "";
                    desc.value = "";
                  }}
                >
                  Add
                </Button>
              </div>
            </Card>
          </SearchBox>
        </div>

        {/* Searched result locations */}
        {this.props.markers.map((marker, index) => (
          <Marker
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
              "http://mt.google.com/vt/icon/Roboto-Bold.ttf&name=icons/spotlight/spotlight-waypoint-blue.png",
          }}
          position={{ lat: this.props.user.lat, lng: this.props.user.lng }}
        />
      </GoogleMap>
    );
  }
}

const Map = compose(
  withStateHandlers(() => ({ isMarkerShown: false, isOpen: false })),
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
