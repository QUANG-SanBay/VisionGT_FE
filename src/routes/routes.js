import React from "react";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
// Pages
import {  Detection, DetectionList, DetectionDetail, Dashboard, History  } from "../pages";
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
    path: "/customer/history",
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


const adminRoutes = [
  {
    path: "/admin/detections",
    component: withAdminLayout(DetectionList),
  },
  {
    path: "/admin/detections/:id",
    component: withAdminLayout(DetectionDetail),
  },
  {
    path: "/admin/dashboard",
    component: withAdminLayout(Dashboard),
  },
];

const authRoutes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
];
export { customRoutes, adminRoutes, authRoutes };
