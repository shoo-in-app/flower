import React from "react";
import style from "../styles/Login.css";
import Card from "@material-ui/core/Card";
import GoogleButton from "react-google-button";
import android from "../images/android.png";
import ios from "../images/ios.svg";
import logo from "../images/prep-white.png";

const Login = () => {
  return (
    <Card className={style.login}>
      <img src={logo} alt={"logo"} style={{ margin: "auto", width: "50%" }} />
      <p style={{ color: "white" }}>Welcome to the rally creation page</p>

      <a href="/auth/google" style={{ textDecoration: "none" }}>
        <GoogleButton style={{ margin: "auto" }} type="dark" />
      </a>

      <p style={{ color: "white" }}>Download mobile App</p>
      <div>
        <a
          href={
            "https://play.google.com/store/apps/details?id=com.shooin.stamprally"
          }
        >
          <img src={android} alt={"android"} style={{ width: "200px" }} />
        </a>
        <div style={{ display: "block", opacity: ".5" }}>
          <img src={ios} alt={"ios"} style={{ width: "176px" }} />
        </div>
      </div>
    </Card>
  );
};

export default Login;
