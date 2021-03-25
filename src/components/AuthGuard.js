import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import axios from "../axios";

// For routes that can only be accessed by authenticated users
function AuthGuard({ children }) {
  // const auth = useSelector((state) => state.authReducer);
  const [{ user, userToken }] = useStateValue();
  const history = useHistory();

  if (userToken) {
    return <Redirect to="/" />;
  }

  return children;
}

export default AuthGuard;
