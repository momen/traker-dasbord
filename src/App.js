import React, { useEffect } from "react";
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
import axios from "./axios";
import { Redirect } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { Logout } from "./actions";
import { THEMES } from "./constants";

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

function App({ userToken, theme }) {
  // const userToken = useSelector((state) => state.userToken);
  // const [{ userToken, theme }, dispatch] = useStateValue();
  const dispatch = useDispatch();

  // Inject the token in the headers to be available on each request from the beginning, & this is
  // done only on the initial render.
  // Actually this is useful only if the user refreshed the page or openning the App on a new tab &
  // but his token is still available so he won't have to Sign-In, otherwise if the token is expired, or
  // no token is found, the Sign-In will do this part.
  // The guard is fixing a UX bug that arises in the above case that the data couldn't be fetched at the
  // beginning as no token is provided in the headers
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;

    axios.interceptors.response.use(
      (res) => {
        return res;
      },
      async (err) => {
        if (err.response?.data.message === "Unauthenticated.") {
          dispatch(Logout()); //Logout Action Creator
          delete axios.defaults.headers.common["Authorization"];
          localStorage.removeItem("trkar-token");
          <Redirect to="/sign-in" />;
          return new Promise(() => {});
        }
        return Promise.reject(err);
      }
    );
  }, []);

  return (
    <React.Fragment>
      <Helmet
        titleTemplate="%s | Material App"
        defaultTitle="Material App - React Admin & Dashboard Template"
      />
      <StylesProvider jss={jss}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <MuiThemeProvider
            theme={createTheme(
              theme === "light" ? THEMES.DEFAULT : THEMES.DARK
            )}
          >
            <ThemeProvider
              theme={createTheme(
                theme === "light" ? THEMES.DEFAULT : THEMES.DARK
              )}
            >
              <Routes />
            </ThemeProvider>
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </StylesProvider>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    userToken: state.userToken,
    theme: state.theme,
  };
};

export default connect(mapStateToProps, { Logout })(App);
