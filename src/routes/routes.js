import React from "react";
import MainLayout from "../layouts/MainLayout";

// Pages
import { Detection } from "../pages";
import History from "../pages/History";

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

const customRoutes = [
  {
    path: "/",
    component: withLayout(Detection), // tạm cho "/" trỏ về detection
  },
  {
    path: "/customer/detection",
    component: withLayout(Detection),
  },
  {
    path: "/history",
    component: withLayout(History),
  },
];

export default customRoutes;
