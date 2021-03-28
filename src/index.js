import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import "./index.css";
import App from "./App";
import { StateProvider } from "./StateProvider";
import reducer, { initialState } from "./reducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from './reducers'

Sentry.init({
  dsn: "https://f496a1b07ee64765996f62ac5dc1e232@o551399.ingest.sentry.io/5674833",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});


ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore(reducers)}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
