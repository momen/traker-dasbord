import React from "react";

import async from "../components/Async";

import { Briefcase, Calendar, FileText, Folder, LogOut, ShoppingCart, Tag, Unlock, User, Users } from "react-feather";
import SignIn from "../components/pages/SignIn/SignIn";
import AuthGuard from "../components/AuthGuard";
import { BusinessCenter, Dashboard, Group, GroupAdd, GroupWork, LockOpen, TimeToLeave, VpnKey, VpnLock } from "@material-ui/icons";
import ChangePassword from "../components/pages/ChangePassword/ChangePassword";

// Guards
// const AuthGuard = async(() => import("../components/AuthGuard"));
const AppGuard = async(() => import("../components/AppGuard"));


// Dashboards components
// const Default = async(() => import("../pages/dashboards/Default"));
// const Analytics = async(() => import("../pages/dashboards/Analytics"));
// const SaaS = async(() => import("../pages/dashboards/SaaS"));
const Dashborad = async(() =>
  import("../components/pages/Dashboard/Dashboard")
);

const Permissions = async(() =>
  import("../components/pages/UserManagement/Permissions/Permissions")
);
const Roles = async(() =>
  import("../components/pages/UserManagement/Roles/Roles")
);
const UsersComponent = async(() =>
  import("../components/pages/UserManagement/Users/Users")
);
const AuditLogs = async(() =>
  import("../components/pages/UserManagement/AuditLogs/AuditLogs.js")
);

const Categories = async(() =>
  import("../components/pages/ProductManagement/Categories/Categories")
);
const CarMade = async(() =>
  import("../components/pages/ProductManagement/CarMade/CarMade.js")
);
const CarModel = async(() =>
  import("../components/pages/ProductManagement/CarModel/CarModel.js")
);
const PartCategory = async(() =>
  import("../components/pages/ProductManagement/PartCategory/PartCategory.js")
);
const CarYear = async(() =>
  import("../components/pages/ProductManagement/CarYear/CarYear.js")
);
const Tags = async(() =>
  import("../components/pages/ProductManagement/Tags/Tags.js")
);
const Products = async(() =>
  import("../components/pages/ProductManagement/Products/Products.js")
);

const AddVendor = async(() =>
  import("../components/pages/Vendor/AddVendor")
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
  icon: <Dashboard />,
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
      component: Permissions,
      icon: <Unlock />,
    },
    {
      path: "/user-mgt/roles",
      name: "Roles",
      component: Roles,
      icon: <BusinessCenter />,
    },
    {
      path: "/user-mgt/users",
      name: "Users",
      component: UsersComponent,
      icon: <User />,
    },
    {
      path: "/user-mgt/logs",
      name: "Audit Logs",
      component: AuditLogs,
      icon: <FileText />,
    },
  ],
};


const productManagementRoutes = {
  id: "Product Management",
  path: "/product",
  icon: <ShoppingCart />,
  component: null,
  children: [
    {
      path: "/product/categories",
      name: "Categories",
      component: Categories,
      icon: <Folder />,
    },
    {
      path: "/product/car-made",
      name: "Car Made",
      component: CarMade,
      icon: <TimeToLeave />,
    },
    {
      path: "/product/car-model",
      name: "Car Model",
      component: CarModel,
      icon: <LockOpen />,
    },
    {
      path: "/product/part-category",
      name: "Part Category",
      component: PartCategory,
      icon: <LockOpen />,
    },
    {
      path: "/product/car-year",
      name: "Car Year",
      component: CarYear,
      icon: <Calendar />,
    },
    {
      path: "/product/tags",
      name: "Tags",
      component: Tags,
      icon: <Tag />,
    },
    {
      path: "/product/products",
      name: "Products",
      component: Products,
      icon: <LockOpen />,
    },
  ],
};


const vendorRoutes = {
  id: "Vendor",
  path: "/vendor",
  icon: <GroupWork />,
  component: null,
  children: [
    {
      path: "/vendor/add",
      name: "Add Vendor",
      component: AddVendor,
      icon: <GroupAdd />,
    },
  ],
};

const changePasswordRoute = {
  id: "Change Password",
  path: "/profile",
  icon: <VpnKey />,
  component: ChangePassword,
  children: null,
};

const logoutRoute = {
  id: "Logout",
  path: "/sign-in",
  icon: <LogOut />,
  component: Dashborad,
  children: null,
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
      guard: AppGuard
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
export const dashboardLayoutRoutes = [dashboardRoutes, userManagementRoutes, productManagementRoutes, vendorRoutes, changePasswordRoute];

// Routes using the Auth layout
export const authLayoutRoutes = [authRoutes, logoutRoute];

// Routes that are protected
// export const protectedRoutes = [protectedPageRoutes];

// Routes visible in the sidebar
export const sidebarRoutes = [dashboardRoutes, userManagementRoutes, productManagementRoutes, vendorRoutes, changePasswordRoute, logoutRoute];
