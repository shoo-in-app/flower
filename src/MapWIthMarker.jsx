import React, { Component } from "react";
const _ = require("lodash");
const {
  compose,
  withProps,
  lifecycle,
  withStateHandlers,
} = require("recompose");
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
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
      isOpen: false,
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
          lat: 41.9,
          lng: -87.624,
        },
        markers: [],
        marker: {
          lat: 0,
          lng: 0,
        },
        onMapMounted: (ref) => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          });
        },
        onClick: (e) => {
          console.log(e);
          this.setState({
            lat: e.pa.x,
            lng: e.pa.y,
          });
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
          // refs.map.fitBounds(bounds);
        },
      });
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    onDrag={true}
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
    onClick={props.onClick}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <div>
        <input
          type="text"
          placeholder="Customized your placeholder"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            marginTop: `27px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        />
        <div
          style={{
            backgroundColor: "#fff",
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `150px`,
            marginTop: `27px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        >
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
            onClick={(e) => {
              const locationData = {
                name: document.getElementById("name").value,
                description: document.getElementById("description").value,
                lat: props.lat,
                lng: props.lng,
              };
              props.changeData(locationData);
            }}
          >
            Add
          </button>
        </div>
      </div>
    </SearchBox>
    {props.markers.map((marker, index) => (
      <Marker
        key={index}
        position={marker.position}
        onClick={props.onToggleOpen}
      >
        {props.isOpen && (
          <InfoBox
            onCloseClick={props.onToggleOpen}
            options={{ closeBoxURL: ``, enableEventPropagation: true }}
          >
            <div
              style={{
                backgroundColor: `yellow`,
                opacity: 0.75,
                padding: `12px`,
              }}
            >
              <span>
                Lat: {props.lat} <br /> Lng: {props.lng}
              </span>
            </div>
          </InfoBox>
        )}
      </Marker>
    ))}
  </GoogleMap>
));

export default class CreateNewRally extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMarkerShown: false,
      locations: [],
    };
    this.changeData = this.changeData.bind(this);
  }

  changeData(data) {
    const locations = this.state.locations.slice();
    locations.push(data);
    this.setState({ locations });
  }

  render() {
    return (
      <div>
        <MapWithASearchBox changeData={this.changeData} />
        {JSON.stringify(this.state.locations)}
      </div>
    );
  }
}
