import React from "react";

const Login = (props) => (
  <div>
    {props.isAuthenticated ? (
      <h3> Welcome! {props.currentUser} </h3>
    ) : (
      <a href="/auth/google">
        <button>Log In with Google to see more</button>
      </a>
    )}
  </div>
);

export default Login;
