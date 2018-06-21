import React from "react";
import style from "../static/style.css";

const Login = () => {
  return (
    <div className={style.login}>
      <h1 style={{ color: "white" }}>Shoo-in</h1>
      <a href="/auth/google">
        <button className={style.button}>Log in with Google</button>
      </a>
    </div>
  );
};

export default Login;
