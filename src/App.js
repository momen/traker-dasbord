import React from "react";
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
import { useHistory } from "react-router";

const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

function App() {
  // const theme = useSelector((state) => state.themeReducer);
  const [{ userToken, theme }, dispatch] = useStateValue();
  const history = useHistory();


  // axios.interceptors.response.use(
  //   (res) => {
  //     if (res.data?.message === "Unauthenticated.") {
  //       alert("Fail");
  //       return res;
  //     } else {
  //       // dispatch({
  //       //   type: "LOGOUT",
  //       // });

  //       // Promise.reject(res);
  //       alert("Success");
  //       return res;
  //     }
  //   },
  //   (res) => {
  //     return res;
  //   }
  // );

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
