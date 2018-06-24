import React, { Component } from "react";
import style from "../styles/Map.css";
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

const myLyfecycle = lifecycle({
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

        const nextCenter = _.get(nextMarkers, "0.position", this.state.center);

        this.setState({
          center: nextCenter,
          markers: nextMarkers,
        });
      },
    });
  },
});

const myMap = (props) => {
  return (
    <GoogleMap
      ref={props.onMapMounted}
      defaultZoom={8}
      zoom={props.zoom}
      center={props.center}
      onBoundsChanged={props.onBoundsChanged}
      onClick={(e) => props.onMapClick(e)}
      defaultOptions={{ mapTypeControl: false }}
    >
      <div className={style.infoWindow}>
        <SearchBox
          ref={props.onSearchBoxMounted}
          bounds={props.bounds}
          controlPosition={google.maps.ControlPosition.TOP_LEFT}
          onPlacesChanged={props.onPlacesChanged}
        >
          <div className={style.infoWindowBackground}>
            <input
              type="text"
              placeholder="Search locations"
              className={style.infoWindowInput}
            />
            <div className={style.locationInfo}>
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
          onClick={() => props.onSearchedMarkerClick(marker)}
        />
      ))}

      {/* Clicked location on the map */}
      {props.isMarkerShown && (
        <Marker
          icon={logstampUncollectedSmall}
          position={{ lat: props.lat, lng: props.lng }}
        />
      )}

      {/* Show selected locations */}
      {props.selectedMarkers.map((marker, index) => {
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
          strokeColor: "blue",
          scale: 5,
        }}
        position={{ lat: props.userLat, lng: props.userLng }}
      />
    </GoogleMap>
  );
};

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
