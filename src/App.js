import React, { useEffect } from "react";
import * as Sentry from "@sentry/react";
// import { useSelector } from "react-redux";
import "./App.css";
import { Helmet } from "react-helmet";
import DateFnsUtils from "@date-io/date-fns";

import { ThemeProvider } from "styled-components/macro";
import { create } from "jss";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
  jssPreset,
} from "@material-ui/core/styles";

import createTheme from "./theme";
import Routes from "./routes/Routes";
import { THEMES } from "./constants";
import { useStateValue } from "./StateProvider";
import axios from "./axios";
import { Redirect } from "react-router-dom";

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

function App() {
  // const theme = useSelector((state) => state.themeReducer);
  const [{ userToken, theme }, dispatch] = useStateValue();

  // Inject the token in the headers to be available on each request from the beginning, & this is
  // done only on the initial render.
  // Actually this is useful only if the user refreshed the page or openning the App on a new tab &
  // but his token is still available so he won't have to Sign-In, otherwise if the token is expired, or
  // no token is found, the Sign-In will do this part.
  // The guard is fixing a UX bug that arises in the above case that the data couldn't be fetched at the
  // beginning as no token is provided in the headers
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
  }, []);

  axios.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      if (err.response?.data.message === "Unauthenticated.") {
         dispatch({
          type: "LOGOUT",
        });
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("trkar-token");
        <Redirect to="/sign-in" />;
        return new Promise(() => {});
      }
      return Promise.reject(err);
    }
  );

  return (
    <React.Fragment>
      <Helmet
        titleTemplate="%s | Material App"
        defaultTitle="Material App - React Admin & Dashboard Template"
      />
      <StylesProvider jss={jss}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <MuiThemeProvider theme={createTheme(theme)}>
            <ThemeProvider theme={createTheme(theme)}>
              <Routes />
            </ThemeProvider>
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </StylesProvider>
    </React.Fragment>
  );
}

export default App;
