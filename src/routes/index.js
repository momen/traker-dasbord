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
  Build,
  BusinessCenter,
  Category,
  Class,
  Commute,
  Dashboard,
  EventNote,
  Explore,
  Group,
  GroupAdd,
  GroupWork,
  HelpOutline,
  HourglassEmpty,
  Language,
  LiveHelp,
  NewReleases,
  PermMedia,
  Public,
  QuestionAnswer,
  Receipt,
  RecentActors,
  Report,
  Room,
  ShoppingBasket,
  Store,
  TimeToLeave,
  TripOrigin,
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
const VendorStaff = async(() =>
  import("../components/pages/UserManagement/VendorStaff/Users")
);
const AuditLogs = async(() =>
  import("../components/pages/UserManagement/AuditLogs/AuditLogs.js")
);

const MainCategories = async(() =>
  import("../components/pages/ProductManagement/Main Categories/MainCategories")
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
const CarTypes = async(() =>
  import("../components/pages/ProductManagement/CarTypes/CarTypes.js")
);
const Manufacturers = async(() =>
  import("../components/pages/ProductManagement/Manufacturers/Manufacturers.js")
);
const Origins = async(() =>
  import("../components/pages/ProductManagement/Origins/Origins.js")
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
const TotalOrders = async(() =>
  import("../components/pages/Vendor/Orders/TotalOrders")
);

const WholesaleOrders = async(() =>
  import("../components/pages/Vendor/Wholesale Orders/TotalOrders")
);

const OrdersHistory = async(() =>
  import("../components/pages/Vendor/Orders/OrdersHistory")
);
const Invoices = async(() =>
  import("../components/pages/Vendor/Invoices/Invoices")
);

const WholesaleInvoices = async(() =>
  import("../components/pages/Vendor/Wholesale Invoices/WholesaleInvoices")
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
const ViewStaff = async(() =>
  import("../components/pages/UserManagement/VendorStaff/ViewUser")
);
const ViewLog = async(() =>
  import("../components/pages/UserManagement/AuditLogs/ViewLog")
);

const ViewMainCategory = async(() =>
  import(
    "../components/pages/ProductManagement/Main Categories/ViewMainCategory"
  )
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
const ViewCarType = async(() =>
  import("../components/pages/ProductManagement/CarTypes/ViewCarType")
);
const ViewManufacturer = async(() =>
  import("../components/pages/ProductManagement/Manufacturers/ViewManufacturer")
);
const ViewOrigin = async(() =>
  import("../components/pages/ProductManagement/Origins/ViewOrigin")
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

const ViewWholeSaleInvoice = async(() =>
  import("../components/pages/Vendor/Wholesale Invoices/ViewInvoice")
);

const Ads = async(() =>
  import("../components/pages/Advertisments/Advertisments")
);
const Tickets = async(() => import("../components/pages/Support/Support"));
const ViewTicket = async(() =>
  import("../components/pages/Support/ViewTicket")
);

const ProductQuestions = async(() =>
  import("../components/pages/Product Questions/ProductQuestions")
);
const ViewProductQuestion = async(() =>
  import("../components/pages/Product Questions/ViewProductQuestion")
);

const Help = async(() => import("../components/pages/Help/Help"));

const ManageAccount = async(() =>
  import("../components/pages/ManageAccount/ManageAccount")
);

const dashboardRoutes = {
  id: "main",
  path: "/",
  icon: <Dashboard />,
  badge: "8",
  component: Dashborad,
  children: null,
  containsHome: true,
  noPermissionRequired: true,
};

const userManagementRoutes = {
  id: "userMgt",
  path: "/user-mgt",
  icon: <Group />,
  component: null,
  children: [
    {
      path: "/user-mgt/permissions",
      name: "permissions",
      component: Permissions,
      icon: <Unlock />,
      guard: PermissionGuard,
      permission: "permission_access",
    },
    {
      path: "/user-mgt/roles",
      name: "roles",
      component: Roles,
      icon: <BusinessCenter />,
      guard: PermissionGuard,
      permission: "role_access",
    },
    {
      path: "/user-mgt/users",
      name: "users",
      component: UsersComponent,
      icon: <User />,
      guard: PermissionGuard,
      permission: "user_access",
    },
    {
      path: "/user-mgt/vendor-users",
      name: "staff",
      component: VendorStaff,
      icon: <User />,
      guard: PermissionGuard,
      permission: "vendor_add_staff",
    },
    {
      path: "/user-mgt/logs",
      name: "logs",
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

const viewStaff = {
  path: "/user-mgt/vendor-users/:id",
  component: ViewStaff,
  children: null,
};

const viewLog = {
  path: "/user-mgt/logs/:id",
  component: ViewLog,
  children: null,
};

const productManagementRoutes = {
  id: "productMgt",
  path: "/product",
  icon: <ShoppingCart />,
  component: null,
  children: [
    {
      path: "/product/main-categories",
      name: "mainCatgory",
      component: MainCategories,
      icon: <Class />,
      guard: PermissionGuard,
      permission: "main_categories_access",
    },
    {
      path: "/product/categories",
      name: "category",
      component: Categories,
      icon: <Folder />,
      guard: PermissionGuard,
      permission: "product_category_access",
    },
    {
      path: "/product/part-category",
      name: "partCategory",
      component: PartCategory,
      icon: <Category />,
      guard: PermissionGuard,
      permission: "part_category_access",
    },
    {
      path: "/product/brands",
      name: "brands",
      component: Brand,
      icon: <TimeToLeave />,
      guard: PermissionGuard,
      permission: "car_made_access",
    },
    {
      path: "/product/car-model",
      name: "models",
      component: CarModel,
      icon: <NewReleases />,
      guard: PermissionGuard,
      permission: "car_model_access",
    },

    {
      path: "/product/car-year",
      name: "years",
      component: CarYear,
      icon: <Calendar />,
      guard: PermissionGuard,
      permission: "car_year_access",
    },
    {
      path: "/product/tags",
      name: "tags",
      component: Tags,
      icon: <Tag />,
      guard: PermissionGuard,
      permission: "product_tag_access",
    },
    {
      path: "/product/car-types",
      name: "carTypes",
      component: CarTypes,
      icon: <Commute />,
      guard: PermissionGuard,
      permission: "car_type_access",
    },
    {
      path: "/product/manufacturers",
      name: "manufacturers",
      component: Manufacturers,
      icon: <Build />,
      guard: PermissionGuard,
      permission: "manufacturers_access",
    },
    {
      path: "/product/origin-countries",
      name: "origins",
      component: Origins,
      icon: <TripOrigin />,
      guard: PermissionGuard,
      permission: "origin_countries_access",
    },
    {
      path: "/product/products",
      name: "products",
      component: Products,
      icon: <ShoppingBag />,
      guard: PermissionGuard,
      permission: "product_access",
    },
  ],
  guard: ProductManagementGuard,
  permission: "product_management_access",
};

const viewMainCategory = {
  path: "/product/main-categories/:id",
  component: ViewMainCategory,
  children: null,
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

const viewCarType = {
  path: "/product/car-types/:id",
  component: ViewCarType,
  children: null,
};

const viewManufacturer = {
  path: "/product/manufacturers/:id",
  component: ViewManufacturer,
  children: null,
};

const viewOrigin = {
  path: "/product/origin-countries/:id",
  component: ViewOrigin,
  children: null,
};

const viewProduct = {
  path: "/product/products/:id",
  component: ViewProduct,
  children: null,
};

const vendorRoutes = {
  id: "vendorMgt",
  path: "/vendor",
  icon: <GroupWork />,
  component: null,
  children: [
    {
      path: "/vendor/vendors",
      name: "vendors",
      component: Vendors,
      icon: <RecentActors />,
      guard: PermissionGuard,
      permission: "add_vendor_access",
    },
    {
      path: "/vendor/branches",
      name: "branches",
      component: Stores,
      icon: <Store />,
      guard: PermissionGuard,
      permission: "stores_access",
    },
    {
      path: "/vendor/total-orders",
      name: "totalOrders",
      component: TotalOrders,
      icon: <ShoppingBasket />,
      guard: PermissionGuard,
      permission: "show_orders_access",
    },

    {
      path: "/vendor/wholesale-orders",
      name: "wholesaleOrders",
      component: WholesaleOrders,
      icon: <ShoppingBasket />,
      guard: PermissionGuard,
      permission: "wholesale_orders_access",
    },

    {
      path: "/vendor/invoices",
      name: "invoices",
      component: Invoices,
      icon: <Receipt />,
      guard: PermissionGuard,
      permission: "show_invoices_access",
    },
    {
      path: "/vendor/wholesale-invoices",
      name: "wholesaleInvoices",
      component: WholesaleInvoices,
      icon: <Receipt />,
      guard: PermissionGuard,
      permission: "wholesale_invoices_access",
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
  path: "/vendor/branches/:id",
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
const viewWholesaleInvoice = {
  path: "/vendor/wholesale-invoices/:id",
  component: ViewWholeSaleInvoice,
  children: null,
};

const geographyRoutes = {
  id: "geography",
  path: "/geography",
  icon: <Map />,
  component: null,
  children: [
    {
      path: "/geography/countries",
      name: "countries",
      component: Countries,
      icon: <Public />,
      guard: PermissionGuard,
      permission: "countries_access",
    },
    {
      path: "/geography/areas",
      name: "areas",
      component: Areas,
      icon: <Explore />,
      guard: PermissionGuard,
      permission: "areas_access",
    },
    {
      path: "/geography/cities",
      name: "cities",
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
  id: "reports",
  path: "/reports",
  icon: <Clipboard />,
  component: Reports,
  children: null,
  // guard: StoresGuard,
  noPermissionRequired: true,
};

const storesRoute = {
  id: "branches",
  path: "/vendor/branches",
  icon: <Store />,
  component: Stores,
  children: null,
  guard: StoresGuard,
  permission: "access_tabs_separately",
};

const pendingOrdersRoute = {
  id: "totalOrders",
  path: "/vendor/total-orders",
  icon: <ShoppingBasket />,
  component: TotalOrders,
  children: null,
  guard: OrdersGuard,
  permission: "access_tabs_separately",
};

// const ordersHistoryRoute = {
//   id: "Orders History",
//   path: "/vendor/orders-history",
//   icon: <ShoppingBasket />,
//   component: OrdersHistory,
//   children: null,
//   guard: OrdersGuard,
//   permission: "access_tabs_separately",
// };

const invoicesRoute = {
  id: "invoices",
  path: "/vendor/invoices",
  icon: <Receipt />,
  component: Invoices,
  children: null,
  guard: InvoicesGuard,
  permission: "access_tabs_separately",
};

const adsRoute = {
  id: "ads",
  path: "/ads",
  icon: <PermMedia />,
  badge: "11",
  component: Ads,
  children: null,
  permission: "advertisements_access",
};

const ticketsRoute = {
  id: "tickets",
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

const productQuestionsRoute = {
  id: "productInquiries",
  path: "/product/questions",
  icon: <HelpOutline />,
  badge: "11",
  component: ProductQuestions,
  children: null,
  permission: "fetch_vendor_questions",
};
const viewProductQuestion = {
  path: "/product/questions/:id",
  component: ViewProductQuestion,
  children: null,
};

const helpRoute = {
  id: "help",
  path: "/help",
  icon: <LiveHelp />,
  component: Help,
  children: null,
  permission: "help_center_access",
};

const manageAccountRoute = {
  id: "manageAccount",
  path: "/profile",
  icon: <VpnKey />,
  component: ManageAccount,
  children: null,
  guard: ManageAccountGuard,
  permission: "profile_password_edit",
};

const languageRoute = {
  id: "Language",
  icon: <Language />,
  children: null,
};

const logoutRoute = {
  id: "logout",
  path: "/sign-in",
  icon: <LogOut />,
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
  adsRoute,
  storesRoute,
  pendingOrdersRoute,
  // ordersHistoryRoute,
  invoicesRoute,
  viewPermission,
  viewRole,
  viewUser,
  viewStaff,
  viewLog,
  viewMainCategory,
  viewCategory,
  viewCarMade,
  viewCarModel,
  viewPartCategory,
  viewCarYear,
  viewProductTag,
  viewCarType,
  viewManufacturer,
  viewOrigin,
  viewProduct,
  viewVendor,
  vendorOrders,
  vendorInvoices,
  viewVendorOrder,
  viewVendorInvoice,
  viewStore,
  viewOrder,
  viewInvoice,
  viewWholesaleInvoice,
  ticketsRoute,
  viewTicket,
  productQuestionsRoute,
  viewProductQuestion,
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
  advancedReportsRoute,
  adsRoute,
  storesRoute,
  pendingOrdersRoute,
  // ordersHistoryRoute,
  invoicesRoute,
  ticketsRoute,
  productQuestionsRoute,
  helpRoute,
  manageAccountRoute,
  languageRoute,
  logoutRoute,
];
