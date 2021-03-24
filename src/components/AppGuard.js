import React from "react";
import { Redirect } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import axios from "../axios";

// For routes that can only be accessed by authenticated users
function AppGuard({ children }) {
  // const auth = useSelector((state) => state.authReducer);
  const [{ user, userToken }, dispatch] = useStateValue();

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
        console.log("-_-");
        await dispatch({
          type: "LOGIN",
          user: data.data.user,
        });
        return <Redirect to="/" />;
      })
      .catch(({ response }) => {
        return <Redirect to="/sign-in" />;
      });
  }

  axios.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(window.localStorage.getItem("trkar-token"))}`;

  return children;
}

export default AppGuard;
