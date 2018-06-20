import React from "react";

const Login = (props) => (
  <div>
    {props.isAuthenticated ? (
      <a href="/logout">
        <button>Log out</button>
      </a>
    ) : (
      <a href="/auth/google">
        <button>Log In with Google to see more</button>
      </a>
    )}
  </div>
);

export default Login;
