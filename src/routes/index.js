import React from "react";

import async from "../components/Async";

import {
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
  NewReleases,
  ShoppingBasket,
  Store,
  TimeToLeave,
  VpnKey,
} from "@material-ui/icons";

// Guards
const PermissionGuard = async(() => import("../Permissions Guard/PermissionGuard"));
const UserManagementGuard = async(() => import("../Permissions Guard/UserManagementGuard"));
const ProductManagementGuard = async(() => import("../Permissions Guard/ProductManagementGuard"));
const VendorsGuard = async(() => import("../Permissions Guard/VendorsGuard"));
const ManageAccountGuard = async(() => import("../Permissions Guard/ManageAccountGuard"));



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
const Orders = async(() => import("../components/pages/Vendor/Orders/Orders"));

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
const ViewOrder = async(() =>
  import("../components/pages/Vendor/Orders/ViewOrder")
);

const ManageAccount = async(() =>
  import("../components/pages/ManageAccount/ManageAccount")
);

const dashboardRoutes = {
  id: "Dashborad",
  path: "/",
  icon: <Dashboard />,
  badge: "8",
  component: Dashborad,
  children: null,
  containsHome: true,
  noPermissionRequired: true
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
      guard:PermissionGuard,
      permission: "permission_access"
    },
    {
      path: "/user-mgt/roles",
      name: "Roles",
      component: Roles,
      icon: <BusinessCenter />,
      guard:PermissionGuard,
      permission: "role_access"
    },
    {
      path: "/user-mgt/users",
      name: "Users",
      component: UsersComponent,
      icon: <User />,
      guard:PermissionGuard,
      permission: "user_access"
    },
    {
      path: "/user-mgt/logs",
      name: "Audit Logs",
      component: AuditLogs,
      icon: <FileText />,
      guard:PermissionGuard,
      permission: "audit_log_access"
    },
  ],
  guard:UserManagementGuard,
  permission: "user_management_access"
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
      guard:PermissionGuard,
      permission: "product_category_access"
    },
    {
      path: "/product/car-made",
      name: "Car Made",
      component: CarMade,
      icon: <TimeToLeave />,
      guard:PermissionGuard,
      permission: "car_made_access"
    },
    {
      path: "/product/car-model",
      name: "Car Model",
      component: CarModel,
      icon: <NewReleases />,
      guard:PermissionGuard,
      permission: "car_model_access"
    },
    {
      path: "/product/part-category",
      name: "Part Category",
      component: PartCategory,
      icon: <Category />,
      guard:PermissionGuard,
      permission: "part_category_access"
    },
    {
      path: "/product/car-year",
      name: "Car Year",
      component: CarYear,
      icon: <Calendar />,
      guard:PermissionGuard,
      permission: "car_year_access"
    },
    {
      path: "/product/tags",
      name: "Tags",
      component: Tags,
      icon: <Tag />,
      guard:PermissionGuard,
      permission: "product_tag_access"
    },
    {
      path: "/product/products",
      name: "Products",
      component: Products,
      icon: <Store />,
      guard:PermissionGuard,
      permission: "product_access"
    },
  ],
  guard:ProductManagementGuard,
  permission: "product_management_access"
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
      guard:PermissionGuard,
      permission: "add_vendor_access"
    },
    {
      path: "/vendor/stores",
      name: "Stores",
      component: Stores,
      icon: <Store />,
      guard:PermissionGuard,
      permission: "stores_access"
    },
    {
      path: "/vendor/orders",
      name: "Orders",
      component: Orders,
      icon: <ShoppingBasket />,
      guard:PermissionGuard,
      permission: "show_orders_access"
    },
  ],
  guard:VendorsGuard,
  permission: "vendor_access"
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
const viewOrder = {
  path: "/vendor/orders/:id",
  component: ViewOrder,
  children: null,
};


const manageAccountRoute = {
  id: "Manage Account",
  path: "/profile",
  icon: <VpnKey />,
  component: ManageAccount,
  children: null,
  guard:ManageAccountGuard,
  permission: "profile_password_edit"
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
  viewOrder,
  manageAccountRoute,
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
  manageAccountRoute,
  logoutRoute,
];
