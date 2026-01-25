import { Routes, Route } from "react-router-dom";
import { customRoutes, adminRoutes, authRoutes } from "./routes";
const AppRouter = () => {
  return (
    <Routes>
      {authRoutes.map((route, index) => {
        const Page = route.component;
        return <Route key={index} path={route.path} element={<Page />} />;
      })}
      {customRoutes.map((route, index) => {
        const Page = route.component;
        return <Route key={index} path={route.path} element={<Page />} />;
      })}
      {adminRoutes.map((route, index) => {
        const Page = route.component;
        return <Route key={index} path={route.path} element={<Page />} />;
      })}
    </Routes>
  );
};

export default AppRouter;
