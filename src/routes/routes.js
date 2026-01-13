// src/routes/routes.js
// Define route -> component mapping. Router consumer expects this shape.
import { Detection, DetectionList, DetectionDetail, Dashboard } from '../pages';

const customRoutes = [
    {
        path: '/customer/detection',
        component: Detection,
    },

    // Admin routes for managing detections and viewing dashboard
    {
        path: '/admin/detections',
        component: DetectionList,
    },
    {
        path: '/admin/detections/:id',
        component: DetectionDetail,
    },
    {
        path: '/admin/dashboard',
        component: Dashboard,
    },
];

export default customRoutes;