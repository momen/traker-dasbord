import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { authLayoutRoutes, dashboardLayoutRoutes } from "./index";

import DashboardLayout from "../layouts/Dashboard";
import AuthLayout from "../layouts/Auth";
import Error404 from "../components/pages/Error404/Error404";
import { LastLocationProvider } from "react-router-last-location";

const childRoutes = (Layout, routes) =>
  routes.map(
    ({ component: Component, guard, children, path, permission }, index) => {
      const Guard = guard || React.Fragment;

      return children ? (
        children.map((element, index) => {
          const Guard = element.guard || React.Fragment;

          return (
            <Route
              key={index}
              path={element.path}
              exact
              render={(props) => (
                <Layout>
                  <Guard permission={element.permission}>
                    <element.component {...props} />
                  </Guard>
                </Layout>
              )}
            />
          );
        })
      ) : Component ? (
        <Route
          key={index}
          path={path}
          exact
          render={(props) => (
            <Layout>
              <Guard permission={permission}>
                <Component {...props} />
              </Guard>
            </Layout>
          )}
        />
      ) : null;
    }
  );

const Routes = () => (
  <Router>
    <LastLocationProvider>
      <Switch>
        {childRoutes(DashboardLayout, dashboardLayoutRoutes)}
        {childRoutes(AuthLayout, authLayoutRoutes)}
        <Route
          render={() => (
            <AuthLayout>
              <Error404 />
            </AuthLayout>
          )}
        />
      </Switch>
    </LastLocationProvider>
  </Router>
);

export default Routes;
