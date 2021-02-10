import React from "react";

import async from "../components/Async";

import { Briefcase, ShoppingCart, Users } from "react-feather";
import SignIn from "../components/pages/SignIn/SignIn";
import AuthGuard from "../components/AuthGuard";
import { Group, LockOpen } from "@material-ui/icons";

// Guards
// const AuthGuard = async(() => import("../components/AuthGuard"));

// Dashboards components
// const Default = async(() => import("../pages/dashboards/Default"));
// const Analytics = async(() => import("../pages/dashboards/Analytics"));
// const SaaS = async(() => import("../pages/dashboards/SaaS"));
const Dashborad = async(() =>
  import("../components/pages/Dashboard/Dashboard")
);
const UserManagement = async(() =>
  import("../components/pages/UserManagement/UserManagement")
);

// Protected routes
// const ProtectedPage = async(() => import("../pages/protected/ProtectedPage"));

// const dashboardsRoutes = {
//   id: "Dashboard",
//   path: "/dashboard",
//   header: "Pages",
//   icon: <Sliders />,
//   containsHome: true,
//   children: [
//     {
//       path: "/dashboard/default",
//       name: "Default",
//       component: Default,
//     },
//     {
//       path: "/dashboard/analytics",
//       name: "Analytics",
//       component: Analytics,
//     },
//     {
//       path: "/dashboard/saas",
//       name: "SaaS",
//       component: SaaS,
//     },
//   ],
//   component: null,
// };

const dashboardRoutes = {
  id: "Dashborad",
  path: "/",
  icon: <Briefcase />,
  badge: "8",
  component: Dashborad,
  children: null,
};

const userManagementRoutes = {
  id: "User Management",
  path: "/user-mgt",
  icon: <Group />,
  component: null,
  children: [
    {
      path: "/user-mgt/permissions",
      name: "Permissions",
      component: UserManagement,
      icon: <LockOpen />,
    },
    {
      path: "/user-mgt/default",
      name: "Permissions",
      component: UserManagement,
    },
    {
      path: "/user-mgt/default",
      name: "Permissions",
      component: UserManagement,
    },
  ],
};

const authRoutes = {
  id: "Auth",
  // path: "/auth",
  icon: <Users />,
  children: [
    {
      path: "/sign-in",
      name: "Sign In",
      component: SignIn,
    },
    // {
    //   path: "/auth/sign-up",
    //   name: "Sign Up",
    //   component: SignUp,
    // },
    // {
    //   path: "/auth/reset-password",
    //   name: "Reset Password",
    //   component: ResetPassword,
    // },
    // {
    //   path: "/auth/404",
    //   name: "404 Page",
    //   component: Page404,
    // },
    // {
    //   path: "/auth/500",
    //   name: "500 Page",
    //   component: Page500,
    // },
  ],
  component: null,
};

// Routes using the Dashboard layout
export const dashboardLayoutRoutes = [dashboardRoutes, userManagementRoutes];

// Routes using the Auth layout
export const authLayoutRoutes = [authRoutes];

// Routes that are protected
// export const protectedRoutes = [protectedPageRoutes];

// Routes visible in the sidebar
export const sidebarRoutes = [dashboardRoutes, userManagementRoutes];
