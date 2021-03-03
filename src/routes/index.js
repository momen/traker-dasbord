import React from "react";

import async from "../components/Async";

import {
  Briefcase,
  Calendar,
  FileText,
  Folder,
  LogOut,
  ShoppingCart,
  Tag,
  Unlock,
  User,
  Users,
} from "react-feather";
import {
  BusinessCenter,
  Category,
  Dashboard,
  Group,
  GroupAdd,
  GroupWork,
  LockOpen,
  NewReleases,
  Store,
  TimeToLeave,
  VpnKey,
  VpnLock,
} from "@material-ui/icons";

// Guards
// const AuthGuard = async(() => import("../components/AuthGuard"));
const AppGuard = async(() => import("../components/AppGuard"));

// Dashboards components
// const Default = async(() => import("../pages/dashboards/Default"));
// const Analytics = async(() => import("../pages/dashboards/Analytics"));
// const SaaS = async(() => import("../pages/dashboards/SaaS"));

const AuthGuard = async(() => import("../components/AuthGuard"));

const SignIn = async(() => import("../components/pages/SignIn/SignIn"));

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

const Vendors = async(() => import("../components/pages/Vendor/AddVendor/Vendors"));
const Stores = async(() => import("../components/pages/Vendor/Stores/Stores"));

const ViewPermission = async(() =>
  import("../components/pages/UserManagement/Permissions/ViewPermission")
);
const ViewRole = async(() =>
  import("../components/pages/UserManagement/Roles/ViewRole")
);
const ViewUser = async(() =>
  import("../components/pages/UserManagement/Users/ViewUser")
);
const ViewLog = async(() =>
  import("../components/pages/UserManagement/AuditLogs/ViewLog")
);

const ViewCategory = async(() =>
  import("../components/pages/ProductManagement/Categories/ViewCategory")
);
const ViewCarMade = async(() =>
  import("../components/pages/ProductManagement/CarMade/ViewCarMade")
);
const ViewCarModel = async(() =>
  import("../components/pages/ProductManagement/CarModel/ViewCarModel")
);
const ViewPartCategory = async(() =>
  import("../components/pages/ProductManagement/PartCategory/ViewPartCategory")
);
const ViewCarYear = async(() =>
  import("../components/pages/ProductManagement/CarYear/ViewCarYear")
);
const ViewProductTag = async(() =>
  import("../components/pages/ProductManagement/Tags/ViewTag")
);
const ViewProduct = async(() =>
  import("../components/pages/ProductManagement/Products/ViewProduct")
);


const ViewVendor = async(() =>
  import("../components/pages/Vendor/AddVendor/ViewVendor")
);
const ViewStore = async(() =>
  import("../components/pages/Vendor/Stores/ViewStore")
);

const ChangePassword = async(() =>
  import("../components/pages/ChangePassword/ChangePassword")
);

const dashboardRoutes = {
  id: "Dashborad",
  path: "/",
  icon: <Dashboard />,
  badge: "8",
  component: Dashborad,
  children: null,
  containsHome: true,
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

const viewPermission = {
  path: "/user-mgt/permissions/:id",
  component: ViewPermission,
  children: null,
};

const viewRole = {
  path: "/user-mgt/roles/:id",
  component: ViewRole,
  children: null,
};

const viewUser = {
  path: "/user-mgt/users/:id",
  component: ViewUser,
  children: null,
};

const viewLog = {
  path: "/user-mgt/logs/:id",
  component: ViewLog,
  children: null,
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
      icon: <NewReleases />,
    },
    {
      path: "/product/part-category",
      name: "Part Category",
      component: PartCategory,
      icon: <Category />,
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
      icon: <Store />,
    },
  ],
};

const viewCategory = {
  path: "/product/categories/:id",
  component: ViewCategory,
  children: null,
};
const viewCarMade = {
  path: "/product/car-made/:id",
  component: ViewCarMade,
  children: null,
};
const viewCarModel = {
  path: "/product/car-model/:id",
  component: ViewCarModel,
  children: null,
};
const viewPartCategory = {
  path: "/product/part-category/:id",
  component: ViewPartCategory,
  children: null,
};
const viewCarYear = {
  path: "/product/car-year/:id",
  component: ViewCarYear,
  children: null,
};
const viewProductTag = {
  path: "/product/tags/:id",
  component: ViewProductTag,
  children: null,
};

const viewProduct = {
  path: "/product/products/:id",
  component: ViewProduct,
  children: null,
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
      component: Vendors,
      icon: <GroupAdd />,
    },
    {
      path: "/vendor/stores",
      name: "Stores",
      component: Stores,
      icon: <Store />,
    },
  ],
};

const viewVendor = {
  path: "/vendor/add/:id",
  component: ViewVendor,
  children: null,
};
const viewStore = {
  path: "/vendor/stores/:id",
  component: ViewStore,
  children: null,
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
      // guard: AppGuard,
    },
    // {
    //   path: "/auth/sign-up",
    //   name: "Sign Up",
    //   component: SignUp,
    // },
  ],
  component: null,
};

// Routes using the Dashboard layout
export const dashboardLayoutRoutes = [
  dashboardRoutes,
  userManagementRoutes,
  productManagementRoutes,
  vendorRoutes,
  viewPermission,
  viewRole,
  viewUser,
  viewLog,
  viewCategory,
  viewCarMade,
  viewCarModel,
  viewPartCategory,
  viewCarYear,
  viewProductTag,
  viewProduct,
  viewVendor,
  viewStore,
  changePasswordRoute,
];

// Routes using the Auth layout
export const authLayoutRoutes = [authRoutes, logoutRoute];

// Routes that are protected
// export const protectedRoutes = [protectedPageRoutes];

// Routes visible in the sidebar
export const sidebarRoutes = [
  dashboardRoutes,
  userManagementRoutes,
  productManagementRoutes,
  vendorRoutes,
  changePasswordRoute,
  logoutRoute,
];
