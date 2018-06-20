import React, { Component } from "react";
import axios from "axios";
import { get } from "https";
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rallies: [
        // {
        //   title: "test",
        //   description: "test",
        //   start_datetime: "2018-06-19T14:59:00.000Z",
        //   end_datetime: "2018-06-21T13:56:00.000Z",
        //   locations: [
        //     {
        //       name: "test",
        //       description: "test",
        //       lat: 227.4066325,
        //       lng: 100.47180978252506,
        //     },
        //   ],
        // },
        // {
        //   title: "test",
        //   description: "test",
        //   start_datetime: "2018-06-19T14:59:00.000Z",
        //   end_datetime: "2018-06-21T13:56:00.000Z",
        //   locations: [
        //     {
        //       name: "test",
        //       description: "test",
        //       lat: 227.4066325,
        //       lng: 100.47180978252506,
        //     },
        //   ],
        // },
      ],
    };
  }
  // After creating GET method, use the below
  componentDidMount() {
    // axios
    //   .get(`http://localhost:8000/web-api/rallies/`)
    //   .then((response) => {
    axios
      .get(`https://cc4-flower.herokuapp.com/web-api/rallies/`)
      .then((response) => {
        return response.data;
      })
      .then((rallies) => this.setState({ rallies }))
      .catch((err) => {
        console.log("Something wrong: ", err);
      });
  }
  render() {
    let rallies;
    const bodyStyle = {
      backgroundColor: `#fafafa`,
    };
    if (this.state.rallies.length > 0) {
      const titleStyle = {
        fontSize: "13px",
        fontWeight: "600",
        lineHeight: "1.6",
        letterSpacing: "-.02em",
        wordSpacing: ".1em",
      };
      const ulStyle = {
        backgroundClip: ` padding-box`,
        backgroundColor: ` #fff`,
        border: ` 1px solid rgba(0,0,0,.12)`,
        borderRadius: ` 3px`,
        display: ` block`,
        listStyle: ` none`,
        margin: ` 0 0 16px`,
        padding: ` 0`,
      };
      const liStyle = {
        fontFamily: '"Graphik Meetup",helvetica,arial,sans-serif',
        color: "#333",
        margin: "10px",
        padding: "16px 16px 0",
        borderBottom: "1px solid rgba(0, 0, 0, .12)",
        fontSize: "16px",
        listStyle: "none",
      };
      rallies = (
        <ul style={ulStyle}>
          {this.state.rallies.map((rally, index) => {
            return (
              <li key={index} style={liStyle}>
                <p style={titleStyle}>Title: {rally.title}</p>
                <p>Description: {rally.description}</p>
                <p>Locations: {JSON.stringify(rally.locations)}</p>
                <span>
                  Period:
                  {rally.start_datetime} ~ {rally.end_datetime}
                </span>
              </li>
            );
          })}
        </ul>
      );
    } else {
      console.log("no rallies", this.state.rallies);

      rallies = <p>You have not created any rallies yet.</p>;
    }
    return <div style={bodyStyle}>{rallies}</div>;
  }
}
