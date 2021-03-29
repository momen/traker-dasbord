import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

// For routes that can only be accessed by authenticated users
function AuthGuard({ children }) {
  // const auth = useSelector((state) => state.authReducer);
  const userToken = useSelector((state) => state.userToken);
  const history = useHistory();

  if (userToken) {
    return <Redirect to="/" />;
  }

  return children;
}

export default AuthGuard;
