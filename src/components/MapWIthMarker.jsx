import React from "react";
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
            path: google.maps.SymbolPath.CIRCLE,
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
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: "green",
            scale: 5,
          }}
          position={{ lat: props.lat, lng: props.lng }}
        />
      )}
      {/* Show selected locations */}
      {props.selectedMarkers.map((marker, index) => {
        return (
          <Marker
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              strokeColor: "blue",
              scale: 5,
            }}
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
          />
        );
      })}
      <Marker
        icon={{ url: "user.svg" }}
        position={{ lat: props.userLat, lng: props.userLng }}
      />
    </GoogleMap>
  );
});

export default MapWithASearchBox;
