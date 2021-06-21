import React from "react";

import async from "../components/Async";

import {
  Calendar,
  Clipboard,
  FileText,
  Folder,
  LogOut,
  Map,
  ShoppingBag,
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
  EventNote,
  Explore,
  Group,
  GroupAdd,
  GroupWork,
  HourglassEmpty,
  LiveHelp,
  NewReleases,
  Public,
  QuestionAnswer,
  Receipt,
  RecentActors,
  Report,
  Room,
  ShoppingBasket,
  Store,
  TimeToLeave,
  VpnKey,
} from "@material-ui/icons";

// Guards
const PermissionGuard = async(() =>
  import("../Permissions Guard/PermissionGuard")
);
const UserManagementGuard = async(() =>
  import("../Permissions Guard/UserManagementGuard")
);
const ProductManagementGuard = async(() =>
  import("../Permissions Guard/ProductManagementGuard")
);
const VendorsGuard = async(() => import("../Permissions Guard/VendorsGuard"));
const GeographyGuard = async(() =>
  import("../Permissions Guard/GeographyGuard")
);

const StoresGuard = async(() => import("../Permissions Guard/StoresGuard"));
const OrdersGuard = async(() => import("../Permissions Guard/OrdersGuard"));
const InvoicesGuard = async(() => import("../Permissions Guard/InvoicesGuard"));
const ManageAccountGuard = async(() =>
  import("../Permissions Guard/ManageAccountGuard")
);

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
const Brand = async(() =>
  import("../components/pages/ProductManagement/CarMade/Brand.js")
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

const Vendors = async(() =>
  import("../components/pages/Vendor/AddVendor/Vendors")
);
const VendorOrders = async(() =>
  import("../components/pages/Vendor/AddVendor/VendorOrders")
);
const ViewVendorOrder = async(() =>
  import("../components/pages/Vendor/AddVendor/ViewVendorOrder")
);
const VendorInvoices = async(() =>
  import("../components/pages/Vendor/AddVendor/VendorInvoices")
);
const ViewVendorInvoice = async(() =>
  import("../components/pages/Vendor/AddVendor/ViewVendorInvoice")
);

/* Geography */
const Countries = async(() =>
  import("../components/pages/Geography/Countries/Countries")
);
const Areas = async(() => import("../components/pages/Geography/Areas/Areas"));
const Cities = async(() =>
  import("../components/pages/Geography/Cities/Cities.js")
);

const ViewCountry = async(() =>
  import("../components/pages/Geography/Countries/ViewCountry")
);
const ViewArea = async(() =>
  import("../components/pages/Geography/Areas/ViewArea")
);
const ViewCity = async(() =>
  import("../components/pages/Geography/Cities/ViewCity")
);
/* Geography */

const Reports = async(() =>
  import("../components/pages/AdvancedReports/Reports")
);

const Stores = async(() => import("../components/pages/Vendor/Stores/Stores"));
const PendingOrders = async(() =>
  import("../components/pages/Vendor/Orders/PendingOrders")
);
const OrdersHistory = async(() =>
  import("../components/pages/Vendor/Orders/OrdersHistory")
);
const Invoices = async(() =>
  import("../components/pages/Vendor/Invoices/Invoices")
);

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
const ViewInvoice = async(() =>
  import("../components/pages/Vendor/Invoices/ViewInvoice")
);

const Tickets = async(() => import("../components/pages/Support/Support"));
const ViewTicket = async(() =>
  import("../components/pages/Support/ViewTicket")
);

const Help = async(() => import("../components/pages/Help/Help"));

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
  noPermissionRequired: true,
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
      guard: PermissionGuard,
      permission: "permission_access",
    },
    {
      path: "/user-mgt/roles",
      name: "Roles",
      component: Roles,
      icon: <BusinessCenter />,
      guard: PermissionGuard,
      permission: "role_access",
    },
    {
      path: "/user-mgt/users",
      name: "Users",
      component: UsersComponent,
      icon: <User />,
      guard: PermissionGuard,
      permission: "user_access",
    },
    {
      path: "/user-mgt/logs",
      name: "Audit Logs",
      component: AuditLogs,
      icon: <EventNote />,
      guard: PermissionGuard,
      permission: "audit_log_access",
    },
  ],
  guard: UserManagementGuard,
  permission: "user_management_access",
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
      guard: PermissionGuard,
      permission: "product_category_access",
    },
    {
      path: "/product/brands",
      name: "Brand",
      component: Brand,
      icon: <TimeToLeave />,
      guard: PermissionGuard,
      permission: "car_made_access",
    },
    {
      path: "/product/car-model",
      name: "Car Model",
      component: CarModel,
      icon: <NewReleases />,
      guard: PermissionGuard,
      permission: "car_model_access",
    },
    {
      path: "/product/part-category",
      name: "Part Category",
      component: PartCategory,
      icon: <Category />,
      guard: PermissionGuard,
      permission: "part_category_access",
    },
    {
      path: "/product/car-year",
      name: "Car Year",
      component: CarYear,
      icon: <Calendar />,
      guard: PermissionGuard,
      permission: "car_year_access",
    },
    {
      path: "/product/tags",
      name: "Tags",
      component: Tags,
      icon: <Tag />,
      guard: PermissionGuard,
      permission: "product_tag_access",
    },
    {
      path: "/product/products",
      name: "Products",
      component: Products,
      icon: <ShoppingBag />,
      guard: PermissionGuard,
      permission: "product_access",
    },
  ],
  guard: ProductManagementGuard,
  permission: "product_management_access",
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
      path: "/vendor/vendors",
      name: "Vendors",
      component: Vendors,
      icon: <RecentActors />,
      guard: PermissionGuard,
      permission: "add_vendor_access",
    },
    {
      path: "/vendor/stores",
      name: "Stores",
      component: Stores,
      icon: <Store />,
      guard: PermissionGuard,
      permission: "stores_access",
    },
    {
      path: "/vendor/pending-orders",
      name: "Pending Orders",
      component: PendingOrders,
      icon: <HourglassEmpty />,
      guard: PermissionGuard,
      permission: "show_orders_access",
    },
    {
      path: "/vendor/orders-history",
      name: "Orders History",
      component: OrdersHistory,
      icon: <ShoppingBasket />,
      guard: PermissionGuard,
      permission: "show_orders_access",
    },
    {
      path: "/vendor/invoices",
      name: "Invoices",
      component: Invoices,
      icon: <Receipt />,
      guard: PermissionGuard,
      permission: "show_invoices_access",
    },
  ],
  guard: VendorsGuard,
  permission: "vendor_access",
};
const viewVendor = {
  path: "/vendor/vendors/:id",
  component: ViewVendor,
  children: null,
};
const vendorOrders = {
  path: "/vendor/vendors/:id/vendor-orders",
  component: VendorOrders,
  children: null,
  guard: PermissionGuard,
  permission: "admin_access_vendor_orders",
};
const viewVendorOrder = {
  path: "/vendor/vendors/:id/vendor-orders/:orderId",
  component: ViewVendorOrder,
  children: null,
  guard: PermissionGuard,
  permission: "admin_access_specific_vendor_specific_order",
};
const vendorInvoices = {
  path: "/vendor/vendors/:id/vendor-invoices",
  component: VendorInvoices,
  children: null,
  guard: PermissionGuard,
  permission: "admin_access_vendor_invoices",
};
const viewVendorInvoice = {
  path: "/vendor/vendors/:id/vendor-invoices/:invoiceId",
  component: ViewVendorInvoice,
  children: null,
  guard: PermissionGuard,
  permission: "admin_access_specific_vendor_specific_invoice",
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
const viewInvoice = {
  path: "/vendor/invoices/:id",
  component: ViewInvoice,
  children: null,
};

const geographyRoutes = {
  id: "Geography",
  path: "/geography",
  icon: <Map />,
  component: null,
  children: [
    {
      path: "/geography/countries",
      name: "Countries",
      component: Countries,
      icon: <Public />,
      guard: PermissionGuard,
      permission: "countries_access",
    },
    {
      path: "/geography/areas",
      name: "Areas",
      component: Areas,
      icon: <Explore />,
      guard: PermissionGuard,
      permission: "areas_access",
    },
    {
      path: "/geography/cities",
      name: "Cities",
      component: Cities,
      icon: <Room />,
      guard: PermissionGuard,
      permission: "cities_access",
    },
  ],
  guard: GeographyGuard,
  permission: "countries_access",
};

const viewCountry = {
  path: "/geography/countries/:id",
  component: ViewCountry,
  children: null,
};

const viewArea = {
  path: "/geography/areas/:id",
  component: ViewArea,
  children: null,
};

const viewCity = {
  path: "/geography/cities/:id",
  component: ViewCity,
  children: null,
};

const advancedReportsRoute = {
  id: "Reports",
  path: "/reports",
  icon: <Clipboard />,
  component: Reports,
  children: null,
  // guard: StoresGuard,
  noPermissionRequired: true,
};

const storesRoute = {
  id: "Stores",
  path: "/vendor/stores",
  icon: <Store />,
  component: Stores,
  children: null,
  guard: StoresGuard,
  permission: "access_tabs_separately",
};

const pendingOrdersRoute = {
  id: "Pending Orders",
  path: "/vendor/pending-orders",
  icon: <HourglassEmpty />,
  component: PendingOrders,
  children: null,
  guard: OrdersGuard,
  permission: "access_tabs_separately",
};

const ordersHistoryRoute = {
  id: "Orders History",
  path: "/vendor/orders-history",
  icon: <ShoppingBasket />,
  component: OrdersHistory,
  children: null,
  guard: OrdersGuard,
  permission: "access_tabs_separately",
};

const invoicesRoute = {
  id: "Invoices",
  path: "/vendor/invoices",
  icon: <Receipt />,
  component: Invoices,
  children: null,
  guard: InvoicesGuard,
  permission: "access_tabs_separately",
};

const ticketsRoute = {
  id: "Support",
  path: "/support",
  icon: <QuestionAnswer />,
  badge: "11",
  component: Tickets,
  children: null,
  permission: "tickets_access",
};
const viewTicket = {
  path: "/support/ticket/:id",
  component: ViewTicket,
  children: null,
};

const helpRoute = {
  id: "Help",
  path: "/help",
  icon: <LiveHelp />,
  component: Help,
  children: null,
  permission: "help_center_access",
};

const manageAccountRoute = {
  id: "Manage Account",
  path: "/profile",
  icon: <VpnKey />,
  component: ManageAccount,
  children: null,
  guard: ManageAccountGuard,
  permission: "profile_password_edit",
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
  geographyRoutes,
  viewCountry,
  viewArea,
  viewCity,
  advancedReportsRoute,
  storesRoute,
  pendingOrdersRoute,
  ordersHistoryRoute,
  invoicesRoute,
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
  vendorOrders,
  vendorInvoices,
  viewVendorOrder,
  viewVendorInvoice,
  viewStore,
  viewOrder,
  viewInvoice,
  ticketsRoute,
  viewTicket,
  helpRoute,
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
  geographyRoutes,
  viewCountry,
  viewArea,
  viewCity,
  advancedReportsRoute,
  storesRoute,
  pendingOrdersRoute,
  ordersHistoryRoute,
  invoicesRoute,
  ticketsRoute,
  helpRoute,
  manageAccountRoute,
  logoutRoute,
];
