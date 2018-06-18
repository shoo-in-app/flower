import React, { Component } from "react";
import axios from "axios";
import { get } from "https";
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rallies: [
        {
          title: "test",
          description: "test",
          start_datetime: "2018-06-19T14:59:00.000Z",
          end_datetime: "2018-06-21T13:56:00.000Z",
          locations: [
            {
              name: "test",
              description: "test",
              lat: 227.4066325,
              lng: 100.47180978252506,
            },
          ],
        },
      ],
    };
  }
  // After creating GET method, use the below
  // componentDidMount() {
  //   axios.get(`https://cc4-flower-dev.herokuapp.com/rallies/${userId}`).then(response => {
  //     return response.json();
  //   })
  //     .then(rallies => this.setState({ rallies }))
  //     .catch(err => {
  //       console.log("Something wrong: ", err);
  //     })
  // }
  render() {
    let rallies;
    if (this.state.rallies.length > 0) {
      const rallyList = this.state.rallies.map((rally, index) => (
        <li key={index}>{rally}</li>
      ));
      rallies = <ul>{JSON.stringify(rallyList[0].props.children)}</ul>;
    } else {
      rallies = <p>You have not created any rallies yet.</p>;
    }
    return <div>{rallies}</div>;
  }
}
