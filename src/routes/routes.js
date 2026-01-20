import React from "react";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// Pages
import { Detection } from "../pages";
import History from "../pages/History";
import AdminDashboard from "../pages/admin/dashboard/Dashboard";

/**
 * NOTE:
 * - KHÔNG JSX
 * - KHÔNG <Component />
 */
const withLayout = (Component) => {
  return function WrappedComponent() {
    return React.createElement(
      MainLayout,
      null,
      React.createElement(Component, null)
    );
  };
};

const withAdminLayout = (Component) => {
  return function WrappedComponent() {
    return React.createElement(
      AdminLayout,
      null,
      React.createElement(Component, null)
    );
  };
};

const customRoutes = [
  {
    path: "/",
    component: withLayout(Detection),
  },
  {
    path: "/customer/detection",
    component: withLayout(Detection),
  },
  {
    path: "/history",
    component: withLayout(History),
  },
  {
    path: "/admin",
    component: withAdminLayout(AdminDashboard),
  },
  {
    path: "/admin/dashboard",
    component: withAdminLayout(AdminDashboard),
  },
];

export default customRoutes;
