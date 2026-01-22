import authRoutes from "./authRoutes";
import { Detection, DetectionList, DetectionDetail, Dashboard } from "../pages";

const adminRoutes = [
  {
    path: "/customer/detection",
    component: Detection,
  },
  {
    path: "/admin/detections",
    component: DetectionList,
  },
  {
    path: "/admin/detections/:id",
    component: DetectionDetail,
  },
  {
    path: "/admin/dashboard",
    component: Dashboard,
  },
];

const customRoutes = [...authRoutes, ...adminRoutes];

export default customRoutes;
