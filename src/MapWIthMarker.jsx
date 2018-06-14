import React, { Component } from "react";
const fetch = require("isomorphic-fetch");
const { compose, withProps } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");

const MapWithAMarker = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDe-SSvqZrjeDeD3clObxGng67gPOB76aQ&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap defaultZoom={3} defaultCenter={{ lat: 25.0391667, lng: 121.525 }}>
    {/* {props.markers.map(marker => (
            <Marker
                key={marker.photo_id}
                position={{ lat: marker.latitude, lng: marker.longitude }}
            />
        ))} */}
  </GoogleMap>
));

export default class CreateNewRally extends Component {
  componentWillMount() {
    this.setState({ markers: [] });
  }

  // componentDidMount() {
  //     const url = [
  //         // Length issue
  //         `https://gist.githubusercontent.com`,
  //         `/farrrr/dfda7dd7fccfec5474d3`,
  //         `/raw/758852bbc1979f6c4522ab4e92d1c92cba8fb0dc/data.json`
  //     ].join("")

  //     fetch(url)
  //         .then(res => res.json())
  //         .then(data => {
  //             this.setState({ markers: data.photos });
  //         });
  // }

  render() {
    return (
      <MapWithAMarker /> //markers={this.state.markers} />
    );
  }
}
