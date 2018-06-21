import React, { Component } from "react";
import axios from "axios";
import style from "../styles/List.css";
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rallies: [],
    };
  }

  // After creating GET method, use the below
  componentDidMount() {
    axios
      .get("/web-api/rallies/")
      .then((res) => res.data)
      .then((rallies) => this.setState({ rallies }))
      .catch((err) => {
        console.log("Something wrong: ", err);
      });
  }

  get rallies() {
    return (
      <ul className={style.ul}>
        {this.state.rallies.map((rally, index) => (
          <li key={index} className={style.li}>
            <p className={style.title}>Title: {rally.title}</p>
            <p>Description: {rally.description}</p>
            <p>Locations: {JSON.stringify(rally.locations)}</p>
            <span>
              Period:
              {rally.start_datetime} ~ {rally.end_datetime}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    let content;
    if (this.state.rallies.length > 0) {
      content = this.rallies;
    } else {
      content = <p>You have not created any rallies yet.</p>;
    }
    return <div style={{ backgroundColor: "#fafafa" }}>{content}</div>;
  }
}
