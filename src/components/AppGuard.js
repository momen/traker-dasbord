import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import axios from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { isAuthenticated, notAuthenticated } from "../actions";

// For routes that can only be accessed by authenticated users
function AppGuard({ children }) {
  // const auth = useSelector((state) => state.authReducer);
  const { user, userToken } = useSelector((state) => {
    return { user: state.user, userToken: state.userToken };
  });
  const dispatch = useDispatch();

  if (!userToken && !user) {
    return <Redirect to="/sign-in" />;
  }

  if (!user && userToken) {
    axios
      .post(`token/data`, null, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(async ({ data }) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;

        await dispatch(isAuthenticated(data.data.user));
        return <Redirect to="/" />;
      })
      .catch(async () => {
        await dispatch(notAuthenticated());
        return <Redirect to="/sign-in" />;
      });
  }

  // axios.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(
  //   window.localStorage.getItem("trkar-token")
  // )}`;

  return children;
}

export default AppGuard;
