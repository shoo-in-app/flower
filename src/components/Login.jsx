import React from "react";
import style from "../styles/Login.css";
import Card from "@material-ui/core/Card";
import GoogleButton from "react-google-button";
import android from "../images/android.png";
import ios from "../images/ios.svg";

const Login = () => {
  return (
    <Card className={style.login}>
      <h1 style={{ color: "white" }}>Shoo-in</h1>
      <p style={{ color: "white" }}>Welcome to the rally creation page</p>

      <a href="/auth/google" style={{ textDecoration: "none" }}>
        <GoogleButton style={{ margin: "auto" }} type="dark" />
      </a>

      <p style={{ color: "white" }}>Download mobile App</p>
      <div>
        <img src={android} alt={"android"} className={style.download} />
        <img src={ios} alt={"ios"} className={style.download} />
      </div>
    </Card>
  );
};

export default Login;
