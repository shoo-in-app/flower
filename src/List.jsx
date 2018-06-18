import React, { Component } from "react";

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
  render() {
    // if there is a list of rallies, display them
    return <div>{JSON.stringify(this.state.rallies)}</div>;
    // if not, display the friendly message to inform the user that there is no list of rallies
  }
}
