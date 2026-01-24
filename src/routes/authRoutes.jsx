import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";

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

export default authRoutes;
