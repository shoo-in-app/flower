import React from "react";

const Login = (props) => {
  const style = {
    margin: "70px auto",
    width: "347px",
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#A61414",
  };
  const button = {
    marginTop: "15px",
    marginBottom: "15px",
    padding: "17px",
    width: "270px",
    fontSize: "1.2em",
    cursor: "pointer",
  };
  return (
    <div style={style}>
      <h1 style={{ color: "white" }}>Shoo-in</h1>
      <a href="/auth/google">
        <button style={button}>Log in with Google</button>
      </a>
    </div>
  );
};

export default Login;
