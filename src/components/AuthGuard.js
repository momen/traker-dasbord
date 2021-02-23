import React from "react";
import { Redirect } from "react-router-dom";
import { useStateValue } from "../StateProvider";

// For routes that can only be accessed by authenticated users
function AuthGuard({ children }) {
  // const auth = useSelector((state) => state.authReducer);
  const [{ user }] = useStateValue();

  if (!user) {
    return <Redirect to="/sign-in" />;
  }

  return children;
}

export default AuthGuard;
